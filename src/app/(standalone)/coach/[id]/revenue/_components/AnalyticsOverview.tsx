import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';

import { Assistant, SubscriptionSearchQuery } from '@/lib/models/assistant.models';
import { Period } from '@/lib/models/common.models';
import { getPeriodStartDate } from '@/lib/utils/date.utils';
import { getAssistantSubscriptions } from '@/server/actions/assistantActions';
import ComingSoon from '@/shared/CoomingSoon';
import { PeriodFilter } from '@/shared/PeriodFilter';
import SubscriptionCards from './SubscriptionCards';

const RevenueChart = dynamic(() => import('../_components/RevenueChart'));

export default async function AnalyticsOverview({
  assistant,
  searchQuery,
}: {
  assistant: Assistant;
  searchQuery: SubscriptionSearchQuery;
}) {
  const t = await getTranslations();

  const subscriptions = await getAssistantSubscriptions(assistant.id, {
    from: getPeriodStartDate(searchQuery.period as Period),
  });

  return (
    <section className="flex min-h-0 flex-grow flex-col gap-y-3 overflow-y-auto">
      <div className="flex flex-grow flex-col rounded-xl border border-main/[6%] bg-white-opacity">
        <div className="border-b border-storm-gray p-3.5">
          <PeriodFilter disabled={!assistant.meta?.revenueEnabled} />
        </div>
        <SubscriptionCards assistant={assistant} subscriptions={subscriptions} />
      </div>
      <div className="flex flex-grow flex-col gap-y-2">
        {!assistant.meta?.revenueEnabled ? (
          <div className="flex flex-col text-center text-main">
            <h5>{t('CoachDetails.Revenue.overview.disabledRevenue.title')}</h5>
            <p>{t('CoachDetails.Revenue.overview.disabledRevenue.description')}</p>
          </div>
        ) : (
          <>
            <h4 className="inline-flex gap-x-2 text-lg text-main">
              <ComingSoon onlyLabel={true} />
              {t('CoachDetails.Revenue.overview.revenueChartTitle')}
            </h4>
            <RevenueChart />
          </>
        )}
      </div>
    </section>
  );
}
