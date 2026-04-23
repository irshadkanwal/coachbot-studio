import { useTranslations } from 'next-intl';

// import { Facebook, Instagram, LinkedIn, TikTok, X } from 'public/images/socials';

import { CopyToClipboardButton } from '@/shared/FunctionalButtons';
import { Input } from '@/shared/Input';

// const socialItems = [
//   { icon: LinkedIn, title: 'LinkedIn' },
//   { icon: X, title: 'X' },
//   { icon: Facebook, title: 'Facebook' },
//   { icon: Instagram, title: 'Instagram' },
//   { icon: TikTok, title: 'TikTok' },
// ];

export default function ShareModalContent({ id }: { id: string }) {
  const t = useTranslations();
  // const sharableLink = process.env.SHARE_LINK || 'https://coachbot.ai/chat';

  return (
    <div className="w-2xl min-w-3xl flex flex-col gap-y-6">
      <h4 className="text-center text-base text-main">{t('Common.shareModal.subTitle')}</h4>
      {/* <div className="flex items-center justify-center gap-x-12 rounded-lg bg-graphic/[14%] px-16 py-5">
        {socialItems.map(({ icon, title }, index) => (
          <Link
            key={`social-${index}`}
            prefetch={false}
            href="/"
            className="flex shrink-0 flex-col items-center justify-center gap-y-5 text-light-gray hover:text-main"
          >
            <Image src={icon} alt={title} className={'h-full w-auto'} priority={true} width={64} height={64} />
            {title}
          </Link>
        ))}
      </div> */}

      <div className="flex gap-x-1">
        <Input
          id={'share-link-input'}
          readOnly={true}
          placeholder={`${process.env.SHARE_LINK || 'https://coachbot.ai/chat'}?cbsas=${id}`}
          className="flex-grow"
          inputClassName="text-light-gray py-1.5 text-ellipsis"
        />
        <CopyToClipboardButton
          searchParams={`cbsas=${id}`}
          tooltipKey={'General.shareLinkSuccess'}
          titileKey="Dashboard.assistantCard.configPanel.copyLinkButton"
          icon="cbi-copy"
          variant={'solid'}
          color={'light'}
          className="px-5 py-2 text-background"
        />
      </div>
    </div>
  );
}
