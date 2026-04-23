'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { PrivateRoutes } from '@/lib/constants';
import { AsideToggleButton } from '../FunctionalButtons';

export default function ConditionalNavigatorButton({ labelKey }: { labelKey: string }) {
  const pathname = usePathname();
  const t = useTranslations();
  const isDashboard = pathname?.startsWith(PrivateRoutes.dashboard);

  if (isDashboard) {
    return null;
  }

  return <AsideToggleButton label={t(labelKey)} open={true} id="sidebar-toggle" className="uppercase" />;
}
