import { useTranslations } from 'next-intl';

import { Assistant } from '@/lib/models/assistant.models';
import { Logo } from '@/shared/Logo';

export default function SMSIntegration({ assistant }: { assistant: Assistant }) {
  const t = useTranslations();
  const isSMSConnected = !!assistant.meta?.sms;

  return (
    <div className="flex flex-grow flex-col gap-y-6">
      <h5
        className={`inline-flex items-center justify-center gap-x-2 text-center text-2xl font-bold uppercase leading-3 ${isSMSConnected ? 'text-main' : 'text-light-gray'}`}
      >
        <span className={`${isSMSConnected ? 'cbi-tick-circle' : 'cbi-close-circle'} text-3xl leading-3`} />
        {t(
          isSMSConnected
            ? 'CoachDetails.Config.SMSIntegrationPage.connectedTitle'
            : 'CoachDetails.Config.SMSIntegrationPage.notConnectedTitle'
        )}
      </h5>
      <p className="text-center text-light-gray">
        {t(
          isSMSConnected
            ? 'CoachDetails.Config.SMSIntegrationPage.connectedDescription'
            : 'CoachDetails.Config.SMSIntegrationPage.notConnectedDescription'
        )}
      </p>
      <div
        className={`flex flex-col gap-y-6 rounded-2xl border bg-white-opacity px-3.5 py-6 ${isSMSConnected ? 'border-dark-aquamarine' : 'border-background-border/[11%]'}`}
      >
        <div className={`flex items-center justify-center gap-x-5 py-7 ${!isSMSConnected && 'opacity-35'}`}>
          <Logo className="pointer-events-none w-1/3 xl:h-[3.25rem]" />
          <span className="inline-flex flex-col items-center justify-center gap-y-0 !text-xl text-light-gray">
            <span className="cbi-arrow-right -mb-1"></span>
            <span className="cbi-arrow-left"></span>
          </span>
          <div className="flex w-1/3 items-center justify-center">
            <span className="cbi-message-text text-[5rem] text-main">
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
