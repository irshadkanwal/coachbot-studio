import { memo } from 'react';
import { useTranslations } from 'next-intl';

const EmptySessionNotFoundState = memo(function EmptySessionNotFoundState() {
  const t = useTranslations();

  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-y-4 text-center">
      <div className="rounded-full bg-red-100 p-6">
        <i className="cbi-warning text-4xl text-red-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-main">{t('CoachDetails.Conversations.emptyMessages.title')}</h3>
        <p className="max-w-md text-sm text-light-gray">{t('CoachDetails.Conversations.emptyMessages.description')}</p>
      </div>
    </div>
  );
});

export default EmptySessionNotFoundState;
