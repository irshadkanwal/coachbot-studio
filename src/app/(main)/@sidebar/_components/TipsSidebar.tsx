import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { Tips } from '@/shared/Tips';

export default function TipsSidebar({
  titleKey,
  tipsKey,
  titleClass,
  children,
}: {
  titleKey: string;
  tipsKey: string;
  titleClass?: string;
  children?: ReactNode;
}) {
  const t = useTranslations();

  return (
    <>
      <h3 className="pe-14 text-xl uppercase text-main">{t(titleKey)}</h3>
      <div className="flex flex-col overflow-y-auto rounded-lg bg-graphic/[14%] p-5">
        {children}
        <Tips collapsible={false} tipsKey={tipsKey} t={t} titleClass={titleClass} />
      </div>
    </>
  );
}
