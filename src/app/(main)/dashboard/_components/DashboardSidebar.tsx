'use client';

import { use, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { Assistant, AssistantMeta } from '@/lib/models/assistant.models';
import { Period } from '@/lib/models/common.models';
import { filterByDayDateField } from '@/lib/utils/array.utils';
import { getPeriodStartDate } from '@/lib/utils/date.utils';
import { PeriodFilter } from '@/shared/PeriodFilter';
import { SidebarStatisticCard } from './StatisticCards';

const getSum = (assistants: Assistant[], field: keyof AssistantMeta) => {
  return assistants.reduce(
    (sum: number, { meta }: Assistant) => (meta?.[field] ? sum + (meta[field] as number) : sum),
    0
  );
};

const getStatisticsCardsData = (assistants: Assistant[]) => {
  return [
    { id: '1', icon: 'cbi-cpu', titleKey: 'Dashboard.statisticsCard.0', value: assistants.length },
    {
      id: '2',
      icon: 'cbi-message-text',
      titleKey: 'Dashboard.statisticsCard.1',
      value: getSum(assistants, 'conversations'),
    },
    {
      id: '3',
      icon: 'cbi-user',
      titleKey: 'Dashboard.statisticsCard.2',
      value: getSum(assistants, 'users'),
    },
    { id: '4', icon: 'cbi-card-pos', titleKey: 'Dashboard.statisticsCard.3', value: 0, disabled: true },
  ];
};

export default function DashboardSidebar({ assistants$ }: { assistants$: Promise<Assistant[]> }) {
  const allAssistants = use(assistants$);
  const searchParams = useSearchParams();
  const periodParam = searchParams.get('period') as Period;

  const startDate = useMemo(() => getPeriodStartDate(periodParam || Period.allTime), [periodParam]);
  const assistants = useMemo(
    () => (!startDate ? allAssistants : filterByDayDateField(allAssistants, 'created_at', startDate)),
    [startDate, allAssistants]
  );

  return (
    <section className="overflow-hiddenflex relative flex min-w-0 max-w-lg shrink-0 flex-grow flex-col gap-y-3 overflow-y-auto">
      <PeriodFilter />
      <div className="flex min-w-0 flex-grow flex-wrap content-start gap-1 overflow-y-auto">
        {getStatisticsCardsData(assistants).map((card: any, index: number) => (
          <SidebarStatisticCard
            key={`sidebar-${index}`}
            {...card}
            className="h-auto shrink-0 flex-grow basis-[49%] gap-y-16 2xl:gap-y-20"
          />
        ))}
      </div>
    </section>
  );
}
