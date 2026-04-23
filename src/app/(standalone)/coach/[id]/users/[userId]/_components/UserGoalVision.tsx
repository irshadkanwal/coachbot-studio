import type { Assistant, AssistantConfiguration, AssistantMeta } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { getCategories } from '@/server/actions/goalsActions';
import { Button } from '@/shared/Button';

interface UserGoalVisionProps {
  assistant: Assistant & { meta?: AssistantMeta; configuration?: AssistantConfiguration };
}

export default async function UserGoalVision({ assistant }: UserGoalVisionProps) {
  const [t, categories] = await Promise.all([getTranslations(), getCategories(assistant.id)]);
  const isEnabled = !!assistant.meta?.goalVision;

  if (!isEnabled) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center gap-y-3 text-center">
        <div className="rounded-full bg-graphic/[20%] p-4">
          <i className="cbi-chart text-4xl text-light-gray" />
        </div>
        <div className="text-sm text-light-gray">{t('CoachDetails.Users.GoalVision.disabledMessage')}</div>
        <div className="text-xs text-light-gray">{t('CoachDetails.Users.GoalVision.disabledDescription')}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-main">{t('CoachDetails.Users.GoalVision.title')}</h3>
        <Button variant="outline" color="darkGray" className="text-sm" href={`/coach/${assistant.id}?tab=goal-vision`}>
          <i className="cbi-settings" />
          {t('CoachDetails.Users.GoalVision.configureButton')}
        </Button>
      </div>

      <div className="rounded-xl border border-dark-aquamarine bg-white-opacity p-4">
        <p className="mb-4 text-sm text-light-gray">{t('CoachDetails.Users.GoalVision.description')}</p>

        {categories.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-main">{t('CoachDetails.Users.GoalVision.categoriesTitle')}</h4>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-lg border border-background-border/[16%] bg-background/[8%] p-3"
                >
                  <div className="text-sm font-medium text-main">{category.name}</div>
                  {category.description && <div className="mt-1 text-xs text-light-gray">{category.description}</div>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-light-gray">{t('CoachDetails.Users.GoalVision.noCategories')}</div>
        )}
      </div>

      <div className="rounded-xl border border-background-border/[16%] bg-background/[8%] p-4">
        <h4 className="mb-2 text-sm font-medium text-main">{t('CoachDetails.Users.GoalVision.userProgressTitle')}</h4>
        <p className="text-sm text-light-gray">{t('CoachDetails.Users.GoalVision.userProgressDescription')}</p>
        <div className="mt-3 text-center">
          <Button variant="solid" color="primary" className="text-sm" disabled>
            <i className="cbi-chart" />
            {t('CoachDetails.Users.GoalVision.viewProgressButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}
