import { useTranslations } from 'next-intl';

export const ProfileSettingsDisclaimer: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="my-10 text-center text-lg">
      <div className="mb-5 text-light-gray">
        {t('NewCoachCreation.steps.coachbot-profile.disclaimer.update-during-onboarding')}
      </div>
      <div className="text-light-gray">
        {t.rich('NewCoachCreation.steps.coachbot-profile.disclaimer.version', {
          strong: (chunks) => <span className="text-main">{chunks}</span>,
        })}
      </div>
    </div>
  );
};
