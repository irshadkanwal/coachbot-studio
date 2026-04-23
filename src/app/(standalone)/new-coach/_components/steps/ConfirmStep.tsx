'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { PrivateRoutes } from '@/lib/constants';
import { AssistantAccessMode, AssistantStatus } from '@/lib/models/assistant.models';
import { createCoachAssistant, updateAssistant } from '@/server/actions/assistantActions';
import { upsertCoachAction } from '@/server/actions/coachActions';
import { CoachData } from '../../_entity/coach';
import { Field } from '../field/Field';
import { StepsNavigation } from '../layout/StepsNavigation';
import { FieldsIDs, getStepsConfig, StepConfigType, StepSlug } from './config';
import { useNewCoachContext } from './NewCoachContext';
import { StepProps } from './Step';

interface ConfirmStepProps extends StepProps {
  type: StepConfigType;
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({ step, totalSteps, currentStep, onStepChange, type }) => {
  const router = useRouter();
  const t = useTranslations();
  const { coachData, coachID, setCoachInfo } = useNewCoachContext();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const createCoach = async () => {
    try {
      setError('');
      setSubmitting(true);

      const coachDataResponse = await upsertCoachAction(coachData);
      await createCoachAssistant(
        {
          name: coachDataResponse.name,
          description: coachDataResponse.description,
          status: AssistantStatus.inProgress,
          accessMode: (coachDataResponse.assessment as CoachData)?.[StepSlug.CoachbotProfile]?.[
            FieldsIDs.ProfileDataSharing
          ] as AssistantAccessMode,
        },
        coachDataResponse.id
      );

      return coachDataResponse;
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  const editCoach = async () => {
    try {
      setError('');
      setSubmitting(true);

      if (!coachID) {
        throw new Error('Coach ID is required');
      }

      const coachDataResponse = await upsertCoachAction(coachData, coachID);
      await updateAssistant(coachID, {
        name: coachDataResponse.name,
        description: coachDataResponse.description,
        accessMode: (coachDataResponse.assessment as CoachData)?.[StepSlug.CoachbotProfile]?.[
          FieldsIDs.ProfileDataSharing
        ] as AssistantAccessMode,
      });

      return coachDataResponse;
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  const onConfirm = () => {
    if (coachID) {
      editCoach().then(() => router.push(`${PrivateRoutes.dashboard}?status=in_progress`));
    } else {
      createCoach().then(() => router.push(PrivateRoutes.newCoachCreation));
    }
  };

  const handleOnStepChange = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      onStepChange(stepIndex);
    } else {
      onConfirm();
    }
  };

  const stepsToSummary = useMemo(() => {
    return getStepsConfig(type).filter(
      (step) => ![StepSlug.ReviewCreate, StepSlug.ReviewEdit].includes(step.id as StepSlug)
    );
  }, [type]);

  return (
    <div className="flex w-full flex-col items-center gap-y-4">
      <h1 className="text-center text-xl font-bold uppercase text-main">
        {t('NewCoachCreation.steps.review-create.confirm_details')}
      </h1>

      <div className="my-0 w-full max-w-2xl border-b border-dark-aquamarine" />

      {stepsToSummary.map((step) => {
        return (
          <div key={step.id} className="mb-10 w-full">
            <h3 className="mb-8 text-center font-bold uppercase text-dark-aquamarine">{t(step.label)}</h3>
            {step?.fields?.map((field, index) => {
              return (
                <div key={field.id}>
                  {field.label && <div className="mb-5 text-center text-lg text-main">{t(field.label)}</div>}
                  <Field
                    id={field.id}
                    type={field.type}
                    initialValue={(coachData as CoachData)?.[step.id]?.[field.id]}
                    onChange={(value) => setCoachInfo([step.id, field.id], value)}
                  />
                  {index !== (step?.fields?.length ?? 0) - 1 && (
                    <hr className="m-auto my-8 w-3/6 border-white opacity-[0.11]" />
                  )}
                </div>
              );
            })}
            <hr className="m-auto mt-4 border-gray-500" />
          </div>
        );
      })}

      {error && <div className="text-center text-red-500">{error}</div>}

      <StepsNavigation
        loading={submitting}
        onStepChange={handleOnStepChange}
        nextButtonText={step?.nextButtonText}
        currentStep={currentStep}
        stepsCount={totalSteps}
      />
    </div>
  );
};
