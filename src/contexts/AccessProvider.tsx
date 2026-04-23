'use client';

import { createContext, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useSSE } from '@/hooks/useSSE';
import { PrivateRoutes } from '@/lib/constants';
import { checkUserAccessAllowed } from '@/server/actions/userActions';

const AccessContext = createContext<void>(undefined);

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMounted = useRef(false);

  const checkAccess = async () => {
    const accessAllowed = await checkUserAccessAllowed();

    if (accessAllowed && !!searchParams.get('success') && pathname === PrivateRoutes.checkout) {
      router.push(PrivateRoutes.chat);
    }
  };

  useSSE({
    events: {
      subscriptionUpdated: checkAccess,
    },
  });

  useEffect(() => {
    if (!isMounted.current) {
      checkAccess();
      isMounted.current = true;
    }
  }, []);

  return <AccessContext.Provider value={undefined}>{children}</AccessContext.Provider>;
}
