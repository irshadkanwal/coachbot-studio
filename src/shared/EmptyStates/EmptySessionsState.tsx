import { memo } from 'react';
import { useTranslations } from 'next-intl';

const EmptySessionsState = memo(function EmptySessionsState() {
  const t = useTranslations();

  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-y-4 text-center">
      <div className="rounded-full bg-graphic/[20%] p-6">
        <i className="cbi-chat text-4xl text-light-gray" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-main">{t('CoachDetails.Conversations.emptyList.title')}</h3>
        <p className="max-w-md text-sm text-light-gray">{t('CoachDetails.Conversations.emptyList.description')}</p>
      </div>
    </div>
  );
});

export default EmptySessionsState;
