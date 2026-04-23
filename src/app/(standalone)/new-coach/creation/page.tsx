'use client';

import { useTranslations } from 'next-intl';

import { PrivateRoutes } from '@/lib/constants';
import { Button } from '@/shared/Button';
import { Logo } from '@/shared/Logo';
import LottiePlayer from '@/shared/LottiePlayer';

export default function CreationPage() {
  const t = useTranslations();

  return (
    <div className="relative flex min-h-screen flex-col items-center gap-y-6 p-6">
      <Button
        href={PrivateRoutes.dashboard}
        variant="solid"
        color="gray"
        className="cbi-close-circle fixed right-6 top-6 aspect-square w-12 shrink-0 px-3 py-0 text-lg text-main"
      />
      <Logo className="mx-auto mb-4 h-10 w-auto" />
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-y-6">
        <LottiePlayer
          src="https://lottie.host/9a66ee8b-7aa8-482e-9980-f604846aa081/ZrIC7TpEKv.lottie"
          style={{ width: 150, height: 150 }}
        />

        <h1 className="mt-4 text-center text-2xl font-bold uppercase text-main">
          {t(`NewCoachCreation.finalCreationPage.title`)}
        </h1>
        <p className="text-center text-xl text-light-gray">{t(`NewCoachCreation.finalCreationPage.allow`)}</p>
        <p className="max-w-3xl text-center text-xl text-light-gray">
          {t(`NewCoachCreation.finalCreationPage.subtitle`)}
        </p>
        <div className="w-3xl rounded-xl bg-dark-aquamarine/10 px-3.5 py-4">
          <div className="mb-5 text-center text-lg text-main">
            🧠 While it’s being prepared, you can <span className="font-bold text-dark-aquamarine">book a call</span>{' '}
            to:
          </div>

          <ul className="mb-5 list-disc pl-5 text-light-gray">
            <li className="mb-2 text-sm">Learn more about the AI principles and context behind your CoachBot</li>
            <li className="mb-2 text-sm">Discuss refinement options for your first-draft prototype</li>
            <li className="mb-2 text-sm">Plan how to integrate it into your practice</li>
            <li className="mb-2 text-sm">Explore ways to share it with clients or peers for feedback</li>
          </ul>

          <div className="flex justify-center gap-x-4">
            <Button
              href={'https://meetings.hubspot.com/lewin-keller?uuid=8f98e269-ba3c-44db-a2ac-15a282c9c0aa'}
              target="_blank"
              variant="solid"
              color="aquamarine"
              className="w-48 border-dark-aquamarine bg-transparent"
            >
              <i className="cbi-calendar mr-2" />
              {t(`NewCoachCreation.finalCreationPage.bookACall`)}
            </Button>
            {/* <Button
              href={`${PrivateRoutes.dashboard}?status=in_progress`}
              variant="solid"
              color="light"
              className="w-48"
            >
              {t(`NewCoachCreation.finalCreationPage.finish`)}
            </Button> */}
          </div>
        </div>

        <div className="mb-5 text-center text-lg text-light-gray">
          Coaching is co-creative - and so is your CoachBot. This first version is the start of something powerful.
        </div>
      </div>
    </div>
  );
}
