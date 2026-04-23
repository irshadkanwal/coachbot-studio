import { useTranslations } from 'next-intl';

import { Assistant } from '@/lib/models/assistant.models';
import { Logo } from '@/shared/Logo';

export default function Integration({ assistant }: { assistant: Assistant }) {
  const t = useTranslations();
  const isWhatsappOn = !!assistant.meta?.whatsapp;

  return (
    <div className="flex flex-grow flex-col gap-y-6">
      <h5
        className={`inline-flex items-center justify-center gap-x-2 text-center text-2xl font-bold uppercase leading-3 ${isWhatsappOn ? 'text-main' : 'text-light-gray'}`}
      >
        <span className={`${isWhatsappOn ? 'cbi-tick-circle' : 'cbi-close-circle'} text-3xl leading-3`} />
        {t(
          isWhatsappOn
            ? 'CoachDetails.Config.IntegrationPage.connectedTitle'
            : 'CoachDetails.Config.IntegrationPage.notConnectedTitle'
        )}
      </h5>
      <p className="text-center text-light-gray">
        {t(
          isWhatsappOn
            ? 'CoachDetails.Config.IntegrationPage.connectedDescription'
            : 'CoachDetails.Config.IntegrationPage.notConnectedDescription'
        )}
      </p>
      <div
        className={`flex flex-col gap-y-6 rounded-2xl border bg-white-opacity px-3.5 py-6 ${isWhatsappOn ? 'border-dark-aquamarine' : 'border-background-border/[11%]'}`}
      >
        <p className="text-center text-sm font-medium text-main">
          {t('CoachDetails.Config.IntegrationPage.whatsappDescription')}
        </p>
        <div className={`flex items-center justify-center gap-x-5 py-7 ${!isWhatsappOn && 'opacity-35'}`}>
          <Logo className="pointer-events-none w-1/3 xl:h-[3.25rem]" />
          <span className="inline-flex flex-col items-center justify-center gap-y-0 !text-xl text-light-gray">
            <span className="cbi-arrow-right -mb-1"></span>
            <span className="cbi-arrow-left"></span>
          </span>
          <div className="flex w-1/3 items-center justify-center">
            <span className="cbi-whatsapp text-[5rem]">
              {Array.from({ length: 4 }).map((_: any, i: number) => (
                <span key={i} className={`path${i + 1}`}></span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
