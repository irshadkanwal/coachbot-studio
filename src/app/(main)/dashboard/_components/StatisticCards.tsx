'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import ComingSoon from '@/shared/CoomingSoon';

interface StatisticCardProps {
  icon: string;
  titleKey: string;
  value?: number | string;
  disabled?: boolean;
  className?: string;
}

interface AssistantStatisticCardProps extends StatisticCardProps {
  subTitleKey?: string;
  titleValue?: string | number;
  subTitleValue?: string;
  isVisible?: boolean;
  titleValueClass?: string;
  basePath: string;
  href: string | null;
  tooltipKey?: string;
}

export function SidebarStatisticCard({ className, icon, titleKey, value, disabled }: StatisticCardProps) {
  const t = useTranslations();

  return (
    <div
      className={twMerge(
        'flex flex-col justify-between gap-y-10 rounded-2xl bg-dark-aquamarine/[11%] p-3.5',
        disabled && 'border border-graphic/[6%] bg-transparent',
        className
      )}
    >
      <div className="flex flex-col justify-start gap-y-3">
        <span
          className={twMerge(
            'flex aspect-square w-max flex-col items-center justify-center rounded-lg border border-dark-aquamarine p-1',
            disabled && 'border-storm-gray'
          )}
        >
          <i className={twMerge(`text-3xl text-dark-aquamarine`, icon, disabled && 'text-storm-gray')}></i>
        </span>
        <h5 className={twMerge('w-full text-wrap text-base text-dark-aquamarine', disabled && 'text-storm-gray')}>
          {t(titleKey)}
        </h5>
        {disabled && <ComingSoon className="mb-16 w-full 2xl:mb-16" onlyLabel={true} />}
      </div>

      {!disabled && (
        <div className={twMerge('text-2xl font-medium text-dark-aquamarine', Number(value) <= 0 && 'opacity-30')}>
          {value}
        </div>
      )}
    </div>
  );
}

export function AssistantStatisticCard({
  className,
  icon,
  titleKey,
  titleValue,
  subTitleKey,
  subTitleValue,
  value,
  isVisible = true,
  titleValueClass,
  basePath,
  href,
  tooltipKey,
}: AssistantStatisticCardProps) {
  const t = useTranslations();
  const [showTooltip, setShowTooltip] = useState(false);

  const CardContent = useMemo(() => {
    return (
      <>
        <div className="inline-flex items-center gap-x-2 text-lg">
          <i className={`${icon} !text-3xl`} />
          <div className="flex flex-col">
            <h4 className="inline-flex items-center gap-x-1">
              {t.has(titleKey) && t(titleKey)}
              <span className={twMerge('text-nowrap text-xl font-medium text-main', titleValueClass)}>
                {titleValue}
              </span>
            </h4>
            {subTitleValue && (
              <p className="inline-flex items-center text-sm">
                {subTitleKey && t(subTitleKey)}
                <span className="text-main">{subTitleValue}</span>
              </p>
            )}
          </div>
        </div>
        <span className="text-3xl font-medium">{value}</span>
      </>
    );
  }, [icon, titleKey, titleValue, subTitleKey, subTitleValue, value]);

  if (!isVisible) return null;

  return !!href ? (
    <Link
      href={`${basePath}${href}`}
      className={twMerge(
        'flex flex-1 flex-col justify-between gap-y-5 rounded-xl border border-transparent bg-graphic/[14%] p-3.5 text-main hover:border-main',
        className
      )}
    >
      {CardContent}
    </Link>
  ) : (
    <div
      className={twMerge(
        'relative flex flex-1 flex-col justify-between gap-y-5 rounded-xl border border-transparent bg-graphic/[14%] p-3.5 text-main',
        tooltipKey && 'cursor-help',
        className
      )}
      onMouseEnter={() => {
        if (tooltipKey) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
      }}
    >
      {CardContent}
      {showTooltip && tooltipKey && (
        <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap">
          <div className="rounded-lg bg-main px-3 py-2 text-xs text-background shadow-lg">
            {t.has(tooltipKey) ? t(tooltipKey) : tooltipKey}
          </div>
        </div>
      )}
    </div>
  );
}
