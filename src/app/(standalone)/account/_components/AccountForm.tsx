'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { updateUserAccount } from '@/server/actions/userActions';
import { Button } from '@/shared/Button';
import { Input } from '@/shared/Input';

interface AccountState {
  name?: string;
  email?: string;
}

export default function AccountForm({ name, email }: { name: string; email: string }) {
  const t = useTranslations();

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
  } = useForm();

  const onSubmit = async (data: AccountState) => {
    const response = await updateUserAccount(data.name || '', data.email || '');

    if (response.errors) {
      return response.errors.forEach(({ name, message }: any) => setError(name, { message }));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
      <Input
        id="name-input"
        initialValue={name}
        labelKey="Account.accountForm.nameLabel"
        inputClassName="bg-transparent"
        labelClassName="text-sm text-storm-gray ms-2"
        className="gap-y-2"
        {...register('name')}
      />
      {errors.name && <p className="-mt-2 text-sm text-salmon">{t(String(errors.name?.message))}</p>}
      <Input
        id="email-input"
        type="email"
        initialValue={email}
        labelKey="Account.accountForm.emailLabel"
        inputClassName="bg-transparent"
        labelClassName="text-sm text-storm-gray ms-2"
        className="gap-y-2"
        disabled
        {...register('email')}
      />

      {errors.email && <p className="-mt-2 text-sm text-salmon">{t(String(errors.email?.message))}</p>}
      <Button
        type="submit"
        variant="solid"
        color="light"
        className={`w-48 self-end ${isLoading || isSubmitting ? 'pointer-events-none animate-pulse' : ''}`}
      >
        <i className="cbi-archive-tick" />
        {t('General.Instruction.saveButton')}
      </Button>
    </form>
  );
}
