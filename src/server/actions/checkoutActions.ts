'use server';

import Stripe from 'stripe';

import { PrivateRoutes } from '@/lib/constants';
import eventEmitter from '@/lib/eventEmitter';
import { Price, Subscription, SubscriptionStatus } from '@/lib/models/checkout.models';
import { User } from '@/lib/models/common.models';
import { isActiveSubscription, withoutTrailingSlash } from '@/lib/utils/common.utils';
import { toBoolean } from '@/lib/utils/data.utils';
import { stripeClient } from '../db/stripeClient';
import { createUserSubscription, deleteUserSubscription, updateUserSubscription } from '../db/userClient';
import { getUser } from './userActions';

export const mapStripePrices = async (
  prices: Price[] = [],
  activePrice: { id: string; productId: string; interval?: string } | null
): Promise<Price[]> => {
  return prices
    .map((price: any) => {
      // Skip prices without recurring interval (e.g., one-time payments)
      if (!price.recurring?.interval) {
        return null;
      }

      const { id, name, active, description, metadata, marketing_features } = price.product;
      const isStudioPrice = active && toBoolean(metadata.forStudio);
      const isActive =
        activePrice?.id === price.id ||
        (activePrice?.productId === id && activePrice?.interval === price.recurring?.interval);

      return (
        isStudioPrice && {
          name,
          id: price.id,
          description,
          amount: price.unit_amount / 100,
          currency: price.currency,
          product: price.product,
          marketing_features,
          interval: price.recurring.interval,
          isActive,
          currency_options: price.currency_options,
        }
      );
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Assign sort order: Professional (0), Business (1), Enterprise (2), others (3)
      const getSortOrder = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('professional')) return 0;
        if (lowerName.includes('business')) return 1;
        if (lowerName.includes('enterprise')) return 2;
        return 3;
      };

      const orderA = getSortOrder(a.name);
      const orderB = getSortOrder(b.name);

      // First sort by plan type order
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Then sort by amount within the same plan type
      return Number(a.amount) - Number(b.amount);
    });
};

export const getUserCurrentPrice = async (
  currentUser?: User
): Promise<{ id: string; productId: string; interval?: string } | null> => {
  try {
    const user = currentUser || (await getUser());

    if (!user) return null;

    const subscription = isActiveSubscription(user.subscription)
      ? await stripeClient.getSubscriptionData(user.subscription?.subscriptionId)
      : null;

    const { id = '', product = {} as any, recurring } = (subscription && subscription?.items?.data?.[0]?.price) ?? {};

    return { id, productId: product?.id, interval: recurring?.interval };
  } catch (error: any) {
    console.error('[checkoutActions] Error during get user current price:', error);

    return null;
  }
};

export const getPrices = async (): Promise<Price[]> => {
  try {
    const [{ data }, activePrice] = await Promise.all([stripeClient.getAllPrices(), getUserCurrentPrice()]);

    return mapStripePrices(data as any, activePrice);
  } catch (error: any) {
    console.error('[checkoutActions] Error during fetching prices:', error);

    return [];
  }
};

export const getUserCurrentSubscription = async ({
  id,
  subscription,
  email,
  name,
}: User): Promise<Subscription | null> => {
  try {
    if (!!subscription?.customerId) return subscription;

    const customer = await stripeClient.getStripeCustomer(email, name || '');

    return await createUserSubscription(id, {
      customerId: customer.id,
      status: SubscriptionStatus.incomplete,
    });
  } catch (error: any) {
    console.error('[checkoutActions] Error during get used saved subscription:', error);

    return null;
  }
};

