import { memo, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { AssistantUserChat } from '@/lib/models/assistant.models';
import { getAverageSessionLength, getMonthlyInteractions, getWeeklyInteractions } from '@/lib/utils/user-session.utils';

const UserSessionStatistics = memo(function UserSessionStatistics({ sessions }: { sessions: AssistantUserChat[] }) {
  const t = useTranslations();
  const statistics = useMemo(
    () => [
      {
        icon: 'cbi-calendar',
        titleKey: 'CoachDetails.Users.SessionAnalytics.analyticCards.0',
        value: getWeeklyInteractions(sessions),
      },
      {
        icon: 'cbi-calendar-circle',
        titleKey: 'CoachDetails.Users.SessionAnalytics.analyticCards.1',
        value: getMonthlyInteractions(sessions),
      },
      {
        icon: 'cbi-timer',
        titleKey: 'CoachDetails.Users.SessionAnalytics.analyticCards.2',
        value: sessions?.length ?? 0,
      },
      {
        icon: 'cbi-clock',
        titleKey: 'CoachDetails.Users.SessionAnalytics.analyticCards.3',
        value: getAverageSessionLength(sessions),
      },
    ],
    [sessions]
  );

  return (
    <div className="flex items-center justify-between gap-x-1">
      {statistics.map(({ icon, titleKey, value }, index) => (
        <div
          key={`statistic-card-${index}`}
          className="flex h-full flex-1 shrink-0 flex-col items-center justify-between gap-y-1 rounded-lg bg-dark-aquamarine/[11%] p-3.5 text-dark-aquamarine"
        >
          <div className="flex aspect-square items-center justify-center rounded-lg border border-dark-aquamarine p-0.5">
            <span className={`text-3xl ${icon}`}></span>
          </div>
          <p className="mb-1 text-center text-base">{t(titleKey)}</p>
          <span className="text-3xl font-bold">{value}</span>
        </div>
      ))}
    </div>
  );
});

export default UserSessionStatistics;
