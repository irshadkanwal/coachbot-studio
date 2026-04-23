'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { useAsideContext } from '@/contexts/AsideContext';
import { AsideToggleButton } from './FunctionalButtons';

export default function Sidebar({
  titleKey,
  titleClassName,
  className,
  contentClassName,
  children,
  showOpen,
  openButtonLabel,
  openClassName,
}: {
  titleKey?: string;
  titleClassName?: string;
  className?: string;
  contentClassName?: string;
  openButtonLabel?: string;
  children: ReactNode;
  showOpen?: boolean;
  openClassName?: string;
}) {
  const t = useTranslations();
  const { isAsideOpen } = useAsideContext();

  return (
    <>
      <div
        className={twMerge(
          'group relative z-10 flex min-w-0 max-w-xl shrink-0 flex-col gap-y-5 overflow-hidden rounded-lg bg-white-opacity backdrop-blur-md transition-[width]',
          className,
          isAsideOpen ? `me-3 w-1/4 p-2.5 ${openClassName}` : 'w-0'
        )}
      >
        {isAsideOpen && (
          <>
            <AsideToggleButton
              className="absolute right-2.5 top-2.5 group-[.hide-toggle]:hidden"
              open={false}
              id="sidebar-toggle"
            />
            {titleKey && (
              <h3 className={twMerge('text-nowrap py-2.5 ps-2 text-[1.25rem] uppercase text-main', titleClassName)}>
                {t(titleKey)}
              </h3>
            )}
            <div className={twMerge('relative flex min-h-0 flex-grow flex-col gap-y-5 pt-3', contentClassName)}>
              {children}
            </div>
          </>
        )}
      </div>

      {showOpen && (
        <div className="absolute top-0.5 flex items-center gap-x-3">
          <AsideToggleButton open={true} />
          <span className="text-sm text-storm-gray">{openButtonLabel && t(openButtonLabel)} </span>
        </div>
      )}
    </>
  );
}
