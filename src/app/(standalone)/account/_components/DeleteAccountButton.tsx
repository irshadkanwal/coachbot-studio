'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { LOGIN_ROUTE } from '@/lib/constants';
import { deleteUserAccount } from '@/server/actions/userActions';
import { Button } from '@/shared/Button';
import { Input } from '@/shared/Input';
import { Modal } from '@/shared/Modal';

interface DeleteAccountFormData {
  email: string;
  password: string;
}

export default function DeleteAccountButton({ userEmail }: { userEmail: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({
    defaultValues: {
      email: userEmail || '',
      password: '',
    },
  });

  const handleDeleteSubmission = useCallback(async (formData: DeleteAccountFormData) => {
    try {
      const result = await deleteUserAccount(formData);

      if (result.success) {
        setModalOpen(false);
        router.push(LOGIN_ROUTE);
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Button variant="outline" color="red" className="w-max" onClick={() => setModalOpen(true)}>
        <i className="cbi-trash-fill"></i>
        {t('Account.Sidebar.deleteButton')}
      </Button>

      {modalOpen && (
        <Modal
          buttonTitleKey="Account.DeleteModal.submitButton"
          buttonIcon="cbi-trash"
          titleIcon="cbi-trash"
          titleKey="Account.DeleteModal.title"
          variant="red"
          isOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          confirm={handleSubmit(handleDeleteSubmission)}
        >
          <div className="flex flex-col gap-y-5 text-main">
            <p>{t('Account.DeleteModal.warning')}</p>

            <Controller
              name="email"
              control={control}
              rules={{
                required: t('Account.DeleteModal.emailRequired'),
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="delete-account-email"
                  type="email"
                  labelKey="Account.DeleteModal.emailLabel"
                  placeholderKey="Account.DeleteModal.emailPlaceholder"
                />
              )}
            />
            {errors.email && <p className="text-sm text-salmon">{errors.email.message}</p>}

            <Controller
              name="password"
              control={control}
              rules={{
                required: t('Account.DeleteModal.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('Account.DeleteModal.passwordInvalid'),
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="delete-account-password"
                  type="password"
                  labelKey="Account.DeleteModal.passwordLabel"
                  placeholderKey="Account.DeleteModal.passwordPlaceholder"
                />
              )}
            />
            {errors.password && <p className="text-sm text-salmon">{errors.password.message}</p>}
          </div>
        </Modal>
      )}
    </div>
  );
}
