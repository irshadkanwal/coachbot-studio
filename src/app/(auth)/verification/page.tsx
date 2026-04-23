'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { LOGIN_ROUTE } from '@/lib/constants';
import { verifyEmail } from '@/server/actions/authActions';
import { Spinner } from '@/shared/Loaders';

export default function Verification() {
  const t = useTranslations();
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'success' | 'error' | 'pending'>('pending');
  const oobCode = params.get('oobCode');
  const mode = params.get('mode');

  useEffect(() => {
    const handleVerification = async () => {
      if (mode === 'verifyEmail' && oobCode) {
        const success = await verifyEmail(oobCode, mode);

        if (success) {
          setStatus('success');
          setTimeout(() => router.push(LOGIN_ROUTE), 2000);
        } else {
          setStatus('error');
        }
      }
    };

    handleVerification();
  }, [mode, oobCode]);

  return (
    <div className="flex h-fit min-h-0 flex-col gap-y-10">
      <div className="flex flex-col gap-y-7">
        <h1 className={'text-3xl font-bold text-main'}>{t('Auth.Verification.title')}</h1>

        {status === 'pending' && (
          <div className="flex w-full flex-grow flex-nowrap items-center gap-x-3 text-lg text-dark-aquamarine">
            <Spinner className="text-xl" />
            <p> {t('Auth.Verification.pending.description')}</p>
          </div>
        )}
        {status === 'success' && (
          <>
            <p className="flex items-center gap-x-3 text-lg text-dark-aquamarine">
              <i className="cbi-tick-circle-fill !text-2xl" />
              {t('Auth.Verification.success.description')}
            </p>

            <span className="text-main">{t('Auth.Verification.success.action')}</span>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="flex items-center gap-x-3 text-lg text-salmon">
              <i className="cbi-close-circle !text-2xl" />
              {t('Auth.Verification.error.description')}
            </p>
            <p>
              <span className="text-main">{t('Auth.Verification.error.action')}</span>
              <Link prefetch={false} className="text-dark-aquamarine" href={LOGIN_ROUTE}>
                {t('Auth.Login.loginButton')}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
