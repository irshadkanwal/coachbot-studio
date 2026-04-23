import type { Assistant, AssistantConfiguration, AssistantMeta } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { getGoals } from '@/server/actions/goalsActions';
import { Button } from '@/shared/Button';

interface UserGoalTrackProps {
  assistant: Assistant & { meta?: AssistantMeta; configuration?: AssistantConfiguration };
}

export default async function UserGoalTrack({ assistant }: UserGoalTrackProps) {
  const [t, goals] = await Promise.all([getTranslations(), getGoals(assistant.id)]);
  const isEnabled = !!assistant.meta?.goalTrack;

  if (!isEnabled) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center gap-y-3 text-center">
        <div className="rounded-full bg-graphic/[20%] p-4">
          <i className="cbi-health text-4xl text-light-gray" />
        </div>
        <div className="text-sm text-light-gray">{t('CoachDetails.Users.GoalTrack.disabledMessage')}</div>
        <div className="text-xs text-light-gray">{t('CoachDetails.Users.GoalTrack.disabledDescription')}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-main">{t('CoachDetails.Users.GoalTrack.title')}</h3>
        <Button variant="outline" color="darkGray" className="text-sm" href={`/coach/${assistant.id}?tab=goal-track`}>
          <i className="cbi-settings" />
          {t('CoachDetails.Users.GoalTrack.configureButton')}
        </Button>
      </div>

      <div className="rounded-xl border border-dark-aquamarine bg-white-opacity p-4">
        <p className="mb-4 text-sm text-light-gray">{t('CoachDetails.Users.GoalTrack.description')}</p>

        {goals.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-main">{t('CoachDetails.Users.GoalTrack.availableGoalsTitle')}</h4>
            <div className="space-y-2">
              {goals.map((goal) => (
                <div key={goal.id} className="rounded-lg border border-background-border/[16%] bg-background/[8%] p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-main">{goal.title}</div>
                      <div className="mt-1 text-xs text-light-gray">
                        {t(`CoachDetails.Config.GoalTrackPage.goalsList.period.${goal.frequency}`, {
                          repeatEvery: goal.repeatEvery,
                        })}
                      </div>
                    </div>
                    <div className="ml-3">
                      <Button variant="outline" color="darkGray" className="text-xs" disabled>
                        <i className="cbi-eye" />
                        {t('CoachDetails.Users.GoalTrack.viewGoalButton')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-light-gray">{t('CoachDetails.Users.GoalTrack.noGoals')}</div>
        )}
      </div>

      <div className="rounded-xl border border-background-border/[16%] bg-background/[8%] p-4">
        <h4 className="mb-2 text-sm font-medium text-main">{t('CoachDetails.Users.GoalTrack.userProgressTitle')}</h4>
        <p className="text-sm text-light-gray">{t('CoachDetails.Users.GoalTrack.userProgressDescription')}</p>
        <div className="mt-3 text-center">
          <Button variant="solid" color="primary" className="text-sm" disabled>
            <i className="cbi-chart" />
            {t('CoachDetails.Users.GoalTrack.viewProgressButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}
