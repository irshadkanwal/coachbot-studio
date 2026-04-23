import { memo } from 'react';
import { useTranslations } from 'next-intl';
import type { CardComponentProps } from 'nextstepjs';
import ReactDOM from 'react-dom';

import { Button } from '../Button';
import { Logo } from '../Logo';

export const OnboardingCardComponent = memo(function OnboardingCardComponent({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
}: CardComponentProps) {
  const t = useTranslations();
  const { icon, title, content } = step;

  return (
    <div className="fixed left-1/2 top-1/2 z-[999] flex h-fit min-h-[50-dvh] w-[50dvw] max-w-6xl flex-grow -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-start gap-y-3 rounded-xl border border-main bg-gunmetal p-6 transition-all duration-300 ease-in-out">
      <Button
        type="button"
        onClick={skipTour}
        className={
          'cbi-close absolute right-3 top-2 cursor-pointer p-0 text-lg text-light-gray outline-none hover:text-main'
        }
      />
      <Logo className="xl:h-10" />
      <div className="flex items-center justify-center gap-x-1.5">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <span
            key={`onboarding-progress-step-${index}`}
            className={`size-2 rounded-full ${currentStep === index ? 'bg-dark-aquamarine' : 'bg-storm-gray'}`}
          />
        ))}
        <span className="ms-1 text-main">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>
      <section className="flex w-full flex-grow flex-col items-center gap-y-1 py-3">
        <h3 className="text-xl font-bold uppercase text-main">
          {icon}&nbsp;{title}
        </h3>
        {content}
      </section>

      <div className="flex gap-x-1">
        {currentStep !== 0 && (
          <Button
            onClick={prevStep}
            className={`cbi-arrow-left aspect-square border-background-border/[18%] bg-graphic/[14%] px-3 text-xl text-light-gray hover:border-main hover:bg-transparent hover:text-main`}
            variant="outline"
            color="darkGray"
          />
        )}

        {currentStep === totalSteps - 1 ? (
          <Button onClick={nextStep} variant="solid" color="primary" className="min-w-40 text-white">
            <i className="cbi-tick-circle-fill text-xl" />
            {t('Common.letsStartButton')}
          </Button>
        ) : (
          <Button onClick={nextStep} variant="solid" color="light" className="min-w-40 text-background">
            <i className="cbi-arrow-right text-xl" />
            {t('Common.nextButton')}
          </Button>
        )}
      </div>
    </div>
  );
});

export const OnboardingCard = (props: CardComponentProps) => {
  return typeof window === 'undefined'
    ? null
    : ReactDOM.createPortal(<OnboardingCardComponent {...props} />, document.body);
};
