'use client';

import { useTranslations } from 'next-intl';

import { Button } from './Button';
import { Modal } from './Modal';

export function NewAssistantModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useTranslations();

  return (
    <Modal
      className="gap-y-3 text-center"
      variant="gray"
      isOpen={isOpen}
      showButtons={false}
      titleKey="Assistants.modal.submitButton"
      titleClass="text-center justify-center"
      closeModal={onClose}
      titleIcon={'ms-2'}
    >
      <div className="mx-auto flex max-w-[800px] flex-col gap-y-5 text-main">
        <p className="mx-auto w-3/4 text-center text-lg text-gray-400">{t('NewCoachCreation.modal.subtitle')}</p>
        <div className="flex gap-x-3">
          <div className="flex w-1/2 flex-col items-center gap-y-4 rounded-xl border border-dark-aquamarine bg-graphic/[14%] p-4">
            <span className="text-xl font-semibold text-dark-aquamarine">
              <i className="cbi-edit mr-2 text-xl" />
              {t('NewCoachCreation.modal.guidedTitle')}
            </span>
            <p className="text-center text-lg text-dark-aquamarine">{t('NewCoachCreation.modal.guidedSubtitle')}</p>
            <div className="my-0 w-full max-w-2xl border-b border-dark-aquamarine" />
            <p className="text-center text-lg text-gray-400">{t('NewCoachCreation.modal.guidedDescription')}</p>
            <Button variant="solid" color="primary" className="w-full" href="/new-coach" onClick={onClose}>
              {t('NewCoachCreation.modal.guidedButtonText')}
            </Button>
          </div>
          <div className="flex w-1/2 flex-col items-center gap-y-4 rounded-xl border border-main bg-graphic/[14%] p-4">
            <span className="text-xl font-semibold">
              <i className="cbi-setting-2 mr-2 text-xl" />
              {t('NewCoachCreation.modal.manualTitle')}
            </span>
            <p className="text-gray text-center text-lg">{t('NewCoachCreation.modal.manualSubtitle')}</p>
            <div className="my-0 w-full max-w-2xl border-b border-main" />
            <p className="text-center text-lg text-gray-400">{t('NewCoachCreation.modal.manualDescription')}</p>
            <Button
              variant="solid"
              color="primary"
              className="w-full bg-main text-background"
              href="/create-agent"
              onClick={onClose}
            >
              {t('NewCoachCreation.modal.manualButtonText')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
