import { ReactNode, Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

import { AccountToggleButton } from '@/shared/FunctionalButtons';
import { FullScreenLoader } from '@/shared/Loaders';
import { Logo } from '@/shared/Logo';
import { ThemeToggler } from '@/shared/ThemeToggler';

export default async function Layout({ children }: { children: ReactNode }) {
  const t = await getTranslations();
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <div className={'fixed-container flex h-full max-h-dvh max-w-full flex-col flex-nowrap gap-y-2 p-2.5'}>
        <header className={`flex items-center justify-between gap-x-7 py-2.5 pb-2`}>
          <div className={'flex w-full items-center justify-end gap-x-5'}>
            <span className="text-base font-medium text-light-gray">{t('General.themeTogglerLabel')}</span>
            <ThemeToggler />
          </div>
          <div className="flex shrink-0 items-center gap-x-5">
            <Logo />
            <AccountToggleButton />
          </div>
        </header>
        <section className="flex max-h-dvh min-h-0 w-full flex-grow flex-col gap-y-2 overflow-y-auto overflow-x-hidden">
          {children}
        </section>
      </div>
    </Suspense>
  );
}
