import { getTranslations } from 'next-intl/server';

import { CoachRoutes, PrivateRoutes } from '@/lib/constants';
import { Assistant, AssistantSubscription } from '@/lib/models/assistant.models';
import { SubscriptionStatus } from '@/lib/models/checkout.models';
import { calculateDuration, getFormatedDate } from '@/lib/utils/date.utils';
import { Button } from '@/shared/Button';
import SidebarList from '../../../_components/SidebarList';

export default async function SubscriptionsList({
  assistant,
  subscriptions,
}: {
  assistant: Assistant;
  subscriptions: AssistantSubscription[];
}) {
  const t = await getTranslations();

  return (
    <SidebarList
      data={subscriptions}
      emptyDescriptionKey="CoachDetails.Revenue.overview.emptyList.description"
      emptyTitleKey="CoachDetails.Revenue.overview.emptyList.title"
      className="bg-transparent"
    >
      {(subscription: AssistantSubscription, index: number) => (
        <li
          key={`assistant-subscriber-${index}`}
          className={
            'group flex flex-wrap items-center gap-5 rounded-xl border border-transparent p-2.5 hover:bg-white-opacity'
          }
        >
          <div className="flex min-w-56 shrink-0 flex-grow basis-1/4 flex-col justify-start gap-y-1 overflow-hidden ps-1">
            <span className={`text-nowrap break-words text-sm font-bold uppercase text-main`}>
              {subscription.userName}
            </span>
            <span className="break-words text-xs text-light-gray">{subscription.userEmail}</span>
          </div>
          <div className="flex shrink flex-grow items-center justify-between gap-x-5">
            <div className="flex flex-grow basis-2/4 items-center gap-x-2">
              <p className="flex min-w-28 shrink-0 flex-col gap-y-1 rounded-xl border border-storm-gray px-3.5 py-2.5 text-sm text-main">
                <span className="text-xs text-light-gray">
                  {t('CoachDetails.Revenue.subscriptions.subscriptionDateLabel')}
                </span>
                {getFormatedDate(subscription.created_at, 'en-US', { dateStyle: 'medium' })}
              </p>
              {subscription.status === SubscriptionStatus.canceled && !!subscription.canceled_at ? (
                <p className="flex max-w-[40%] flex-grow flex-col gap-y-1 rounded-xl border border-storm-gray/[11%] px-3.5 py-2.5 text-sm text-storm-gray">
                  <span className="text-xs">{t('CoachDetails.Revenue.subscriptions.subscriptionCanceledLabel')}</span>
                  {getFormatedDate(subscription.canceled_at, 'en-US', { dateStyle: 'medium' })}
                </p>
              ) : (
                <p className="flex max-w-[30%] flex-grow flex-col gap-y-1 rounded-xl border border-blue/[11%] px-3.5 py-2.5 text-sm text-blue">
                  <span className="text-xs">{t('CoachDetails.Revenue.subscriptions.subscriptionDurationLabel')}</span>
                  {calculateDuration(subscription.created_at)}
                </p>
              )}
              <p
                className={`flex min-w-20 shrink-0 flex-col gap-y-1 rounded-xl border border-dark-aquamarine/[11%] px-3.5 py-2.5 text-sm font-bold capitalize text-dark-aquamarine ${subscription.interval === 'year' && 'border-transparent bg-dark-aquamarine/[11%]'}`}
              >
                <span className="text-xs font-medium">{t('CoachDetails.Revenue.subscriptions.planLabel')}</span>
                {t.has(`CoachDetails.Revenue.subscriptions.planInterval.${subscription.interval}`)
                  ? t(`CoachDetails.Revenue.subscriptions.planInterval.${subscription.interval}`)
                  : 'X'}
              </p>
            </div>

            <Button
              href={`${PrivateRoutes.coach}/${assistant.id}${CoachRoutes.users}/${subscription.userId}`}
              className="ml-auto h-fit w-max shrink text-nowrap rounded-xl border border-main/[6%] px-2.5 py-1 text-sm text-storm-gray hover:bg-white-opacity hover:!text-main group-hover:border-storm-gray group-hover:text-light-gray"
            >
              {t('CoachDetails.Revenue.subscriptions.userDetailsLabel')}
            </Button>
          </div>
        </li>
      )}
    </SidebarList>
  );
}
