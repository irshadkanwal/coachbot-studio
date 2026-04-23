'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { PublicRoutes } from '@/lib/constants';
import { AuthState } from '@/lib/models/auth.models';
import { loginUser } from '@/server/actions/authActions';
import { Button } from '@/shared/Button';
import { Input } from '@/shared/Input';

export default function Login() {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid, isLoading, isSubmitting },
  } = useForm<AuthState>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: AuthState) => {
    const response = await loginUser(data);

    if (response.errorMessage) {
      return setValue('errorMessage', response.errorMessage);
    }
    setValue('errorMessage', null);
  };
  const emailValidation = {
    required: t('Auth.Login.emailRequiredError'),
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: t('Auth.Login.invalidEmailError'),
    },
  };

  const passwordValidation = {
    required: t('Auth.Login.passwordRequiredError'),
    minLength: {
      value: 6,
      message: t('Auth.Login.passwordInavlidError'),
    },
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-fit min-h-0 flex-col gap-y-10">
      <div className="flex flex-col gap-y-7">
        <h1 className={'text-3xl font-bold text-main'}>{t('Auth.Login.title')}</h1>
        <p className="text-main">
          {t('Auth.Login.newUserLabel')}{' '}
          <Link prefetch={false} className="text-dark-aquamarine" href={PublicRoutes.signup}>
            {t('Auth.Login.createAccountLink')}
          </Link>
        </p>
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
              id="login-email"
              type="email"
              placeholderKey="Auth.Login.emailPlaceholder"
              disabled={isLoading || isSubmitting}
              inputClassName="border-main placeholder:text-light-gray bg-transparent"
            />
          )}
        />
        {errors.email && <p className="-mt-2 text-sm text-salmon">{String(errors.email.message)}</p>}

        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={passwordValidation}
          render={({ field }) => (
            <Input
              {...field}
              type={showPassword ? 'text' : 'password'}
              id="login-password"
              placeholderKey="Auth.Login.passwordPlaceholder"
              inputClassName="border-main placeholder:text-light-gray bg-transparent pe-10"
            >
              <Button
                className={twMerge(
                  'absolute right-3 top-1/2 m-0 -translate-y-1/2 border-0 p-0 text-lg text-storm-gray',
                  showPassword ? 'cbi-eye' : 'cbi-eye-slash'
                )}
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </Input>
          )}
        />
        {errors.password && <p className="-mt-2 text-sm text-salmon">{String(errors.password.message)}</p>}

        <div className="flex items-center justify-between">
          {/* <div className="flex items-center gap-x-2 text-xs text-light-gray">
            <Switcher /> <span>{t('Auth.Login.rememberLabel')}</span>
          </div> */}
          <Link prefetch={false} className="text-xs text-dark-aquamarine" href={PublicRoutes.forgotPassword}>
            {t('Auth.Login.forgotPasswordLink')}
          </Link>
        </div>
      </div>

      <Button
        variant="solid"
        color="primary"
        className="border-background-border/[18%] py-4 text-xl font-bold disabled:pointer-events-none disabled:bg-main/[8%]"
        aria-disabled={isLoading || isSubmitting || !isValid}
        disabled={isLoading || isSubmitting || !isValid}
      >
        <i className="cbi-arrow-right-circle"></i>
        {t('Auth.Login.loginButton')}
      </Button>

      {!!getValues('errorMessage') && (
        <p className="-mt-5 flex text-base text-salmon" aria-live="polite" aria-atomic="true">
          {t(String(getValues('errorMessage')))}
        </p>
      )}
    </form>
  );
}
