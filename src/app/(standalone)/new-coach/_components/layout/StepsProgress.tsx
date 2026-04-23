'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { twJoin } from 'tailwind-merge';

interface Step {
  id: string;
  label: string;
}

type StepsProgressProps = {
  steps: Step[];
  currentStep: number;
};

export const StepsProgress: React.FC<StepsProgressProps> = ({ steps, currentStep }) => {
  const t = useTranslations();

  return (
    <div className="flex h-full w-44 flex-col items-center justify-around py-24">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div>
            <div
              className={twJoin('rounded-lg px-3 py-2 text-center', [index === currentStep && 'bg-dark-aquamarine/10'])}
            >
              <div
                className={twJoin('leading-[1.2]', [
                  index === currentStep ? 'text-dark-aquamarine' : 'text-gray-500',
                  index < currentStep ? 'opacity-[0.32]' : 'opacity-100',
                ])}
              >
                {t(step.label)}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={twJoin(
                'my-3.5 flex-grow border-r',
                index === currentStep - 1 ? 'border-dark-aquamarine' : 'border-gray-500',
                index < currentStep - 1 ? 'opacity-[0.32]' : 'opacity-100'
              )}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepsProgress;
