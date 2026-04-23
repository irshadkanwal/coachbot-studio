import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/shared/Button';
import { Modal } from '@/shared/Modal';

interface ModalConfig {
  buttonTitleKey: string;
  buttonIcon: string;
  titleKey: string;
  contentKey: string;
  variant: string;
  showContent?: boolean;
  disabled?: boolean;
  showInputValue?: boolean;
  handler?: (value?: any) => void | Promise<void>;
}

const getModalsConfig = (translationKey: string): Record<string, ModalConfig> => ({
  create: {
    buttonTitleKey: `${translationKey}.dropdown.customValueModal.submitButton`,
    buttonIcon: 'cbi-add text-xl',
    titleKey: `${translationKey}.dropdown.customValueModal.title`,
    contentKey: `${translationKey}.dropdown.customValueModal.content`,
    variant: 'gray',
    showContent: true,
  },
  edit: {
    buttonTitleKey: `${translationKey}.dropdown.customValueModal.renameButton`,
    buttonIcon: 'cbi-edit-2 text-xl',
    titleKey: `${translationKey}.dropdown.customValueModal.renameTitle`,
    variant: 'gray',
    contentKey: `${translationKey}.dropdown.customValueModal.renameContent`,
    showContent: true,
    showInputValue: true,
  },
  delete: {
    buttonTitleKey: `${translationKey}.dropdown.customValueModal.deleteButton`,
    buttonIcon: 'cbi-trash text-xl',
    titleKey: `${translationKey}.dropdown.customValueModal.deleteTitle`,
    variant: 'red',
    showContent: false,
    contentKey: `${translationKey}.dropdown.customValueModal.deleteContent`,
  },
});

export default function CreateValuePanel({
  showEditButtons,
  showCreateButton = true,
  translationKey,
  initialValue,
  className,
  disabled,
  editButtonsClassName,
  handleCreation,
  handleEdit,
  handleDelete,
}: {
  showEditButtons?: boolean;
  showCreateButton?: boolean;
  disabled?: boolean;
  translationKey: string;
  initialValue?: string | null;
  className?: string;
  editButtonsClassName?: string;
  handleCreation?: (value?: any) => any | Promise<any>;
  handleEdit: (value?: any) => any | Promise<any>;
  handleDelete: () => any | Promise<any>;
}) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [value, setValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>();
  const modalsConfig = getModalsConfig(translationKey);

  const handleConfirm = useCallback(
    ({ handler }: ModalConfig) => {
      handler?.(value);
      setModalOpen(false);
      setValue('');
    },
    [value]
  );
  const handleCreate = useCallback(() => {
    setModalConfig({ ...modalsConfig.create, handler: handleCreation });
    setModalOpen(true);
  }, []);

  useEffect(() => {
    const isNewItem = searchParams.get('newItem');

    !!isNewItem && handleCreate();
  }, [searchParams]);

  return (
    <>
      <div className={twMerge('flex flex-grow gap-x-1', className)}>
        {showEditButtons && (
          <>
            <Button
              disabled={disabled}
              type="button"
              variant="solid"
              color="gray"
              className={twMerge('cbi-edit-2 px-3.5 py-2 text-lg', editButtonsClassName)}
              onClick={(e) => {
                e.stopPropagation();
                setModalConfig({ ...modalsConfig.edit, handler: handleEdit });
                setModalOpen(true);
              }}
            />

            <Button
              disabled={disabled}
              type="button"
              variant="solid"
              color="gray"
              className={twMerge('cbi-trash px-3.5 py-2 text-lg', editButtonsClassName)}
              onClick={(e) => {
                e.stopPropagation();
                setModalConfig({ ...modalsConfig.delete, handler: handleDelete });
                setModalOpen(true);
              }}
            />
          </>
        )}
        {showCreateButton && (
          <Button
            disabled={disabled}
            type="button"
            variant="dashed"
            color="gray"
            className="flex-grow py-2.5"
            onClick={handleCreate}
          >
            <i className="cbi-add"></i>
            {t(`${translationKey}.dropdown.customValueModal.createButton`)}
          </Button>
        )}
      </div>
      {modalConfig && (
        <Modal
          buttonTitleKey={modalConfig.buttonTitleKey}
          buttonIcon={modalConfig.buttonIcon}
          titleIcon="cbi-send"
          titleKey={modalConfig.titleKey}
          variant={modalConfig.variant}
          isOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          confirm={() => handleConfirm(modalConfig)}
          disabled={modalConfig.showContent && !value.trim().length}
        >
          <div className="flex flex-col gap-y-5 text-main">
            <p>{t(modalConfig.contentKey, { name: initialValue || '' })}</p>
            {modalConfig.showContent && (
              <input
                id="add-new-value-input"
                required
                defaultValue={modalConfig.showInputValue ? initialValue || '' : ''}
                placeholder={t(`${translationKey}.dropdown.customValueModal.inputPlaceholder`)}
                className={twMerge(
                  'focus:no-outline rounded-lg border border-light-gray bg-white/[18%] px-4 py-2 text-lg capitalize text-main placeholder:text-base focus:ring-0'
                )}
                onChange={(e) => setValue(e.target.value)}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
