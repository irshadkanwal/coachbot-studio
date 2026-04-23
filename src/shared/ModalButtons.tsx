'use client';

import { ReactNode, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { Button } from './Button';
import { Modal, ModalProps } from './Modal';

export function DeleteWithConfirmationButton({
  config,
  iconClassName,
  className,
  children,
  buttonText,
}: {
  config: Omit<ModalProps, 'isOpen' | 'closeModal'>;
  iconClassName?: string;
  className?: string;
  children: ReactNode;
  buttonText?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirm = useCallback(async () => {
    config?.confirm && (await config?.confirm());
    setModalOpen(false);
  }, [config.confirm]);

  return (
    <>
      <Button className={twMerge('items-center justify-center', className)} onClick={() => setModalOpen(true)}>
        <i className={iconClassName}></i>
        {buttonText}
      </Button>
      {config && modalOpen && (
        <Modal
          {...config}
          isOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          confirm={handleConfirm}
          confirmButtonClass="bg-main hover:bg-white/[8%] hover:border-background-border/[16%] text-background"
        >
          {children}
        </Modal>
      )}
    </>
  );
}

export function EditModalButton({
  initialValue,
  config,
  className,
  children,
  customContent,
}: {
  config: Omit<ModalProps, 'isOpen' | 'closeModal'>;
  className?: string;
  children: ReactNode;
  initialValue: string;
  customContent?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleConfirm = useCallback(async () => {
    const result = config?.confirm && (await config?.confirm(value));
    setModalOpen(result === false);
  }, [config.confirm, value]);

  return (
    <>
      <Button className={(twMerge('cbi-trash'), className)} onClick={() => setModalOpen(true)} />
      {config && modalOpen && (
        <Modal {...config} isOpen={modalOpen} closeModal={() => setModalOpen(false)} confirm={handleConfirm}>
          {children}
          {!customContent && (
            <input
              id="edit-value-input"
              required
              defaultValue={initialValue || ''}
              className={twMerge(
                'focus:no-outline rounded-lg border border-light-gray bg-white/[18%] px-4 py-2 text-lg text-main placeholder:text-base focus:ring-0'
              )}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </Modal>
      )}
    </>
  );
}

export function ModalButton({
  config,
  className,
  children,
  showButtons = false,
  disabled,
}: {
  config: Omit<ModalProps, 'isOpen' | 'closeModal'>;
  className?: string;
  children: ReactNode;
  showButtons?: boolean;
  disabled?: boolean;
}) {
  const t = useTranslations();
  const [modalOpen, setModalOpen] = useState(false);
  const [showDisabledTooltip, setShowDisabledTooltip] = useState(false);

  return (
    <>
      <div
        className="relative flex items-center"
        onMouseEnter={() => disabled && setShowDisabledTooltip(true)}
        onMouseLeave={() => disabled && setShowDisabledTooltip(false)}
      >
        <Button
          className={twMerge(className, disabled && 'pointer-events-none !cursor-not-allowed !opacity-50')}
          onClick={() => !disabled && setModalOpen(true)}
          disabled={disabled}
        />
        {showDisabledTooltip && disabled && (
          <div className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap">
            <div className="rounded-lg bg-main px-3 py-2 text-xs text-background shadow-lg">
              {t('General.shareDisabledTooltip')}
            </div>
          </div>
        )}
      </div>
      {config && modalOpen && !disabled && (
        <Modal
          {...config}
          showButtons={showButtons}
          isOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          confirm={() => setModalOpen(false)}
        >
          {children}
        </Modal>
      )}
    </>
  );
}
