import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { ConfigTab } from '@/app/(standalone)/coach/[id]/page';
import { CoachRoutes, PrivateRoutes } from '@/lib/constants';
import {
  Assistant,
  AssistantAccessMode,
  AssistantFeedback,
  AssistantMeta,
  AssistantStatus,
  Visibility,
} from '@/lib/models/assistant.models';
import { User } from '@/lib/models/common.models';
import { getFormatedDate } from '@/lib/utils/date.utils';
import { formatPrice } from '@/lib/utils/price.utils';
import { Button } from '@/shared/Button';
import { Chip } from '@/shared/Chip';
import { CopyToClipboardButton } from '@/shared/FunctionalButtons';
import { ModalButton } from '@/shared/ModalButtons';
import AssistantMenu from './AssistantMenu';
import ShareModalContent from './ShareModal';
import { AssistantStatisticCard } from './StatisticCards';

const getAssistantInfoCards = (assistant: Assistant, isVisible?: boolean) => {
  const { meta, accessMode, feedbacks = [] } = assistant;
  const { price, visibility, users, conversations, revenueEnabled } = meta || ({} as AssistantMeta);

  const isFullAccess = accessMode === AssistantAccessMode.fullAccess;
  const isHighLevel = accessMode === AssistantAccessMode.highLevel;

  return [
    {
      icon: 'cbi-user',
      titleKey: 'Dashboard.assistantCard.data.1',
      value: users,
      href: isFullAccess || isHighLevel ? CoachRoutes.users : null,
      tooltipKey: !isFullAccess && !isHighLevel ? 'Dashboard.assistantCard.privacyTooltip' : undefined,
    },
    {
      icon: 'cbi-message-text',
      titleKey: 'Dashboard.assistantCard.data.0',
      value: conversations || 0,
      href: isFullAccess ? CoachRoutes.conversations : null,
      className: 'text-blue bg-blue/[11%] hover:border-blue',
      tooltipKey: !isFullAccess ? 'Dashboard.assistantCard.privacyTooltip' : undefined,
    },
    {
      icon: 'cbi-star',
      titleKey: 'Dashboard.assistantCard.data.2',
      className: 'bg-yellow/[11%] text-yellow hover:border-yellow',
      value: feedbacks?.reduce((total: number, { rating }: AssistantFeedback) => total + rating, 0).toFixed(1),
      titleValue: feedbacks?.length > 0 ? `(${feedbacks.length})` : '',
      titleValueClass: 'text-yellow text-xl leading-6',
      isVisible: false && visibility === Visibility.public,
      href: CoachRoutes.ratings,
    },
    {
      icon: 'cbi-receipt',
      titleKey: 'Dashboard.assistantCard.data.3',
      className: 'bg-dark-aquamarine/[11%] text-dark-aquamarine hover:border-dark-aquamarine',
      value: formatPrice(price),
      isVisible: isVisible && !!revenueEnabled,
      href: CoachRoutes.revenue,
    },
  ];
};

const chipVariant: Record<AssistantStatus, any> = {
  [AssistantStatus.published]: 'aquamarine',
  [AssistantStatus.draft]: 'white',
  [AssistantStatus.archived]: 'gray',
  [AssistantStatus.inProgress]: 'blue',
};

