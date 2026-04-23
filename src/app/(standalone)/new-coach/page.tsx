'use client';

import { useTranslations } from 'next-intl';

import { PrivateRoutes } from '@/lib/constants';
import { Button } from '@/shared/Button';
import { Logo } from '@/shared/Logo';

export default function NewCoachWelcome() {
  const t = useTranslations('NewCoachCreation.hero');
  return (
    <div className="relative flex flex-col items-center gap-y-6 p-6">
      <Button
        href={PrivateRoutes.dashboard}
        variant="solid"
        color="gray"
        className="cbi-close-circle fixed right-6 top-6 aspect-square w-12 shrink-0 px-3 py-0 text-lg text-main"
      />
      <Logo className="mx-auto h-10 w-auto" />
      <h1 className="mt-44 text-center text-2xl font-bold uppercase text-main">{t(`title`)}</h1>
      <p className="max-w-xl px-8 text-center text-lg text-light-gray md:max-w-2xl">{t(`subtitle`)}</p>
      <div className="my-0 w-full max-w-2xl border-b border-gray-400" />
      <div className="mb-4 mt-8 w-full max-w-md rounded-xl bg-white/10 p-4">
        <p className="text-center text-light-gray">{t(`instruction_0`)}</p>
        <p className="text-center text-main">{t(`instruction_1`)}</p>
        <p className="text-center text-main">{t(`instruction_2`)}</p>
        <p className="text-center text-main">{t(`instruction_3`)}</p>
      </div>
      <p className="text-2xl font-bold text-primary-green">{t(`ready`)}</p>
      <Button
        href={PrivateRoutes.newCoachSteps}
        variant="solid"
        color="primary"
        className="flex min-w-[200px] items-center justify-center gap-x-2"
      >
        <i className="cbi-add-square" />
        {t(`start`)}
      </Button>
    </div>
  );
}
