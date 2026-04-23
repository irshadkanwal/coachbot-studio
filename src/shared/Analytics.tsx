'use client';

import { use, useEffect } from 'react';

import { HeapUser } from '@/lib/models/analytic.models';
import { User } from '@/lib/models/common.models';
import { heapAnalytics } from '@/lib/services/HeapAnalytics';

export const Analytics = ({ user$, envUrl }: { user$: Promise<User | null>; envUrl?: string }) => {
  const user = use(user$);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      heapAnalytics.init(envUrl || '');
    }
  }, []);

  useEffect(() => {
    const identifyUser = async () => {
      if (user) {
        const { email, name, subscription } = user;

        try {
          const userData: HeapUser = {
            email,
            username: name || '',
            stripeId: subscription?.customerId || '',
            subscriptionId: subscription?.subscriptionId || '',
            coachLimit: subscription?.coaches,
          };

          heapAnalytics.identifyUser(email, userData);
        } catch (error: any) {
          console.error('[analitycs] Error identifying user in Heap:', error);
        }
      }
    };

    identifyUser();
  }, [user]);

  return null;
};
