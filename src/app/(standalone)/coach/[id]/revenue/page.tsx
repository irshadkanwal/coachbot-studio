import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { PrivateRoutes } from '@/lib/constants';
import { Assistant, AssistantStatus, SubscriptionSearchQuery } from '@/lib/models/assistant.models';
import { updateAssistantMetaData } from '@/server/actions/assistantActions';
import { getAssistantData } from '@/server/db/assistantClient';
import Tabs from '@/shared/Tabs';
import { ConfigTabItem } from '../../_components/ConfigTabItem';
import AnalyticsOverview from './_components/AnalyticsOverview';
import PriceForm from './_components/PriceForm';
import Subscriptions from './_components/Subscriptions';

const getRevenueTabs = (assistant: Assistant, searchQuery: SubscriptionSearchQuery) => [
  {
    name: 'overview',
    nameKey: 'CoachDetails.Revenue.tabs.0.title',
    className: 'flex flex-col min-h-0',
    content: (
      <Suspense fallback={<p className="text-main">Loading...</p>}>
        <AnalyticsOverview assistant={assistant} searchQuery={searchQuery} />
      </Suspense>
    ),
  },
  {
    name: 'subscribers',
    nameKey: 'CoachDetails.Revenue.tabs.1.title',
    content: (
      <Suspense fallback={<p className="text-main">Loading...</p>}>
        <Subscriptions assistant={assistant} searchQuery={searchQuery} />
      </Suspense>
    ),
    className: 'flex flex-col min-h-0',
  },
];

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SubscriptionSearchQuery>;
}) {
  const [{ id }, searchQuery] = await Promise.all([params, searchParams]);
  const assistant = await getAssistantData(id, { meta: { include: { price: true } } });

  if (!id || !assistant) {
    return redirect(PrivateRoutes.dashboard);
  }

  const isPublished = assistant.status === AssistantStatus.published;
  const isMonetizationDisabled = !assistant.meta?.revenueEnabled || isPublished;

  return (
    <section className="flex min-h-0 flex-grow gap-x-10">
      <div
        className={`flex min-w-0 flex-1 flex-col gap-y-3.5 self-start ${isPublished ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ConfigTabItem
          iconClass="cbi-card-pos"
          nameKey="CoachDetails.Revenue.revenueTogler.title"
          descriptionKey="CoachDetails.Revenue.revenueTogler.description"
          checked={!!assistant.meta?.revenueEnabled}
          onToggle={async (revenueEnabled: boolean) => {
            'use server';
            await updateAssistantMetaData(assistant.id, { revenueEnabled });
          }}
        />
        <PriceForm assistant={assistant as Assistant} disabled={isMonetizationDisabled} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Tabs
          id="goal-track-tabs"
          listClassName={`bg-graphic/[14%] p-0.5 ${!assistant.meta?.revenueEnabled && 'pointer-events-none opacity-40'}`}
          tabClassName={`py-2 text-sm`}
          panelClassName="flex-col md:overflow-hidden"
          tabs={getRevenueTabs(assistant as Assistant, searchQuery)}
        />
      </div>
    </section>
  );
}
