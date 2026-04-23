'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { LOGIN_ROUTE } from '@/lib/constants';
import { AuthState } from '@/lib/models/auth.models';
import { signupUser } from '@/server/actions/authActions';
import { Button } from '@/shared/Button';
import Checkbox from '@/shared/Checkbox';
import { Input } from '@/shared/Input';

export default function Signup() {
  const t = useTranslations();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid, isLoading, isSubmitting },
  } = useForm<AuthState>({
    mode: 'onChange',
  });

  const onSubmit = async (data: AuthState) => {
    const response = await signupUser(data);

    if (response.errorMessage) {
      return setValue('errorMessage', response.errorMessage);
    }

    router.push(LOGIN_ROUTE);
  };

  const nameValidation = {
    required: t('Auth.Signup.nameRequiredError'),
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
      message: t('Auth.Signup.passwordMinLengthError'),
    },
  };

  const checkboxValidation = {
    required: t('Auth.Signup.checkboxRequiredError'),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-fit min-h-0 flex-col gap-y-10">
      <div className="flex flex-col gap-y-7">
        <h1 className={'text-3xl font-bold text-main'}>{t('Auth.Signup.title')}</h1>
        <p className="text-main">
          {t('Auth.Login.haveAccountLabel')}{' '}
          <Link prefetch={false} className="text-dark-aquamarine" href={LOGIN_ROUTE}>
            {t('Auth.Login.loginButton')}
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-y-4">
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={nameValidation}
          render={({ field }) => (
            <Input
              {...field}
              id="signup-name"
              type="text"
              placeholderKey="Auth.Login.nameInputPlaceholder"
              disabled={isLoading || isSubmitting}
              inputClassName="border-main placeholder:text-light-gray bg-transparent"
            />
          )}
        />
        {errors.name && <p className="-mt-2 text-sm text-salmon">{String(errors.name.message)}</p>}

        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={emailValidation}
          render={({ field }) => (
            <Input
              {...field}
              id="signup-email"
              placeholderKey="Auth.Login.emailPlaceholder"
              inputClassName="border-main placeholder:text-light-gray bg-transparent pe-10"
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
              type="password"
              id="signup-password"
              placeholderKey="Auth.Login.passwordPlaceholder"
              inputClassName="border-main placeholder:text-light-gray bg-transparent pe-10"
            />
          )}
        />
        {errors.password && <p className="text-sm text-salmon">{String(errors.password.message)}</p>}

        <div className="flex flex-col items-center justify-between gap-y-5">
          <p className="text-dark-aquamarine">{t('Auth.Signup.notification')}</p>

          <div className="flex items-center gap-x-2 text-xs text-light-gray">
            <Controller
              name="consent"
              control={control}
              rules={checkboxValidation}
              render={({ field }) => <Checkbox {...field} selected={field.value} />}
            />
            <p className="inline">
              {t.rich('Auth.Signup.consent', {
                'pp-link': (chunk) => (
                  <Link
                    prefetch={false}
                    className="text-xs text-main underline underline-offset-2"
                    target="_blank"
                    href={'https://coachbot.ai/legal/privacy-policy'}
                  >
                    {chunk}
                  </Link>
                ),
                'sa-link': (chunk) => (
                  <Link
                    prefetch={false}
                    className="text-xs text-main underline underline-offset-2"
                    target="_blank"
                    href={'https://coachbot.ai/legal/service-agreement-studio'}
                  >
                    {chunk}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>
        {errors.consent && <p className="text-sm text-salmon">{String(errors.consent.message)}</p>}
      </div>

      <Button
        variant="solid"
        color="primary"
        className="border-background-border/[18%] py-4 text-xl font-bold disabled:pointer-events-none disabled:bg-main/[8%]"
        aria-disabled={isLoading || isSubmitting || !isValid}
        disabled={isLoading || isSubmitting || !isValid}
      >
        <i className="cbi-arrow-right-circle"></i>
        {t('Auth.Login.signupButton')}
      </Button>

      {!!getValues('errorMessage') && (
        <p className="-mt-5 flex text-base text-salmon" aria-live="polite" aria-atomic="true">
          {t(String(getValues('errorMessage')))}
        </p>
      )}
    </form>
  );
}
