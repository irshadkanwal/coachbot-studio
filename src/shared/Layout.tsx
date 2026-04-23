import { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { twMerge } from 'tailwind-merge';

import { AsideContextProvider } from '@/contexts/AsideContext';
import AssistantSelect from './assistant/AssistantSelect';
import Header from './layout/Header';
import { FullScreenLoader } from './Loaders';
import { Logo } from './Logo';

const Sidebar = dynamic(() => import('@/shared/Sidebar'), {
  loading: () => <div className="w-0"></div>,
});

interface LayoutProps {
  children: ReactNode;
  sidebarContent?: ReactNode;
  mainClassName?: string;
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-svh w-svw flex-col items-center justify-center">
      <section className="justify-ceneter flex min-w-0 max-w-3xl flex-col items-center gap-10 md:flex-row lg:w-[50vw]">
        <div className="basisi-1/2 flex min-w-0 shrink-0 flex-grow flex-col">
          <Logo className="!h-10 sm:!h-14 xl:h-14" />
        </div>
        <div className="relative flex shrink-0 flex-grow basis-1/2 flex-col rounded-xl border border-storm-gray bg-white/[8%] p-6">
          <Suspense>{children}</Suspense>
        </div>
      </section>
    </main>
  );
}

export function MainLayout({ children, mainClassName, sidebarContent }: LayoutProps) {
  return (
    <AsideContextProvider isOpen={false}>
      <Suspense fallback={<FullScreenLoader />}>
        <main
          className={twMerge(
            'fixed-container flex max-h-dvh min-h-0 max-w-full flex-grow flex-row flex-nowrap p-2.5',
            mainClassName
          )}
        >
          {sidebarContent && <Sidebar titleClassName="min-h-14">{sidebarContent}</Sidebar>}

          <section className="flex max-h-dvh min-h-0 w-full flex-grow flex-col gap-y-2 overflow-y-auto overflow-x-hidden">
            <Header withAsideToggle={true}></Header>
            <div className="relative flex min-h-0 flex-grow flex-col">
              <AssistantSelect />
              {children}
            </div>
          </section>
        </main>
      </Suspense>
    </AsideContextProvider>
  );
}

export function WithSidebarLayout({ children, sidebar }: { children: ReactNode; sidebar: ReactNode }) {
  return (
    <AsideContextProvider isOpen={false}>
      <section className="relative flex flex-grow rounded-xl">
        {sidebar}
        <div className="flex min-h-0 min-w-0 flex-grow basis-full flex-col">{children}</div>
      </section>
    </AsideContextProvider>
  );
}
