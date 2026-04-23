'use client';

import { use, useActionState, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { useRootContext } from '@/contexts/RootContextProvider';
import { HeapTrackEvent } from '@/lib/models/analytic.models';
import { AssistantConfiguration } from '@/lib/models/assistant.models';
import { State } from '@/lib/models/common.models';
import { heapAnalytics } from '@/lib/services/HeapAnalytics';
import { updateConfigInstructions } from '@/server/actions/instructionsActions';
import CollapsiblePanel from '@/shared/CollapsiblePanel';
import InstructionInput from '@/shared/InstructionInput';

interface SystemInstructionsProps {
  className?: string;
  assistantConfig$: Promise<AssistantConfiguration | null>;
}

export interface AssistantState {
  instructions: string | null;
  onboarding?: string | null;
}

export default function SystemInstructions({ className, assistantConfig$ }: SystemInstructionsProps) {
  const t = useTranslations();
  const { instructions = '', onboarding = '' } = use(assistantConfig$) || ({} as AssistantConfiguration);
  const [initialValue, setInitialValue] = useState<AssistantState>({ instructions, onboarding });
  const { selectedAssistant } = useRootContext();

  const handleSave = useCallback(async (formData: FormData) => {
    heapAnalytics.trackEvent(HeapTrackEvent.save_main_instruction);
    const result = await updateConfigInstructions(formData);
    result.value && setInitialValue(result.value);

    return result;
  }, []);

  const handleAutoSave = useCallback(async (value: string, key: string) => {
    const formData = new FormData();
    formData.append(key, value);

    await handleSave(formData);
  }, []);

  const [state, saveAction, isPending] = useActionState<State<AssistantState>, any>(
    async (_: State<AssistantState>, formData: FormData) => handleSave(formData),
    { value: initialValue }
  );

  useEffect(() => setInitialValue({ instructions, onboarding }), [instructions, onboarding]);

  return (
    <div className={twMerge('flex flex-grow flex-col', className)}>
      <form action={saveAction} className="flex flex-grow flex-col gap-y-5">
        <CollapsiblePanel
          title={t('Instructions.systemInstruction.label')}
          subTitle={t('Instructions.systemInstruction.tooltip')}
          toggleText={true}
          toggleClass="bg-white/[50%] border border-white/[6%] rounded-xl p-3 rotate-0 group-data-[open]:rotate-180"
          className="border-0 bg-light-gray/[18%] py-4 ps-5 text-sm text-light-gray data-[open]:bg-white/[8%] data-[open]:text-main"
          titleClass="uppercase font-bold"
          contentClassName="border-0 bg-white/[8%] p-3 data-[open]:pt-0"
        >
          <InstructionInput
            disabled={!selectedAssistant?.id}
            name="instructions"
            isLoading={isPending}
            className={'min-h-[45svh] shrink-0 flex-grow'}
            id="system-instructions-input"
            initialValue={initialValue.instructions || ''}
            onBlur={(value: string) => handleAutoSave(value, 'instructions')}
          />
        </CollapsiblePanel>
        <CollapsiblePanel
          title={t('Instructions.onboardingInstruction.label')}
          subTitle={t('Instructions.onboardingInstruction.tooltip')}
          toggleText={true}
          toggleClass="bg-white/[50%] border border-white/[6%] rounded-xl p-3 rotate-0 group-data-[open]:rotate-180"
          className="border-0 bg-light-gray/[18%] py-4 ps-5 text-sm text-light-gray data-[open]:bg-white/[8%] data-[open]:text-main"
          titleClass="uppercase font-bold"
          contentClassName="border-0 bg-white/[8%] p-3 data-[open]:pt-0"
        >
          <InstructionInput
            disabled={!selectedAssistant?.id}
            name="onboarding"
            isLoading={isPending}
            className={'min-h-[45svh] shrink-0 flex-grow'}
            id="onboarding-instructions-input"
            initialValue={initialValue.onboarding || ''}
            onBlur={(value: string) => handleAutoSave(value, 'onboarding')}
          />
        </CollapsiblePanel>
      </form>

      {state?.error && <p className="mt-2 text-sm text-salmon">{t(state.error)}</p>}
      {state?.successMessage && <p className="mt-2 text-green-600">{t(state.successMessage)}</p>}
    </div>
  );
}
