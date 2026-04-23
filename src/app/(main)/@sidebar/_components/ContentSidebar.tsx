import { useTranslations } from 'next-intl';

import { ACCEPTED_FILE_TYPES } from '@/lib/constants';
import TipsSidebar from './TipsSidebar';

export default function ContentSidebar() {
  const t = useTranslations();

  return (
    <TipsSidebar titleKey="KnowledgeBase.title" tipsKey="KnowledgeBase.tips" titleClass="text-dark-aquamarine italic">
      <div className="mb-8 flex flex-col gap-y-3 ps-1">
        <p className="text-main">{t('KnowledgeBase.usageNote')}</p>
        <span className="text-sm text-light-gray">
          {t('KnowledgeBase.supportedTypesLabel')} {[...new Set(Object.values(ACCEPTED_FILE_TYPES).flat())].join(', ')}
        </span>
      </div>
    </TipsSidebar>
  );
}
