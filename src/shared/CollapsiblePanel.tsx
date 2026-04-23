import { ReactNode } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export default function CollapsiblePanel({
  title,
  subTitle,
  subTitleClass,
  toggleText,
  toggleClass,
  iconClass,
  children,
  className,
  titleClass,
  contentClassName,
  togglerRef,
  additionalToggler,
}: {
  title: string;
  subTitle?: string;
  subTitleClass?: string;
  toggleClass?: string;
  toggleText?: boolean;
  children?: ReactNode;
  iconClass?: string;
  titleClass?: string;
  className?: string;
  contentClassName?: string;
  togglerRef?: any;
  additionalToggler?: ReactNode;
}) {
  const t = useTranslations();

  return (
    <div className="flex min-h-0 min-w-0 shrink flex-col">
      <Disclosure>
        <DisclosureButton
          ref={togglerRef}
          className={twMerge(
            'group z-10 flex min-w-0 items-center justify-between gap-x-1 rounded-xl border border-storm-gray px-3 py-2.5 text-base font-medium text-light-gray',
            'data-[open]:rounded-b-none data-[open]:border-b-0 data-[open]:border-light-gray data-[open]:bg-background',
            className
          )}
        >
          <div className={twMerge('flex min-w-0 gap-x-2')}>
            {iconClass && <i className={twMerge(iconClass)}></i>}
            <div className={twMerge('flex min-w-0 flex-col gap-y-1 text-start', !title && 'justify-center')}>
              {title && <h3 className={twMerge('m-0 p-0', titleClass)}> {title}</h3>}
              {subTitle && <p className={twMerge('', subTitleClass)}>{subTitle}</p>}
            </div>
          </div>

          <div className="flex gap-x-4">
            {additionalToggler}
            <span className="inline-flex items-center gap-x-2">
              {toggleText && (
                <>
                  <span className="hidden group-data-[open]:block"> {t('General.closeButton')}</span>
                  <span className="block group-data-[open]:hidden">{t('General.openButton')}</span>
                </>
              )}
              <i className={twMerge('cbi-arrow-down rotate-0 group-data-[open]:rotate-180', toggleClass)}></i>
            </span>
          </div>
        </DisclosureButton>
        <DisclosurePanel
          transition
          className={twMerge(
            'origin-top border border-light-gray bg-background px-5 py-10 text-main transition duration-200 ease-in-out',
            'data-[closed]:-translate-y-0 data-[closed]:opacity-0',
            'data-[open]:rounded-b-xl data-[open]:border-t-0 data-[open]:pt-7',
            contentClassName
          )}
        >
          {children}
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
