'use server';

import { redirect } from 'next/navigation';
import {
  applyActionCode,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from 'firebase/auth';

import { HOME_ROUTE, LOGIN_ROUTE, PublicRoutes } from '@/lib/constants';
import { auth } from '@/lib/firebase';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import { AuthState } from '@/lib/models/auth.models';
import { User } from '@/lib/models/common.models';
import { encrypt } from '@/lib/utils/encryption.utils';
import { sendEmailVerificationLetter } from '../db/sendGridClient';
import { createUser, upsertUser } from '../db/userClient';
import { createSession, deleteSession } from './sessionActions';
import { checkUserAccessAllowed, getUser } from './userActions';

export async function sendVerificationEmail(email: string, name: string): Promise<any> {
  try {
    const link = await firebaseAdmin.getEmailVerificationLink(email, {
      url: `${process.env.APP_BASE_URL}${PublicRoutes.verification}`,
      handleCodeInApp: true,
    });
    const searchParams = new URL(link).searchParams;

    await sendEmailVerificationLetter(email, name || email, searchParams);
  } catch (error) {
    console.error('Error sending verification email :', error);
  }
}

export async function signupUser(state: AuthState): Promise<any> {
  const { email, password, name } = state;

  try {
    const userData: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userData;

    if (!user) throw new Error(`[authActions] User ${email} was not created.`);

    return Promise.all([
      sendVerificationEmail(email, name || ''),
      updateProfile(user, { displayName: name || '' }),
      createUser({ id: user.uid, name, email: user.email, emailVerified: user.emailVerified }),
    ]);
  } catch (error: any) {
    console.error(`[authActions] Error during signup user ${email}`, error);

    return { errorMessage: error.code ? `Auth.errors.${error.code}` : 'Auth.errors.signupFailed' };
  }
}

export async function loginUser({ email, password }: AuthState): Promise<any> {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    if (!user) throw new Error(`[authActions] User "${email}" was not found.`);

    if (!user.emailVerified) {
      return { errorMessage: 'Auth.errors.emailNotVerified' };
    }

    const dbUser = await upsertUser(user.uid, {
      emailVerified: user.emailVerified,
      email: user.email,
      name: user.displayName,
    });
    const isAccessAllowed = await checkUserAccessAllowed(dbUser as User);

    await createSession(user.uid, isAccessAllowed, dbUser?.assistants[0]?.id || '');
  } catch (error: any) {
    console.error(`[authActions] Error during login user ${email}`, error);

    return { errorMessage: error.code ? `Auth.errors.${error.code}` : 'Auth.errors.loginFailed' };
  }

  redirect(HOME_ROUTE);
}

export async function verifyEmail(code: string, mode: string): Promise<any> {
  try {
    if (mode !== 'verifyEmail') {
      throw new Error(`[authActions] Invalid email verification: ${mode}`);
    }

    await applyActionCode(auth, code);

    return true;
  } catch (error: any) {
    console.error(`[authActions] Error during email verification:`, error);

    return false;
  }
}

export async function signOut() {
  try {
    await auth.signOut();
    await deleteSession();
  } catch (error) {
    console.error('[authActions] Error signing out', error);
    return;
  }

  redirect(LOGIN_ROUTE);
}

interface ResetPasswordResponse {
  errorMessage?: string;
}

export async function resetPassword({ email }: { email: string }): Promise<ResetPasswordResponse> {
  try {
    await sendPasswordResetEmail(auth, email);
    return {};
  } catch (error: any) {
    console.error('[passwordActions] Error sending reset password email:', error);
    return {
      errorMessage: error.code ? `Auth.errors.${error.code}` : 'Auth.ForgotPassword.resetFailed',
    };
  }
}

export async function getCannySSOToken(): Promise<string | null> {
  try {
    const user = await getUser();

    if (!user) throw new Error('[userActions] User not authenticated!');

    return await encrypt({ email: user.email, id: user.id, name: user.name }, process.env.CANNY_API_KEY);
  } catch (error) {
    console.error('[authActions] Error get Canny SSO token', error);

    return null;
  }
}
