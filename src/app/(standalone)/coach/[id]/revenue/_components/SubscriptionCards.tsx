import { getTranslations } from 'next-intl/server';
import { twMerge } from 'tailwind-merge';

import { Assistant, AssistantSubscription } from '@/lib/models/assistant.models';
import { Currency } from '@/lib/models/checkout.models';
import { getDateDay } from '@/lib/utils/date.utils';
import { formatPrice } from '@/lib/utils/price.utils';
import ComingSoon from '@/shared/CoomingSoon';

const getAnalyticCards = (assistant: Assistant, subscriptions: AssistantSubscription[], t: any) => {
  const latestSubscription = subscriptions[0];
  const isEnabled = assistant.meta?.revenueEnabled;

  return [
    {
      id: 0,
      inDevelopment: true,
      iconClassName: 'cbi-card-pos border-dark-aquamarine',
      titleKey: 'CoachDetails.Revenue.overview.cards.0',
      className: 'bg-dark-aquamarine/[11%] text-dark-aquamarine',
      content:
        !!assistant.meta?.price?.amount && isEnabled ? (
          <p>{formatPrice(assistant.meta?.price)}</p>
        ) : (
          <p>
            {Currency.eur}
            <span className="text-dark-aquamarine/[30%]">X</span>
          </p>
        ),
    },
    {
      id: 1,
      iconClassName: 'cbi-people',
      titleKey: 'CoachDetails.Revenue.overview.cards.1',
      content:
        !!subscriptions.length && isEnabled ? (
          <span className="text-main">{subscriptions.length}</span>
        ) : (
          <span className="text-storm-gray">X</span>
        ),
    },
    {
      id: 2,
      iconClassName: 'cbi-user',
      titleKey: 'CoachDetails.Revenue.overview.cards.2',
      className: 'shrink',
      contentClassName: `border border-storm-gray text-sm text-main ${!!latestSubscription ? '' : 'opacity-50'}`,
      content: (
        <>
          <p className="text-center font-bold uppercase">{(isEnabled && latestSubscription?.userName) || 'X'}</p>
          <span className="mb-1 text-xs text-light-gray">{(isEnabled && latestSubscription?.userEmail) || 'X'}</span>
          <span className="text-center">
            {latestSubscription?.created_at && isEnabled ? (
              <>
                {t('CoachDetails.Revenue.overview.joinedLabel')}&nbsp;
                {getDateDay(latestSubscription?.created_at)}
              </>
            ) : (
              'X'
            )}
          </span>
        </>
      ),
    },
  ];
};

export default async function SubscriptionCards({
  assistant,
  subscriptions,
}: {
  assistant: Assistant;
  subscriptions: AssistantSubscription[];
}) {
  const t = await getTranslations();

  return (
    <div className="flex justify-between gap-x-1 p-3.5">
      {getAnalyticCards(assistant, subscriptions, t).map((card: any, index: number) => (
        <div
          key={`analytics-card-${index}`}
          className={twMerge(
            'relative flex min-w-0 flex-1 flex-col items-center justify-between gap-y-3.5 rounded-xl bg-graphic/[14%] p-3.5 text-main',
            card.className
          )}
        >
          {card.inDevelopment && <ComingSoon onlyLabel={true} className="absolute bottom-0 mx-auto" />}
          <p className="flex flex-col items-center justify-center gap-y-1">
            <span className={twMerge('aspect-square rounded-xl border border-main text-2xl', card.iconClassName)} />
            <span className="text-center text-base">{t(card.titleKey)}</span>
          </p>
          <div
            className={twMerge(
              'flex w-full flex-grow flex-col items-center justify-center rounded-xl px-3.5 py-2.5 text-3xl',
              card.contentClassName
            )}
          >
            {card.content}
          </div>
        </div>
      ))}
    </div>
  );
}
