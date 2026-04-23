import { ReactNode } from 'react';

import { AuthLayout } from '@/shared/Layout';

export default async function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
