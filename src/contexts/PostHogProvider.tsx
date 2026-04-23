'use client';

import { ReactNode, useEffect } from 'react';

import { User } from '@/lib/models/common.models';
import { posthogService } from '@/lib/services/posthog';

interface PostHogProviderProps {
  children: ReactNode;
  user: User | null;
}

export function PostHogProvider({ children, user }: PostHogProviderProps) {
  useEffect(() => {
    posthogService.init();
  }, []);

  useEffect(() => {
    if (user && posthogService.isInitialized()) {
      const { email, name, subscription } = user;

      const userProperties = {
        email,
        name: name || '',
        stripeId: subscription?.customerId || '',
        subscriptionId: subscription?.subscriptionId || '',
        coachLimit: subscription?.coaches || 0,
      };

      posthogService.identify(email, userProperties);
    } else if (posthogService.isInitialized()) {
      return;
    }
  }, [user]);

  return <>{children}</>;
}
