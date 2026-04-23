import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { Assistant, AssistantAccessMode } from '@/lib/models/assistant.models';
import { updateAssistant } from '@/server/actions/assistantActions';
import { RadioGroup } from '@/shared/RadioGroup';

const modeOptions = [
  {
    id: 0,
    value: AssistantAccessMode.fullAccess,
    labelKey: 'Assistants.newForm.modeOptions.0.title',
    decriptionKey: 'Assistants.newForm.modeOptions.0.description',
  },
  {
    id: 2,
    value: AssistantAccessMode.highLevel,
    labelKey: 'Assistants.newForm.modeOptions.1.title',
    decriptionKey: 'Assistants.newForm.modeOptions.1.description',
  },
  {
    id: 3,
    value: AssistantAccessMode.confidential,
    labelKey: 'Assistants.newForm.modeOptions.2.title',
    decriptionKey: 'Assistants.newForm.modeOptions.2.description',
  },
];

export default function TranscriptSharing({ assistant, disabled }: { assistant: Assistant; disabled?: boolean }) {
  const t = useTranslations();

  return (
    <div className={twMerge('flex flex-grow flex-col gap-y-8', disabled && 'pointer-events-none opacity-50')}>
      <h5 className="text-center text-base font-semibold text-light-gray">
        {t('CoachDetails.Config.TranscriptPage.description')}
      </h5>
      <div className="flex flex-col gap-y-3 rounded-2xl border border-background-border/[11%] bg-white-opacity p-3.5">
        <RadioGroup
          options={modeOptions}
          optionClassName="px-3 py-2.5 text-sm font-medium rounded-xl text-center"
          className="w-full gap-x-1 rounded-xl bg-graphic/[14%] p-1 backdrop-blur-sm"
          variant="transparent"
          selected={assistant.accessMode}
          setSelected={async (accessMode: AssistantAccessMode) => {
            'use server';
            await updateAssistant(assistant.id, { accessMode });
          }}
        />
        <ul className="flex gap-x-1">
          {modeOptions.map(({ value, decriptionKey }, index) => (
            <li
              key={`coach-mode-li-${index}`}
              className={twMerge(
                'flex-1 rounded-xl border border-storm-gray px-5 py-6 text-center text-main',
                assistant.accessMode === value && 'border-main'
              )}
            >
              {t(decriptionKey)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
