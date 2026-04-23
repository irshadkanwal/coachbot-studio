import { useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { CoachData } from '../../_entity/coach';
import { StepI } from '../../_entity/step';
import { Field } from '../field/Field';
import StepHead from '../layout/StepHead';
import { StepsNavigation } from '../layout/StepsNavigation';
import { useNewCoachContext } from './NewCoachContext';

export interface StepProps {
  step: StepI;
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
}

export const Step: React.FC<StepProps> = ({ step, totalSteps, currentStep, onStepChange }) => {
  const { coachData, setCoachInfo, type } = useNewCoachContext();
  const t = useTranslations();

  const {
    register,
    setValue,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'all' });

  // Set initial values from coachData
  useEffect(() => {
    step?.fields?.forEach((field) => {
      const initialValue = (coachData as CoachData)?.[step.id]?.[field.id];
      if (initialValue) {
        setValue(field.id, initialValue);
      }
    });
  }, [coachData, step.id, step.fields, setValue]);

  const onSubmitHandler = useCallback(() => {
    onStepChange(currentStep + 1);
  }, [currentStep]);

  const onStepChangeHandler = useCallback(
    (stepIndex: number) => {
      if (stepIndex < currentStep) {
        onStepChange(stepIndex);
      }
    },
    [currentStep]
  );

  const childrenComponent = useMemo(() => {
    if (!step.children) {
      return undefined;
    }

    if (typeof step.children === 'function') {
      return step.children?.({ step, totalSteps, currentStep, onStepChange });
    } else {
      return step.children;
    }
  }, [step, totalSteps, currentStep, onStepChange, step.children]);

  return (
    <div className="m-auto w-5/12">
      {!!step?.fields?.length && (
        <StepHead
          type={type}
          label={step.label}
          currentStep={currentStep}
          totalSteps={totalSteps - 1}
          question={step.question}
        />
      )}

      <form id={step.id} onSubmit={handleSubmit(onSubmitHandler)}>
        {step?.fields?.map((field, index) => (
          <div key={field.id}>
            <Field
              {...field}
              {...register(
                field.id,
                field.rules || { required: field.optional ? false : t('NewCoachCreation.fields.required') }
              )}
              initialValue={(coachData as CoachData)?.[step.id]?.[field.id]}
              onChange={(value) => {
                resetField(field.id);
                setValue(field.id, value);
                setCoachInfo([step.id, field.id], value);
              }}
              error={errors?.[field.id]?.message as string}
            />

            {index !== (step?.fields?.length ?? 0) - 1 && (
              <hr className="m-auto my-8 w-3/6 border-white opacity-[0.11]" />
            )}
          </div>
        ))}

        {childrenComponent as React.ReactElement}

        {step.navigation !== false && (
          <StepsNavigation
            onStepChange={onStepChangeHandler}
            nextButtonText={step.nextButtonText}
            currentStep={currentStep}
            stepsCount={totalSteps}
          />
        )}
      </form>
    </div>
  );
};
