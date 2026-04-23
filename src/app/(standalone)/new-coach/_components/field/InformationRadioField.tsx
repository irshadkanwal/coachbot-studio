'use client';

import { useState } from 'react';

import { AssistantAccessMode } from '@/lib/models/assistant.models';
import { FieldWrapper } from './FieldWrapper';
import { InputFieldProps } from './InputField';

export const InformationRadioField: React.FC<InputFieldProps> = ({ ...props }) => {
  const [value, setValue] = useState<string>(props.initialValue ?? 'none');

  const onChange = (value: string) => {
    setValue(value);
    props.onChange?.(value);
  };

  return (
    <FieldWrapper
      {...props}
      field={
        <div className="w-full">
          <div className="flex justify-between rounded-lg bg-graphic/[14%] p-1">
            <button
              type="button"
              className={`flex-1 rounded-lg px-4 py-2 transition-colors hover:bg-background/50 ${
                value === AssistantAccessMode.confidential ? 'bg-background text-light-gray' : 'text-main/50'
              }`}
              onClick={() => onChange(AssistantAccessMode.confidential)}
            >
              None
            </button>
            <button
              type="button"
              className={`flex-1 rounded-lg px-4 py-2 transition-colors hover:bg-background/50 ${
                value === AssistantAccessMode.highLevel ? 'bg-background text-light-gray' : 'text-main/50'
              }`}
              onClick={() => onChange(AssistantAccessMode.highLevel)}
            >
              Limited
            </button>
            <button
              type="button"
              className={`flex-1 rounded-lg px-4 py-2 transition-colors hover:bg-background/50 ${
                value === AssistantAccessMode.fullAccess ? 'bg-background text-light-gray' : 'text-main/50'
              }`}
              onClick={() => onChange(AssistantAccessMode.fullAccess)}
            >
              Full Access
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div
              className={`rounded-3xl border px-4 py-5 text-center ${value === AssistantAccessMode.confidential ? 'border-main bg-main/10' : 'border border-main/30'}`}
            >
              <p className="mb-3.5 h-[27] text-sm font-semibold text-main">Fully confidential</p>
              <p className="text-sm text-light-gray">No access to chat content or usage data.</p>
            </div>
            <div
              className={`rounded-3xl border px-4 py-5 text-center ${value === AssistantAccessMode.highLevel ? 'border-main bg-main/10' : 'border border-main/30'}`}
            >
              <p className="mb-3.5 h-[27] text-sm font-semibold text-main">Only high-level summaries</p>
              <p className="text-sm text-light-gray">Topic trends, engagement stats - no transcript content.</p>
            </div>
            <div
              className={`rounded-3xl border px-4 py-5 text-center ${value === AssistantAccessMode.fullAccess ? 'border-main bg-main/10 data-[checked]:bg-main' : 'border border-main/30'}`}
            >
              <p className="mb-3.5 h-[27] text-sm font-semibold leading-[1] text-main">
                Includes conversation transcripts
              </p>
              <p className="text-sm text-light-gray">
                Full view of interactions, helpful for oversight, personalization, or research.
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
};
