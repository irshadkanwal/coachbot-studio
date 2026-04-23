import { Assistant, SubscriptionSearchQuery } from '@/lib/models/assistant.models';
import { getAssistantSubscriptions } from '@/server/actions/assistantActions';
import SubscriptionsFilterBar from './SubscriptionsFilterBar';
import SubscriptionsList from './SubscriptionsList';

export default async function Subscriptions({
  assistant,
  searchQuery,
}: {
  assistant: Assistant;
  searchQuery: SubscriptionSearchQuery;
}) {
  const subscriptions = await getAssistantSubscriptions(assistant.id, { ...searchQuery, period: undefined });

  return (
    <section className="flex min-h-0 flex-grow flex-col gap-y-3">
      <SubscriptionsFilterBar />
      <SubscriptionsList assistant={assistant} subscriptions={subscriptions} />
    </section>
  );
}
