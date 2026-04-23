'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { useSSE } from '@/hooks/useSSE';
import { FileStatus, FileType, KnowledgeFile } from '@/lib/models/common.models';
import { getDateDay, getDateWeekDay } from '@/lib/utils/date.utils';
import { deleteFile, editFile, getFileLink } from '@/server/actions/filesActions';
import { Button } from '@/shared/Button';
import Dropdown from '@/shared/Dropdown';
import { DeleteWithConfirmationButton, EditModalButton } from '@/shared/ModalButtons';
import Tooltip from '@/shared/Tooltip';

const modalsConfig = {
  delete: {
    titleKey: 'KnowledgeBase.modals.delete.titleKey',
    buttonIcon: 'cbi-trash text-xl',
    buttonTitleKey: `KnowledgeBase.modals.delete.buttonTitleKey`,
    variant: 'red',
    contentKey: `KnowledgeBase.modals.delete.contentKey`,
  },
  edit: {
    titleKey: 'KnowledgeBase.modals.edit.titleKey',
    buttonIcon: 'cbi-edit-2 text-xl',
    buttonTitleKey: `KnowledgeBase.modals.edit.buttonTitleKey`,
    variant: 'white',
    contentKey: `KnowledgeBase.modals.edit.contentKey`,
  },
};

const fileTypeOptions = [
  { id: 0, value: FileType.knowledge, labelKey: 'KnowledgeBase.fileTypesOptions.0' },
  { id: 1, value: FileType.reference, labelKey: 'KnowledgeBase.fileTypesOptions.1' },
];

export default function FilesList({ files }: { files: KnowledgeFile[] }) {
  const t = useTranslations();
  const fileTypesTooltips = Object.values(t.raw('KnowledgeBase.fileTypesTooltips'));
  const [items, setItems] = useState<KnowledgeFile[]>(files);

  useSSE({
    events: {
      fileUpdated: (updatedItem) =>
        updatedItem && setItems((prev) => prev.map((item) => (item?.id === updatedItem?.id ? updatedItem : item))),
      fileUploaded: (newItem) => newItem && setItems((prev) => [newItem, ...prev]),
    },
  });

  useEffect(() => {
    setItems(files);
  }, [files]);

  return (
    <ul className="flex flex-grow flex-col">
      {items.map((file: KnowledgeFile, index: number, { length }: KnowledgeFile[]) => (
        <li
          key={file.name + index}
          className={twMerge('flex w-full items-center border-storm-gray py-1', index === length - 1 ? '' : 'border-b')}
        >
          <div
            className={twMerge(
              'flex w-full items-center justify-between gap-x-5 rounded-xl px-4 py-2.5 hover:bg-white-opacity',
              file.status === FileStatus.processing && 'border border-dark-aquamarine',
              file.status === FileStatus.error && 'border border-salmon'
            )}
          >
            <div
              className={twMerge(
                'line-clamp-3 shrink flex-grow basis-1/2 break-words text-sm',
                file.checked ? 'text-main' : 'text-light-gray'
              )}
              title={file.name}
            >
              {file.name}
            </div>

            <div
              className={twMerge(
                'flex w-[15%] min-w-60 shrink-0 flex-grow items-start gap-x-1 text-sm',
                file.checked ? 'text-main' : 'text-light-gray'
              )}
            >
              <Dropdown
                selectedOption={file.fileType || FileType.knowledge}
                className="w-full text-nowrap py-1.5 text-light-gray"
                options={fileTypeOptions}
                onSelectedChange={async ({ value }) => await editFile(file.id, { fileType: value })}
              ></Dropdown>
              <Tooltip
                iconClass="cbi-message-question text-light-gray hover:text-dark-aquamarine"
                tooltipClassName="max-w-30"
                tooltipLabelClassName="flex-col inline-flex gap-y-3 p-3 "
              >
                {fileTypesTooltips.map(({ title, description }: any, id: number) => (
                  <div key={`tooltip-option-${id}`}>
                    <h3 className="text-xs font-semibold text-background">{title}</h3>
                    <p className="text-xs font-light text-background">{description}</p>
                  </div>
                ))}
              </Tooltip>
            </div>

            <div className="flex shrink-0 items-center gap-x-5">
              <span className="min-w-28 text-right text-xs text-light-gray">
                {getDateWeekDay(file.uploaded_at)}, {getDateDay(file.uploaded_at)}
              </span>

              <div className="flex min-w-24 items-center justify-end gap-x-5">
                {file.status === FileStatus.complete && (
                  <>
                    <Button
                      className="cbi-document-download p-0 text-storm-gray hover:text-main"
                      onClick={async () => {
                        const link = await getFileLink(file);
                        if (link) window.location.href = link;
                      }}
                    />
                    <EditModalButton
                      className="cbi-edit-2 p-0 text-storm-gray hover:text-main"
                      config={{
                        ...modalsConfig.edit,
                        confirm: async (value: string) => await editFile(file.id, { name: value || file.name }),
                      }}
                      initialValue={file.name}
                    >
                      <p className="text-main">{t('KnowledgeBase.modals.edit.contentKey', { fileName: file.name })}</p>
                    </EditModalButton>
                  </>
                )}
                {file.status !== FileStatus.processing && (
                  <DeleteWithConfirmationButton
                    className={twMerge(
                      'cbi-trash p-0 text-storm-gray hover:text-main',
                      file.status === FileStatus.error && 'text-salmon'
                    )}
                    config={{ ...modalsConfig.delete, confirm: async () => await deleteFile(file) }}
                  >
                    <p className="text-main">{t('KnowledgeBase.modals.delete.contentKey', { fileName: file.name })}</p>
                  </DeleteWithConfirmationButton>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