export const createUserCheckoutSession = async (price: Price, currency?: string): Promise<any> => {
  let userId;
  try {
    const user = await getUser();

    if (!user) return (await stripeClient.createCheckoutSession(price.id, currency))?.url;

    userId = user.id;
    const currentSubscription = await getUserCurrentSubscription(user);
    const { trialUsed } = currentSubscription || {};
    const withoutTrialPeriod = trialUsed != null ? trialUsed : await stripeClient.checkTrialSubscriptions(user);
    const trialDays = withoutTrialPeriod ? undefined : Number(price.product.metadata?.trialDays) || 14;
    const session =
      currentSubscription &&
      (await stripeClient.createCheckoutSession(price.id, currency, currentSubscription, trialDays));

    return session?.url || '';
  } catch (error: any) {
    console.error(`[checkoutActions] Error during creating checkout session for user ${userId}:`, error);

    throw new Error('[checkoutActions] Could not create session');
  }
};

export const createUserFreeSubscription = async (user: User, trialDays?: number): Promise<any> => {
  try {
    const { customerId } = (await getUserCurrentSubscription(user)) || {};

    if (!customerId || !process.env.STRIPE_FREE_PRICE) return;

    return await stripeClient.createSubscription(customerId, process.env.STRIPE_FREE_PRICE, trialDays);
  } catch (error: any) {
    console.error(`[checkoutActions] Error during creating trial subscription for user ${user.id}:`, error);

    throw new Error('[checkoutActions] Could not create session');
  }
};

export const cancelUserSubscription = async (): Promise<any> => {
  let userId, subscription;
  try {
    const user = await getUser();

    if (!user) throw new Error('[checkoutActions] User not authenticated!');

    ({ id: userId, subscription } = user);

    if (user.subscription?.subscriptionId) {
      await stripeClient.cancelSubscription(
        user.subscription?.subscriptionId,
        `[user action] "${user.subscription?.subscriptionId}" subscription was cancelled by user.`
      );
    }

    return `${withoutTrailingSlash(process.env.APP_BASE_URL)}/${PrivateRoutes.checkout}`;
  } catch (error: any) {
    console.error(
      `[checkoutActions] Error during cancel subscription ${subscription?.subscriptionId} for user ${userId}:`,
      error
    );

    throw new Error('[checkoutActions] Could not create session');
  }
};

export const getUpdatedSubscriptionData = async (subscription: Stripe.Subscription): Promise<Subscription> => {
  try {
    const product = await stripeClient.getSubscriptionProduct(subscription);
    const { name, metadata } = product;
    const { coaches, trialDays, analytics, allowedIntegration } = metadata as any;
    const trialUsed =
      !process.env.STRIPE_FREE_PRICE || (subscription as any).plan?.id !== process.env.STRIPE_FREE_PRICE;

    return {
      name,
      subscriptionId: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status,
      coaches,
      trialDays,
      analytics,
      allowedIntegration,
      canceledAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      trialUsed,
    } as Subscription;
  } catch (error: any) {
    console.error(`[checkoutActions] Error during get data for  activesubscription ${subscription.id}:`, error);

    throw new Error('[checkoutActions] Could not get active subscription data');
  }
};

export const getCancelSubscriptionData = async (eventData: any): Promise<Subscription> => {
  try {
    return {
      customerId: eventData.customer,
      status: SubscriptionStatus.canceled,
      canceledAt: new Date(eventData.canceled_at * 1000),
    } as Subscription;
  } catch (error: any) {
    console.error(`[checkoutActions] Error during get data for cancelled subscription ${eventData.id}:`, error);

    throw new Error('[checkoutActions] Could not get canceled subscription data');
  }
};

export const updateSubscriptionData = async (
  customerId: string,
  subscriptionData: Subscription,
  isDeleted: boolean = false
) => {
  try {
    const subscription = isDeleted
      ? await deleteUserSubscription(customerId)
      : await updateUserSubscription(customerId, subscriptionData);

    if (subscription?.userId) {
      eventEmitter.emit(`message:${subscription.userId}`, {
        user_id: subscription.userId,
        event: 'subscriptionUpdated',
      });
    }
  } catch (error: any) {
    console.error(`[checkoutActions] Error deleting subscription data for customer ${customerId}:`, error);
  }
};