export default function AssistantCard({
  assistant,
  isAllowedUser,
  user,
  assistants,
}: {
  assistant: Assistant;
  isAllowedUser?: boolean;
  user: User | null;
  assistants: Assistant[];
}) {
  const t = useTranslations();
  const locale = useLocale();
  const configPath = `${PrivateRoutes.coach}/${assistant.id}`;

  if (assistant.status === AssistantStatus.inProgress) {
    return (
      <section className="flex min-w-0 flex-col gap-y-4 rounded-3xl border border-graphic/[6%] bg-white-opacity p-3.5 hover:border-main">
        <div className="flex items-center justify-between gap-x-2 border-b border-storm-gray pb-3.5">
          <div className="flex items-center justify-start gap-x-2">
            {assistant.status && (
              <Chip
                size="md"
                variant={chipVariant[assistant.status as AssistantStatus]}
                text={assistant.status.replaceAll('_', ' ')}
                textClassName="capitalize"
              />
            )}
            <Chip
              size="md"
              variant="graphic"
              textClassName="border border-transparent hover:border-graphic"
              text={t('Dashboard.assistantCard.transcriptSharingLabel')}
            >
              <span className="ms-1 font-bold capitalize text-main">{assistant.accessMode?.replaceAll('_', ' ')}</span>
            </Chip>
          </div>
          <AssistantMenu assistant={assistant} user={user} assistants={assistants} />
        </div>
        <div className="flex flex-col gap-y-1 ps-3">
          <h3 className="inline-flex items-center gap-x-2 text-[2.125rem] font-medium text-main">{assistant.name}</h3>
          <p className="text-sm text-main">{assistant.description}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-w-0 flex-col gap-y-4 rounded-3xl border border-graphic/[6%] bg-white-opacity p-3.5 hover:border-main">
      <div className="flex items-center justify-between gap-x-10">
        <div className="flex items-center justify-start gap-x-2">
          {assistant.status && (
            <Chip
              size="md"
              variant={chipVariant[assistant.status as AssistantStatus]}
              text={assistant.status === AssistantStatus.published ? 'Live' : assistant.status}
              textClassName="capitalize"
            />
          )}
          <Link href={`${configPath}?tab=${ConfigTab.transcript}`}>
            <Chip
              size="md"
              variant="graphic"
              textClassName="border border-transparent hover:border-graphic"
              text={t('Dashboard.assistantCard.transcriptSharingLabel')}
            >
              <span className="ms-1 font-bold capitalize text-main">{assistant.accessMode?.replaceAll('_', ' ')}</span>
            </Chip>
          </Link>
        </div>
        <div className="flex gap-x-1 self-end">
          <Button
            className="cbi-config aspect-square rounded-md border-graphic/[14%] px-3 py-1.5 text-light-gray hover:border-main data-[hover]:text-main"
            href={`${PrivateRoutes.coach}/${assistant.id}`}
          />
          <AssistantMenu assistant={assistant} user={user} assistants={assistants} />
          <ModalButton
            config={{
              variant: 'white',
              titleKey: 'Common.shareModal.title',
              titleIcon: 'cbi-share text-background !text-sm bg-main rounded-md px-0.5',
              titleClass: 'text-main justify-center items-cenetr text-center',
              className: 'min-w-[40dvw]',
            }}
            className="cbi-share aspect-square border-graphic/[6%] p-1 px-3 text-light-gray hover:border-main hover:text-main"
            disabled={assistant.status !== AssistantStatus.published}
          >
            <ShareModalContent id={assistant.id} />
          </ModalButton>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-x-4 border-b border-storm-gray pb-3.5">
        {/* <Link href={`${configPath}?tab=${ConfigTab.marketplace}`}>
        <Chip
          size="md"
          variant="transparent"
          textClassName="rounded-lg border-yellow text-light-gray"
          text={t('Dashboard.assistantCard.visibilityLabel')}
        >
          <span className="ms-1 font-bold capitalize text-main">{assistant.meta?.visibility}</span>
        </Chip>
        </Link> */}

        <CopyToClipboardButton
          icon="hidden"
          className="ms-1 h-fit rounded-xl bg-yellow/[30%] px-3.5 py-1.5 text-main"
          searchParams={`cbsas=${assistant.id}`}
          tooltipKey={'General.shareLinkSuccess'}
          titileKey="Dashboard.assistantCard.configPanel.copyLinkButton"
          disabled={assistant.status !== AssistantStatus.published}
        />
        {/* <Link href={`${configPath}?tab=${ConfigTab.monetization}`}>
        <Chip
          size="md"
          variant="transparent"
          text={t('Dashboard.assistantCard.accessLevelLabel')}
          textClassName="rounded-lg border-dark-aquamarine text-light-gray"
        >
          <span className="ms-1 font-bold capitalize text-main">{assistant.meta?.accessLevel}</span>
        </Chip>
         </Link> */}
        <div className="ms-auto text-light-gray">
          {t('Dashboard.assistantCard.lastUpdatedLabel')} &nbsp;
          <span className="text-main">
            {getFormatedDate(assistant.updated_at || assistant.created_at || new Date(), locale, { dateStyle: 'long' })}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-y-1 ps-3">
        <h3 className="inline-flex items-center gap-x-2 text-[2.125rem] font-medium text-main">
          {assistant.name}
          {assistant.status === AssistantStatus.draft && (
            <Button
              className="cbi-edit-2 aspect-square border-storm-gray p-1 px-2 text-light-gray hover:border-main hover:text-main"
              href={`/create-agent?id=${assistant.id}`}
            />
          )}
        </h3>
      </div>

      <div className="flex gap-x-1">
        {getAssistantInfoCards(assistant, isAllowedUser).map((data, index) => (
          <AssistantStatisticCard key={`assistant-card-${index}`} basePath={configPath} {...data} />
        ))}
      </div>
    </section>
  );
}
