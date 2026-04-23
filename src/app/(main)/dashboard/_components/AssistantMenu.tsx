'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Assistant, AssistantStatus } from '@/lib/models/assistant.models';
import { User } from '@/lib/models/common.models';
import { getPublishingLimit, isAssistantPublishingAllowed } from '@/lib/utils/common.utils';
import { createCopyAssistant, deleteAssistant, updateAssistant } from '@/server/actions/assistantActions';
import { deleteCoachAction } from '@/server/actions/coachActions';
import Checkbox from '@/shared/Checkbox';
import { DropdownMenu, MenuOption } from '@/shared/DropdownMenu';
import { ExportAssistantButton } from '@/shared/FunctionalButtons';
import { Modal } from '@/shared/Modal';
import { DeleteWithConfirmationButton } from '@/shared/ModalButtons';

const modalConfig = {
  buttonTitleKey: 'Assistants.deleteModal.deleteButton',
  buttonIcon: 'cbi-trash',
  titleIcon: 'cbi-send',
  titleKey: 'Assistants.deleteModal.title',
  variant: 'red',
};

const getMenuOptions = (
  assistant: Assistant,
  user: User | null,
  assistants: Assistant[],
  t: any,
  onPublishClick: () => void
): (MenuOption & { allowedStatuses?: AssistantStatus[] })[] =>
  [
    {
      icon: 'cbi-export',
      label: t('Dashboard.assistantCard.menuItems.0'),
      subTitle: !isAssistantPublishingAllowed(user, assistants)
        ? t('General.errors.publishingLimitReached', { limit: getPublishingLimit(user) })
        : t('Dashboard.assistantCard.menuItems.1'),
      className: 'text-dark-aquamarine',
      divider: true,
      onClick: onPublishClick,
      allowedStatuses: [AssistantStatus.draft],
      disabled: !isAssistantPublishingAllowed(user, assistants),
    },
    {
      icon: 'cbi-scroll',
      label: t('Dashboard.assistantCard.menuItems.2'),
      subTitle: t('Dashboard.assistantCard.menuItems.3'),
      inDevelompent: true,
      divider: true,
      className: 'text-yellow',
      onClick: () => {}, // TODO: Implement integration feature
      allowedStatuses: [AssistantStatus.draft],
    },
    {
      icon: 'cbi-export',
      label: t('Dashboard.assistantCard.menuItems.8'),
      divider: true,
      onClick: async () => await updateAssistant(assistant.id, { status: AssistantStatus.draft }),
      allowedStatuses: [AssistantStatus.archived],
    },
    {
      icon: 'cbi-copy',
      label: t('Dashboard.assistantCard.menuItems.4'),
      onClick: async () => await createCopyAssistant(assistant),
      allowedStatuses: [AssistantStatus.archived, AssistantStatus.draft],
    },
    {
      children: (close: any) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ExportAssistantButton
              assistant={assistant}
              callback={close}
              className="border-none p-1.5 text-base font-semibold text-light-gray hover:text-main"
              iconClassName="!text-xl"
            />
          </div>
        );
      },
      allowedStatuses: [AssistantStatus.published, AssistantStatus.archived, AssistantStatus.draft],
    },
    {
      label: t('Dashboard.assistantCard.menuItems.9'),
      link: `/new-coach/${assistant.id}/edit`,
      icon: 'cbi-edit-2',
      allowedStatuses: [AssistantStatus.inProgress],
    },
    {
      icon: 'cbi-archive',
      label: t('Dashboard.assistantCard.menuItems.6'),
      onClick: async () => await updateAssistant(assistant.id, { status: AssistantStatus.archived }),
      allowedStatuses: [AssistantStatus.published, AssistantStatus.draft],
    },
    {
      children: (close: () => any) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DeleteWithConfirmationButton
            buttonText={t('Dashboard.assistantCard.menuItems.7')}
            iconClassName="cbi-trash !text-xl"
            className={'border-none p-1.5 font-semibold text-salmon hover:text-main'}
            config={{
              ...modalConfig,
              confirm: async () => {
                await deleteAssistant(assistant?.id);
                await deleteCoachAction(assistant?.id);
                close();
              },
            }}
          >
            <p className="text-light-gray">{t(`Assistants.deleteModal.content`, { name: assistant?.name })}</p>
          </DeleteWithConfirmationButton>
        </div>
      ),
    },
  ].filter(({ allowedStatuses }) => !allowedStatuses || allowedStatuses.includes(assistant.status as AssistantStatus));

export default function AssistantMenu({
  assistant,
  user,
  assistants,
}: {
  assistant: Assistant;
  user: User | null;
  assistants: Assistant[];
}) {
  const t = useTranslations();
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [_, setIsPublishing] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    const result = await updateAssistant(assistant.id, { status: AssistantStatus.published });
    setIsPublishing(false);

    if (result.error) {
      const errorMessage = (result as any).errorParams ? t(result.error, (result as any).errorParams) : t(result.error);
      console.error('Publishing failed:', errorMessage);
    } else {
      setPublishModalOpen(false);
      setConsentChecked(false);
    }
  };

  const handleCloseModal = () => {
    setPublishModalOpen(false);
    setConsentChecked(false);
  };

  return (
    <>
      <DropdownMenu
        options={getMenuOptions(assistant, user, assistants, t, () => setPublishModalOpen(true))}
        menuBtnIcon="cbi-more"
        menuBtnClass="aspect-square border border-graphic/[14%] text-xl text-light-gray hover:border-main data-[hover]:text-main"
        menuItemsClass="min-w-60"
      />
      <Modal
        isOpen={publishModalOpen}
        variant=""
        closeModal={handleCloseModal}
        titleKey="Dashboard.assistantCard.publishModal.title"
        buttonTitleKey="Dashboard.assistantCard.publishModal.confirmButton"
        cancelButtonTitleKey="Dashboard.assistantCard.publishModal.cancelButton"
        confirm={handlePublish}
        confirmButtonClass="bg-dark-aquamarine hover:bg-dark-aquamarine/80 text-white"
        disabled={!consentChecked}
      >
        <div className="flex flex-col gap-4">
          <p className="whitespace-pre-line text-light-gray">{t('Dashboard.assistantCard.publishModal.content')}</p>
          <Checkbox
            selected={consentChecked}
            onChange={setConsentChecked}
            label={t('Dashboard.assistantCard.publishModal.consentLabel')}
            labelClassName="text-light-gray"
          />
        </div>
      </Modal>
    </>
  );
}
