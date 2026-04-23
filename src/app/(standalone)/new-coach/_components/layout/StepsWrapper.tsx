'use client';

import React, { useMemo } from 'react';

import { StepsProgress } from '@/app/(standalone)/new-coach/_components/layout/StepsProgress';
import { getStepsConfig, StepConfigType } from '../steps/config';
import { Step } from '../steps/Step';
import { StepsHeader } from './StepsHeader';

interface StepsWrapperProps {
  type?: StepConfigType;
}

const StepsWrapper: React.FC<StepsWrapperProps> = ({ type }) => {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const onStepChange = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
    document.body.scrollTo(0, 0);
  };

  const steps = useMemo(() => {
    return getStepsConfig(type);
  }, [type]);

  const currentStep = useMemo(() => {
    return steps[currentStepIndex];
  }, [currentStepIndex, steps]);

  return (
    <div className="relative h-full">
      {currentStep?.progressBar !== false && (
        <div className="fixed bottom-0 left-0 top-0 px-4">
          <StepsProgress steps={steps} currentStep={currentStepIndex} />
        </div>
      )}

      <StepsHeader />

      <Step step={currentStep} currentStep={currentStepIndex} totalSteps={steps.length} onStepChange={onStepChange} />
    </div>
  );
};

export default StepsWrapper;
