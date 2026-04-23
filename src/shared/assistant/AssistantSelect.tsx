'use client';

import { useCallback, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { useRootContext } from '@/contexts/RootContextProvider';
import { useIsClient } from '@/hooks/useIsClient';
import { PrivateRoutes } from '@/lib/constants';
import { Assistant, AssistantStatus } from '@/lib/models/assistant.models';
import { User } from '@/lib/models/common.models';
import { deleteAssistant } from '@/server/actions/assistantActions';
import { Button } from '@/shared/Button';
import CollapsiblePanel from '@/shared/CollapsiblePanel';
import { CopyToClipboardButton, ExportAssistantButton, NewAssistantButton } from '@/shared/FunctionalButtons';
import { Modal } from '@/shared/Modal';
import { NewAssistantModal } from '@/shared/NewAssistantModal';
import { Chip } from '../Chip';

interface AssistantSelectBaseProps {
  assistants: Assistant[];
  selectedAssistant: Assistant | null;
  updateSelectedAssistant: (assistant: Assistant, pathname?: string) => Promise<void>;
  user: User | null;
  className?: string;
  light?: boolean;
}

export function AssistantSelectBase({
  assistants,
  user,
  selectedAssistant,
  className,
  light,
  updateSelectedAssistant,
}: AssistantSelectBaseProps) {
  const t = useTranslations();
  const [modalOpen, setModalOpen] = useState(false);
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [creationModalOpen, setCreationModalOpen] = useState(false);
  const isClient = useIsClient();
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

  const hasChip = useCallback(
    ({ status }: Assistant) =>
      status &&
      [AssistantStatus.inProgress, AssistantStatus.draft, AssistantStatus.published].includes(
        status as AssistantStatus
      ),
    []
  );

  const handleDelete = useCallback(async () => {
    if (assistant) {
      await deleteAssistant(assistant?.id);
      setModalOpen(false);
    }
  }, [assistant]);

  const handleOpenCreationModal = () => {
    setCreationModalOpen(true);
    toggleButtonRef.current?.click();
  };

  if (pathname.startsWith(PrivateRoutes.dashboard)) return null;

  if (!assistants?.length) {
    return (
      <NewAssistantButton
        user={user}
        assistants={assistants}
        className="absolute right-1 top-1 z-10 flex w-1/3 max-w-96"
      />
    );
  }

  return (
    <div
      id="assistant-manage"
      className={twMerge(
        'absolute right-1 top-1 z-20 flex max-h-[calc(100%-0.5rem)] w-1/3 min-w-[21rem] max-w-lg flex-grow flex-col',
        className
      )}
    >
      <CollapsiblePanel
        title={!light ? t('Assistants.selectTitle') : ''}
        subTitle={isClient ? selectedAssistant?.name : ''}
        className={`group border-graphic/[6%] ${light ? 'bg-graphic/[14%] hover:border-main' : 'bg-gunmetal hover:border-dark-aquamarine hover:bg-background'} p-2 data-[open]:border-dark-aquamarine`}
        toggleClass={`${light ? 'text-light-gray group-hover:text-main' : 'text-dark-aquamarine'}`}
        iconClass={`cbi-cpu size-8 aspect-square border ${light ? 'border-graphic/[14%] text-light-gray' : 'border-dark-aquamarine text-dark-aquamarine'} rounded-lg self-center`}
        titleClass={`text-[.65rem] text-light-gray leading-3 font-semibold -ms-0.5`}
        subTitleClass={`${light ? 'text-light-gray group-hover:text-main' : 'text-dark-aquamarine'} text-base font-semibold leading-5 line-clamp-2 break-words`}
        contentClassName="p-2.5 data-[open]:pt-2.5 border-dark-aquamarine min-h-0 flex flex-col"
        togglerRef={toggleButtonRef}
        additionalToggler={
          <Button
            className={`cbi-setting-2 m-0 p-0 text-[1.2rem] leading-5 ${light ? 'text-light-gray' : 'text-storm-gray'} hover:text-main`}
            href={'/instructions'}
          />
        }
      >
        <div className="flex min-h-0 flex-col justify-between gap-y-2">
          <ul className="flex flex-col gap-y-1 overflow-y-auto overflow-x-hidden">
            {assistants.map((assistant) => (
              <li
                key={assistant.id}
                className={twMerge(
                  'relative flex cursor-pointer flex-col gap-y-1 rounded-xl p-3.5 hover:bg-dark-aquamarine/[22%]',
                  selectedAssistant?.id === assistant.id ? 'bg-dark-aquamarine/[22%]' : 'bg-dark-aquamarine/[11%]',
                  assistant.status === AssistantStatus.inProgress && 'pointer-events-none cursor-not-allowed opacity-90'
                )}
                onClick={async () => {
                  await updateSelectedAssistant(assistant, pathname);
                  toggleButtonRef.current?.click();
                }}
              >
                {selectedAssistant?.id === assistant.id && <span className="cbi-tick-circle absolute right-3 top-3" />}
                <div className="flex gap-x-2">
                  {hasChip(assistant) && (
                    <Chip
                      variant={
                        assistant.status === AssistantStatus.inProgress
                          ? 'blue'
                          : assistant.status === AssistantStatus.published
                            ? 'aquamarine'
                            : 'white'
                      }
                      size="s"
                      text={
                        assistant.status === AssistantStatus.published ? 'Live' : assistant.status?.replaceAll('_', ' ')
                      }
                      textClassName="px-1.5 py-0.5 text-xs leading-4 capitalize"
                    />
                  )}
                  <h5 className="break-words text-lg font-medium text-main">{assistant.name}</h5>
                </div>
                <p className="line-clamp-4 break-words text-sm text-light-gray">{assistant.description}</p>
                {assistant.status !== AssistantStatus.inProgress && (
                  <div className="flex items-center justify-between gap-x-1 pt-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex min-w-0 gap-x-1">
                      <CopyToClipboardButton
                        searchParams={`cbsas=${assistant.id}`}
                        tooltipKey={'General.shareLinkSuccess'}
                        titileKey="Assistants.shareTitle"
                        disabled={assistant.status !== AssistantStatus.published}
                      />
                      <ExportAssistantButton
                        assistant={assistant}
                        className="before:ms-1 before:h-2/3 before:border-l before:border-storm-gray"
                      />
                    </div>

                    <div className="flex min-w-0 items-center justify-around gap-x-3">
                      {assistant.status === AssistantStatus.draft && (
                        <Button
                          className="cbi-edit-2 m-0 p-0 text-storm-gray hover:text-main"
                          href={`/create-agent?id=${assistant.id}`}
                        />
                      )}
                      <Button
                        className="cbi-trash m-0 p-0 text-lg leading-3 text-storm-gray hover:text-main"
                        onClick={async () => {
                          setAssistant(assistant);
                          setModalOpen(true);
                        }}
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <NewAssistantButton user={user} assistants={assistants} onClick={handleOpenCreationModal} />
        </div>
      </CollapsiblePanel>

      {modalOpen && (
        <Modal
          buttonTitleKey={'Assistants.deleteModal.deleteButton'}
          buttonIcon="cbi-trash"
          titleIcon="cbi-send"
          titleKey={`Assistants.deleteModal.title`}
          variant="red"
          isOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          confirm={handleDelete}
        >
          <div className="flex flex-col gap-y-5 text-main">
            <p>{t(`Assistants.deleteModal.content`, { name: assistant?.name || '' })}</p>
          </div>
        </Modal>
      )}
      {creationModalOpen && (
        <NewAssistantModal isOpen={creationModalOpen} onClose={() => setCreationModalOpen(false)} />
      )}
    </div>
  );
}

export default function AssistantSelect() {
  const { assistants, updateSelectedAssistant, selectedAssistant, user } = useRootContext();

  return (
    <AssistantSelectBase
      assistants={assistants}
      selectedAssistant={selectedAssistant}
      updateSelectedAssistant={updateSelectedAssistant}
      user={user}
    />
  );
}
