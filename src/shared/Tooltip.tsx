'use client';

import { ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export default function Tooltip({
  initialShow,
  iconClass,
  tooltipClassName,
  tooltipLabelClassName,
  tooltipLabel,
  className,
  children,
}: {
  initialShow?: boolean;
  iconClass: string;
  tooltipClassName?: string;
  tooltipLabelClassName?: string;
  tooltipLabel?: string;
  className?: string;
  children?: ReactNode;
}) {
  const t = useTranslations();
  const [showTooltip, setShowTooltip] = useState(initialShow ?? false);

  return (
    <div className={twMerge('relative flex flex-col items-center justify-center', className)}>
      <span
        tabIndex={0}
        className={twMerge('cursor-pointer text-lg text-dark-aquamarine', iconClass)}
        onClick={() => setShowTooltip(true)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(initialShow ?? false)}
      ></span>
      <div
        className={twMerge(
          'absolute bottom-full left-1/3 z-20 flex flex-grow -translate-x-1/2 items-center justify-end',
          showTooltip ? 'h-auto w-96' : 'h-0 w-0',
          tooltipClassName
        )}
      >
        {showTooltip && (
          <div
            className={twMerge(
              'text-nowrap rounded-xl bg-main px-2.5 py-1.5 text-xs text-background',
              tooltipLabelClassName
            )}
          >
            {tooltipLabel && t(tooltipLabel)}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
