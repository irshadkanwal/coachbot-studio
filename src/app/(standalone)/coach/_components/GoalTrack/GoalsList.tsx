import { use } from 'react';
import { useTranslations } from 'next-intl';

import { Goal } from '@/lib/models/goal.models';
import { getFormatedDate } from '@/lib/utils/date.utils';
import { getCategories, removeGoal } from '@/server/actions/goalsActions';
import { Chip } from '@/shared/Chip';
import { DeleteWithConfirmationButton } from '@/shared/ModalButtons';
import EditGoalModalButton from './EditGoalModalButton';

const deleteModalConfig = {
  buttonTitleKey: 'Common.deleteButton',
  buttonIcon: 'cbi-trash',
  titleIcon: 'cbi-send',
  titleKey: 'CoachDetails.Config.GoalTrackPage.goalsList.deleteModalTitle',
  variant: 'red',
};

export default function GoalsList({ assistantId, goals$ }: { assistantId: string; goals$: Promise<Goal[]> }) {
  const t = useTranslations();
  const goals = use(goals$);
  const getRepeatChipText = (goal: Goal) => {
    const { frequency, repeatEvery, monthlyRepeat, weeklyRepeat = [], completionRule } = goal;
    const { times, date } = completionRule;
    const frequencyLabel = t(`CoachDetails.Config.GoalTrackPage.goalsList.period.${frequency}`, {
      repeat: repeatEvery,
    });
    const weeklyRepeatLabel = weeklyRepeat?.length && ` - ${weeklyRepeat.join(', ')}`;
    const monthlyRepeatLabel =
      monthlyRepeat && ` ${t(`CoachDetails.Config.GoalTrackPage.goalsList.monthlyRepeat.${monthlyRepeat}`)}`;
    const completionTimesLabel = times && t(`CoachDetails.Config.GoalTrackPage.goalsList.timesLabel`, { num: times });
    const completionDateLabel =
      date &&
      t(`CoachDetails.Config.GoalTrackPage.goalsList.completionDateLabel`, {
        date: getFormatedDate(date, 'en', { dateStyle: 'medium' }),
      });
    const completionLabel = completionDateLabel || completionTimesLabel || '';

    return `${frequencyLabel}${weeklyRepeatLabel || monthlyRepeatLabel || ''}${completionLabel ? ', ' + completionLabel : ''}`;
  };

  if (!goals || !goals.length) {
    return (
      <div className="my-6 flex flex-col items-center justify-center gap-y-2">
        <h3 className="text-sm uppercase text-light-gray">
          {t('CoachDetails.Config.GoalTrackPage.goalsList.emptyGoalsTitle')}
        </h3>
        <p className="text-sm text-main">{t('CoachDetails.Config.GoalTrackPage.goalsList.emptyGoalsDescription')}</p>
      </div>
    );
  }

  return (
    <ul className="flex min-w-0 flex-grow flex-col gap-y-1">
      {goals.map((goal: Goal, index: number) => (
        <li
          key={`goal-list-item-${index}`}
          className="flex min-w-0 items-center gap-x-5 rounded-2xl border border-background-border/[11%] bg-white-opacity p-3.5 hover:border-main hover:bg-light-opacity"
        >
          <div className="flex shrink flex-grow flex-col gap-y-2">
            <p className="line-clamp-4 text-base text-main">{goal.title}</p>
            <div className="flex flex-wrap gap-x-1">
              <Chip size="s" variant="dark" text={goal.category?.name} textClassName="capitalize text-xs" />

              <Chip
                size="s"
                variant="transparent"
                text={getRepeatChipText(goal)}
                textClassName="text-xs text-light-gray md:text-wrap shrink text-start"
              />
            </div>
          </div>
          <span className="shrink-0 text-wrap break-words text-xs text-light-gray">
            {getFormatedDate(goal.created_at || new Date(), 'en', { dateStyle: 'full' })}
          </span>
          <div className="flex min-w-0 shrink-0 items-center justify-around gap-x-3">
            <EditGoalModalButton goal={goal} categories$={getCategories(assistantId)} />
            <DeleteWithConfirmationButton
              iconClassName="cbi-trash !text-lg"
              className="m-0 p-0 text-lg leading-3 text-storm-gray hover:text-main"
              config={{
                ...deleteModalConfig,
                confirm: async () => {
                  'use server';
                  await removeGoal(goal.id);
                },
              }}
            >
              <div className="flex flex-col gap-y-5 text-main">
                <p>{t('CoachDetails.Config.GoalTrackPage.goalsList.deleteModalContent', { name: goal.title })}</p>
              </div>
            </DeleteWithConfirmationButton>
          </div>
        </li>
      ))}
    </ul>
  );
}
