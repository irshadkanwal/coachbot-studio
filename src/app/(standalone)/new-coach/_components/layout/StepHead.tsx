import React from 'react';
import { useTranslations } from 'next-intl';

import { StepConfigType } from '../steps/config';
import { StepsProgressSmall } from './StepsProgessSmall';

interface StepHeadProps {
  currentStep: number;
  totalSteps: number;
  label: string;
  question: string;
  type?: StepConfigType;
}

export const StepHead: React.FC<StepHeadProps> = ({
  currentStep,
  totalSteps,
  label,
  question,
  type = StepConfigType.NewCoach,
}) => {
  const t = useTranslations();

  return (
    <div className="flex w-full flex-col items-center gap-y-4">
      <p className="mt-3 text-center text-base text-light-gray">
        {type === StepConfigType.NewCoach ? t('NewCoachCreation.title') : t('NewCoachCreation.editTitle')}
      </p>

      <h1 className="text-xl font-bold text-dark-aquamarine">{t(label)}</h1>

      <div className="my-0 w-full max-w-2xl border-b border-light-gray/30" />

      <StepsProgressSmall totalSteps={totalSteps} currentStep={currentStep} />

      <p className="my-10 text-center text-lg text-main">{t.rich(question, { br: () => <br /> })}</p>
    </div>
  );
};

export default StepHead;
