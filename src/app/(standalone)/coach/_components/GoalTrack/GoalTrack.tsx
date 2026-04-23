import { getTranslations } from 'next-intl/server';

import { Assistant } from '@/lib/models/assistant.models';
import { getCategories, getGoals } from '@/server/actions/goalsActions';
import Tabs from '@/shared/Tabs';
import AddGoalForm from './AddGoalForm';
import GoalsList from './GoalsList';

const goalTrackTabs = (assistant: Assistant) => [
  {
    name: 'creation',
    nameKey: 'CoachDetails.Config.GoalTrackPage.tabs.0.title',
    content: (
      <AddGoalForm
        assistantId={assistant.id}
        className="border border-dark-aquamarine bg-white-opacity p-3.5"
        disabled={!assistant.meta?.goalTrack}
        categories$={getCategories(assistant.id)}
      />
    ),
  },
  {
    name: 'review',
    nameKey: 'CoachDetails.Config.GoalTrackPage.tabs.1.title',
    content: <GoalsList assistantId={assistant.id} goals$={getGoals(assistant.id)} />,
  },
];

export default async function GoalTrack({ assistant }: { assistant: Assistant }) {
  const t = await getTranslations();

  return (
    <section className="flex flex-grow flex-col gap-y-6">
      <h3 className="text-center text-base font-medium text-light-gray">
        {t('CoachDetails.Config.GoalTrackPage.title')}
      </h3>
      <Tabs
        id="goal-track-tabs"
        listClassName={`bg-graphic/[14%] p-0.5 ${!assistant.meta?.goalTrack && 'pointer-events-none opacity-40'}`}
        tabClassName={`py-2 text-sm`}
        panelClassName="flex-col flex-grow"
        tabs={goalTrackTabs(assistant)}
      />
    </section>
  );
}
