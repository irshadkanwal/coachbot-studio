import { useTranslations } from 'next-intl';

import { Assistant, AssistantStatus, Visibility } from '@/lib/models/assistant.models';
import { CopyToClipboardButton } from '@/shared/FunctionalButtons';
import { Input } from '@/shared/Input';

export default function MarketplaceListing({ assistant }: { assistant: Assistant }) {
  const t = useTranslations();
  const isPrivate = assistant.meta?.visibility === Visibility.private;
  const isPublished = assistant.status === AssistantStatus.published;
  const canShare = isPublished;

  return (
    <div className="flex flex-grow flex-col gap-y-6">
      <h5
        className={`inline-flex items-center justify-center gap-x-2 text-center text-2xl font-bold uppercase leading-3 ${isPrivate ? 'text-main' : 'text-light-gray'}`}
      >
        <span className={`${isPrivate ? 'cbi-lock' : 'cbi-lock-slash'} text-3xl leading-3`}>
          {!isPrivate &&
            Array.from({ length: 3 }).map((_: any, i: number) => <span key={i} className={`path${i + 1}`}></span>)}
        </span>
        {t(
          isPrivate ? 'CoachDetails.Config.MarketplacePage.titlePrivate' : 'CoachDetails.Config.MarketplacePage.title'
        )}
      </h5>
      <p className="text-center text-light-gray">{t('CoachDetails.Config.MarketplacePage.description')}</p>
      <div
        className={`flex flex-col gap-y-6 rounded-2xl border bg-white-opacity px-3.5 py-6 ${isPrivate ? 'border-dark-aquamarine' : 'border-background-border/[11%]'}`}
      >
        <p className="text-center font-semibold text-main">{t('CoachDetails.Config.MarketplacePage.shareTitle')}</p>
        <div className="flex gap-x-1">
          <Input
            id={'share-link-input'}
            readOnly={true}
            placeholder={`${process.env.SHARE_LINK || 'https://coachbot.ai/chat'}?cbsas=${assistant.id}`}
            className="flex-grow"
            inputClassName={`text-light-gray py-1.5 text-ellipsis animate-none ${canShare ? 'border-main' : ' opacity-50'}`}
            disabled={!canShare}
          />
          <CopyToClipboardButton
            searchParams={`cbsas=${assistant.id}`}
            tooltipKey={'General.shareLinkSuccess'}
            titileKey="CoachDetails.Config.MarketplacePage.copyButton"
            icon="cbi-copy"
            variant={'solid'}
            color={'light'}
            className="px-5 py-2 text-background disabled:border-storm-gray disabled:bg-transparent disabled:text-storm-gray disabled:opacity-75"
            disabled={!canShare}
          />
        </div>
      </div>
    </div>
  );
}
