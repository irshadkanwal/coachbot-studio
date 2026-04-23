import { ReadonlyURLSearchParams } from 'next/navigation';

import {
  BUSINESS_PLAN_CREATION_LIMIT,
  BUSINESS_PLAN_PUBLISHING_LIMIT,
  LOGIN_ROUTE,
  PrivateRoutes,
  PRO_PLAN_CREATION_LIMIT,
  PRO_PLAN_PUBLISHING_LIMIT,
  PublicRoutes,
  STARTER_PLAN_CREATION_LIMIT,
  STARTER_PLAN_PUBLISHING_LIMIT,
} from '../constants';
import { Assistant, AssistantStatus } from '../models/assistant.models';
import { Subscription, SubscriptionStatus } from '../models/checkout.models';
import { User } from '../models/common.models';

export const withoutTrailingSlash = (url: string = ''): string => {
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const getRedirectPath = (
  path: string,
  userId?: string,
  accessAllowed?: boolean,
  search?: string
): string | null => {
  const publicRoutes: string[] = Object.values(PublicRoutes);
  const isPublicRoute = publicRoutes.includes(path);
  let redirectTo: string | null = null;

  if (!isPublicRoute && !userId) {
    redirectTo = `${LOGIN_ROUTE}${search}`;
  } else if (isPublicRoute && userId) {
    redirectTo = PrivateRoutes.chat;
  } else if (userId && !accessAllowed && path !== PrivateRoutes.checkout) {
    redirectTo = `${PrivateRoutes.checkout}${search}`;
  }

  return redirectTo;
};

export const isActiveSubscription = (subscription?: Subscription | null, currentPriceId?: string) => {
  if (!subscription || !subscription?.subscriptionId) return false;

  const isActiveStatus = [SubscriptionStatus.active, SubscriptionStatus.trialing].includes(
    subscription.status as SubscriptionStatus
  );
  const isFreePlan =
    currentPriceId && process.env.STRIPE_FREE_PRICE && currentPriceId === process.env.STRIPE_FREE_PRICE;
  const isFreePriceTrialEnded =
    isFreePlan && !!subscription.canceledAt && new Date(subscription.canceledAt) < new Date();

  return isActiveStatus && !isFreePriceTrialEnded;
};

export const isTrialSubscription = ({ plan, trial_start, trial_end }: any, freePriceId?: string) => {
  return (!freePriceId || plan.id !== freePriceId) && trial_start !== null && trial_end !== null;
};

export const getIsAllowedUser = (userId?: string) => {
  return !!userId && !!process.env.ALLOWED_USER_IDS && !!process.env.ALLOWED_USER_IDS.split(',').includes(userId);
};

export const isAssistantCreationAllowed = (user: User | null, assistants: Assistant[]) => {
  if (user?.accessAllowed) return true;
  if (!user?.subscription?.coaches) {
    return false; // Subscription required
  }

  const allowedAssistants = Number(user.subscription?.coaches);

  // Starter plan (coaches = "1")
  if (allowedAssistants === 1) {
    return assistants.length < STARTER_PLAN_CREATION_LIMIT;
  }

  // Pro plan (coaches = "10")
  if (allowedAssistants === 10) {
    return assistants.length < PRO_PLAN_CREATION_LIMIT;
  }

  // Business plan (coaches = "50")
  if (allowedAssistants === 50) {
    return assistants.length < BUSINESS_PLAN_CREATION_LIMIT;
  }

  return isNaN(allowedAssistants) ? true : assistants.length < allowedAssistants;
};

export const getPublishingLimit = (user: User | null): number => {
  if (user?.accessAllowed) return Infinity;
  if (!user?.subscription?.coaches) return 0;

  const allowedAssistants = Number(user.subscription?.coaches);

  // Starter plan (coaches = "1")
  if (allowedAssistants === 1) {
    return STARTER_PLAN_PUBLISHING_LIMIT;
  }

  // Pro plan (coaches = "10")
  if (allowedAssistants === 10) {
    return PRO_PLAN_PUBLISHING_LIMIT;
  }

  // Business plan (coaches = "50")
  if (allowedAssistants === 50) {
    return BUSINESS_PLAN_PUBLISHING_LIMIT;
  }

  // Fallback: use numeric coaches value if present
  return isNaN(allowedAssistants) ? Infinity : allowedAssistants;
};

export const isAssistantPublishingAllowed = (user: User | null, assistants: Assistant[]) => {
  const limit = getPublishingLimit(user);
  if (limit === Infinity) return true;
  if (limit === 0) return false;

  const publishedCount = assistants.filter((a) => a.status === AssistantStatus.published).length;
  return publishedCount < limit;
};

export const isLowerEnv = (envUrl: string) => ['stage', 'localhost'].some((env) => envUrl.includes(env));

export const buildQueryParams = (searchQuery: Record<string, string>): string => {
  const params = new URLSearchParams();

  for (const key in searchQuery) {
    const value = searchQuery[key];
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : '';
};

export const normalizeSearchParams = (searchParams: ReadonlyURLSearchParams, allowedKeys: string[]): string => {
  const next = new URLSearchParams();

  allowedKeys.forEach((key: string) => {
    const val = searchParams.get(key);
    if (val) next.set(key, val);
  });

  return next.toString();
};
