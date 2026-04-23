'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { Button } from './Button';
import { Spinner } from './Loaders';

const variants = {
  gray: 'border border-storm-gray text-main',
  aquamarine: 'border border-dark-aquamarine text-dark-aquamarine',
  red: 'border border-salmon text-salmon',
};

export interface ModalProps {
  variant: string;
  children?: React.ReactNode;
  isOpen: boolean;
  isLoading?: boolean;
  titleKey: string;
  titleIcon?: string;
  buttonTitleKey?: string;
  cancelButtonTitleKey?: string;
  buttonIcon?: string;
  className?: string;
  confirmButtonClass?: string;
  titleClass?: string;
  disabled?: boolean;
  showButtons?: boolean;
  withLoader?: boolean;
  confirm?: (value?: any) => Promise<any> | any;
  closeModal?: () => void;
}

export function Modal({
  children,
  isOpen,
  closeModal,
  titleKey,
  titleIcon,
  buttonTitleKey,
  cancelButtonTitleKey,
  confirmButtonClass,
  titleClass,
  buttonIcon,
  disabled,
  className,
  confirm,
  variant,
  showButtons = true,
  withLoader = true,
}: ModalProps) {
  const [showLoader, setShowLoader] = useState(false);
  const t = useTranslations();
  const router = useRouter();

  const handleClose = () => {
    closeModal ? closeModal() : router.back();
  };

  useEffect(() => {
    if (!isOpen) {
      setShowLoader(false);
    }
  }, [isOpen]);

  return (
    <Dialog as="div" open={isOpen} className="relative z-[100]" onClose={handleClose}>
      <div className="fixed inset-0 bg-violet-950/75">
        <div className="fixed inset-0 z-10 mx-auto w-fit min-w-96">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              className={twMerge(
                'relative flex max-h-[95vh] w-full min-w-96 transform flex-col gap-y-5 overflow-y-auto rounded-2xl bg-gunmetal p-5 text-left shadow-xl transition-all sm:p-7',
                (variants as any)[variant]
              )}
            >
              <Button
                type="button"
                onClick={handleClose}
                className={twMerge(
                  'cbi-close-circle absolute right-0 top-0 p-3 text-light-gray',
                  'cursor-pointer bg-inherit outline-none hover:bg-inherit hover:text-main active:bg-inherit'
                )}
              />

              <div className={twMerge('flex items-start')}>
                <div className={twMerge('flex w-full flex-col gap-8 text-left', className)}>
                  <DialogTitle
                    as="h3"
                    className={twMerge(
                      'inline-flex items-center gap-x-2 text-lg font-medium uppercase text-main',
                      titleClass
                    )}
                  >
                    {titleIcon && <i className={titleIcon}></i>}
                    {t(titleKey)}
                  </DialogTitle>

                  {children}
                </div>
              </div>

              {showButtons && (
                <div className="flex w-1/3 flex-row justify-end gap-x-1 self-end">
                  <Button
                    type="button"
                    variant="outline"
                    color="darkGray"
                    disabled={showLoader}
                    onClick={handleClose}
                    className="flex-grow px-10"
                  >
                    {t(cancelButtonTitleKey || 'General.cancelButton')}
                  </Button>

                  <Button
                    type="button"
                    variant="solid"
                    color="gray"
                    disabled={disabled || showLoader}
                    onClick={() => {
                      withLoader && setShowLoader(true);
                      if (confirm) confirm();
                    }}
                    className={twMerge(
                      'inline-flex flex-grow items-center text-nowrap px-7 py-3 text-lg disabled:opacity-30',
                      showLoader && 'animate-pulse',
                      confirmButtonClass
                    )}
                  >
                    {showLoader ? <Spinner /> : buttonIcon && <i className={buttonIcon}></i>}
                    {buttonTitleKey && t(buttonTitleKey)}
                  </Button>
                </div>
              )}
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
