'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { LOGIN_ROUTE } from '@/lib/constants';
import { resetPassword } from '@/server/actions/authActions';
import { Button } from '@/shared/Button';
import { Input } from '@/shared/Input';

interface ForgotPasswordForm {
  email: string;
  errorMessage?: string | null;
  successMessage?: string | null;
}

export default function ForgotPassword() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordForm>({
    mode: 'onBlur',
  });

  const emailValidation = {
    required: t('Auth.Login.emailRequiredError'),
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: t('Auth.Login.invalidEmailError'),
    },
  };

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    const response = await resetPassword(data);
    setIsSubmitting(false);

    if (response.errorMessage) {
      setValue('errorMessage', response.errorMessage);
      setValue('successMessage', null);
    } else {
      setValue('successMessage', 'Auth.ForgotPassword.resetEmailSent');
      setValue('errorMessage', null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-fit min-h-0 flex-col gap-y-10">
      <div className="flex flex-col gap-y-7">
        <h1 className="text-3xl font-bold text-main">{t('Auth.ForgotPassword.title')}</h1>
        <p className="text-main">{t('Auth.ForgotPassword.description')}</p>
      </div>

      <div className="flex flex-col gap-y-4">
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={emailValidation}
          render={({ field }) => (
            <Input
              {...field}
              id="forgot-password-email"
              type="email"
              placeholderKey="Auth.Login.emailPlaceholder"
              disabled={isSubmitting}
              inputClassName="border-main placeholder:text-light-gray bg-transparent"
            />
          )}
        />
        {errors.email && <p className="-mt-2 text-sm text-salmon">{String(errors.email.message)}</p>}
      </div>

      <div className="flex flex-col gap-y-4">
        <Button
          variant="solid"
          color="primary"
          className="border-background-border/[18%] py-4 text-xl font-bold disabled:pointer-events-none disabled:bg-main/[8%]"
          aria-disabled={isSubmitting || !isValid}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <span className="cbi-voice-loader gradient-loader mx-4 inline-flex animate-spin text-lg" />
          ) : (
            <>
              <i className="cbi-arrow-right-circle" />
              {t('Auth.ForgotPassword.resetButton')}
            </>
          )}
        </Button>

        <Link prefetch={false} className="text-center text-sm text-dark-aquamarine" href={LOGIN_ROUTE}>
          {t('Auth.ForgotPassword.backToLogin')}
        </Link>
      </div>

      {!!getValues('errorMessage') && (
        <p className="-mt-5 flex text-base text-salmon" aria-live="polite" aria-atomic="true">
          {t(String(getValues('errorMessage')))}
        </p>
      )}

      {!!getValues('successMessage') && (
        <p className="-mt-5 flex text-base text-dark-aquamarine" aria-live="polite" aria-atomic="true">
          {t(String(getValues('successMessage')))}
        </p>
      )}
    </form>
  );
}
