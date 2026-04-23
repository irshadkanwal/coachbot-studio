'use server';

import { SIGNUP_MODE_COOKIE_NAME } from '@/lib/constants';
import { deleteFirebaseUser } from '@/lib/firebase';
import { User } from '@/lib/models/common.models';
import { isActiveSubscription } from '@/lib/utils/common.utils';
import { deleteCookie, getCookie } from '@/lib/utils/cookie.utils';
import { userAccountSchema } from '@/lib/utils/db.utils';
import { decrypt } from '@/lib/utils/encryption.utils';
import { getGcpStorageSignedUrl } from '../db/gcpClient';
import { stripeClient } from '../db/stripeClient';
import {
  createUserSubscription,
  deleteUserData,
  getUserData,
  updateUser,
  updateUserSubscription,
} from '../db/userClient';
import { createUserFreeSubscription, getUpdatedSubscriptionData, getUserCurrentPrice } from './checkoutActions';
import { deleteSession, getSessionUser, updateSession } from './sessionActions';

interface DeleteAccountParams {
  email: string;
  password: string;
}

export async function getUser(): Promise<User | null> {
  let userId;
  try {
    userId = await getSessionUser();

    if (!userId) throw new Error('[userActions] User not authenticated!');

    const user = await getUserData(userId || '');

    return user as User;
  } catch (error) {
    console.error(`[userActions] Error fetching user ${userId}`, error);

    return null;
  }
}

export async function updateUserAccount(name: string, email: string): Promise<any> {
  let userId;
  try {
    userId = await getSessionUser();
    const parsedData = userAccountSchema.safeParse({ name, email });

    if (!parsedData.success) {
      return { errors: parsedData.error.errors.map(({ message, path }) => ({ name: path[0], message })) };
    }

    const user = await updateUser(userId || '', { name, email });

    return {
      successMessage: 'Account.accountForm.successMessage',
      value: { name: user?.name || '', email: user?.email || '' },
    };
  } catch (error) {
    console.error(`[userActions] Error updating account data for user ${userId}`, error);

    return { error: 'General.errors.unexpectedError' };
  }
}

export async function updateUserData(data: Partial<User>): Promise<any> {
  let userId;
  try {
    userId = await getSessionUser();

    const user = await updateUser(userId || '', data);

    return user;
  } catch (error) {
    console.error(`[userActions] Error updating user ${userId} data: `, error);

    return { error: 'General.errors.unexpectedError' };
  }
}

export async function deleteUserAccount({
  email,
  password,
}: DeleteAccountParams): Promise<{ success: boolean; error?: string }> {
  let userId;

  try {
    const user = await getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }
    userId = user.id;

    await Promise.all([
      deleteFirebaseUser(email, password),
      stripeClient.deleteCustomer(user.subscription?.customerId),
      deleteUserData(user.id),
      deleteSession(),
    ]);

    return { success: true };
  } catch (error) {
    console.error(`[userActions] Error deleting user account ${userId}:`, error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account',
    };
  }
}

export async function checkSignupModeParam(user: User): Promise<boolean> {
  const encryptedMode = await getCookie<string>(SIGNUP_MODE_COOKIE_NAME);
  const isAllowedParam = !!encryptedMode && process.env.ALLOWED_SIGNUP_MODE_VALUES?.split(',').includes(encryptedMode);

  if (!isAllowedParam) return false;

  const modeData = await decrypt<{ trialDays: number }>(encryptedMode, process.env.ENCODE_SECRET_KEY);
  const freeTrialSub = await createUserFreeSubscription(user, modeData?.trialDays || 14);
  await deleteCookie(SIGNUP_MODE_COOKIE_NAME);

  return !!freeTrialSub;
}

export async function checkExistingSubscription({ subscription, id, email }: User): Promise<boolean | null> {
  const currentPrice = await getUserCurrentPrice({ subscription } as User);

  if (!!subscription && isActiveSubscription(subscription, currentPrice?.id)) return true;

  const stripeSubscription = await stripeClient.getStripeActiveSubscriptionByEmail(email || '');

  if (!stripeSubscription || !id) return null;

  const subscriptionData = await getUpdatedSubscriptionData(stripeSubscription);
  const updatedSubscription = subscription?.customerId
    ? await updateUserSubscription(subscription.customerId, subscriptionData)
    : await createUserSubscription(id, subscriptionData);

  return isActiveSubscription(updatedSubscription, (stripeSubscription as any).plan.id);
}

export async function checkUserSubscription(user: User): Promise<boolean> {
  try {
    const hasExistingSubscription = await checkExistingSubscription(user);

    if (hasExistingSubscription !== null) {
      await deleteCookie(SIGNUP_MODE_COOKIE_NAME);
      return hasExistingSubscription;
    }

    return checkSignupModeParam(user);
  } catch (error: any) {
    console.error(`[userActions] Error checking user ${user.id} subscription:`, error);

    return false;
  }
}

export async function checkUserAccessAllowed(currentUser?: User | null): Promise<boolean> {
  try {
    const user = currentUser || (await getUser());

    if (!user) return false;

    const accessAllowed = user.accessAllowed || (await checkUserSubscription(user));

    await updateSession({ accessAllowed });

    return accessAllowed;
  } catch (error: any) {
    console.error(`[userActions] Error checking user ${currentUser?.id} access allowed:`, error);

    return false;
  }
}

export async function getUserPictureSignedUrl(
  user: User | null,
  expirationMins: number = 1440
): Promise<string | null> {
  try {
    if (!user?.pictureUrl) return null;

    const bucketName = process.env.GCP_MEDIA_BUCKET_NAME || '';
    const fileName = user.pictureUrl.replace(`${bucketName}/`, '');
    const signedUrl = await getGcpStorageSignedUrl(fileName, bucketName, '', expirationMins);

    return signedUrl;
  } catch (error: any) {
    console.error(`[userActions] Error getting user picture ${user?.pictureUrl} signed URL:`, error);

    return null;
  }
}
