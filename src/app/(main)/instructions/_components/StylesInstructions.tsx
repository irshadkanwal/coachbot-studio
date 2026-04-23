'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { HeapTrackEvent } from '@/lib/models/analytic.models';
import { Level } from '@/lib/models/common.models';
import { Style, Tone } from '@/lib/models/instruction.models';
import { heapAnalytics } from '@/lib/services/HeapAnalytics';
import { createStyle, deleteStyle, updateStyle, updateStyleTitle } from '@/server/actions/instructionsActions';
import ConfigurationManager, { FormManagerProps } from '@/shared/ConfigurationManager';
import Dropdown, { DropdownOption } from '@/shared/Dropdown';
import InstructionInput from '@/shared/InstructionInput';

const levelOptions: DropdownOption<Level>[] = Object.values(Level).map((value: Level, id: number) => ({
  id,
  value,
  labelKey: `General.levelOptions.${value}`,
}));

const toneOptions: DropdownOption<Tone>[] = Object.values(Tone).map((value: Tone, id: number) => ({
  id,
  value,
  labelKey: `General.toneOptions.${value}`,
}));

const styleComponentsConfig = [
  { labelKey: 'Instructions.Styles.emojiDropdownTitle', propKey: 'emoji_frequency', options: levelOptions },
  { labelKey: 'Instructions.Styles.languageDropdownTitle', propKey: 'language_complexity', options: levelOptions },
  { labelKey: 'Instructions.Styles.toneDropdownTitle', propKey: 'tone', options: toneOptions },
  { labelKey: 'Instructions.Styles.greetingInputLabel', propKey: 'greeting_templates' },
  { labelKey: 'Instructions.Styles.responseInputLabel', propKey: 'response_patterns' },
  { labelKey: 'Instructions.Styles.templatesInputLabel', propKey: 'closing_templates' },
];

export default function StylesInstructions({ styles$ }: { styles$: Promise<Style[]> }) {
  const t = useTranslations();

  const onStyleSubmit = useCallback(async (style: Style) => {
    heapAnalytics.trackEvent(HeapTrackEvent.save_style, { _value: style.title } as any);

    return updateStyle(style);
  }, []);

  return (
    <ConfigurationManager<Style>
      items$={styles$}
      optonLabelProp="title"
      titleKey="Instructions.Styles.settingsTitle"
      translationKey="Instructions.Styles"
      onCreate={createStyle}
      onEdit={updateStyleTitle}
      onDelete={deleteStyle}
      onSubmit={onStyleSubmit}
    >
      {({ register, errors, setValue, showSave, selectedItem }: FormManagerProps<Style>) => (
        <>
          {styleComponentsConfig.map(({ labelKey, propKey, options }, index, { length }) => (
            <div key={propKey} className="flex flex-grow flex-col gap-y-2.5">
              {options ? (
                <>
                  <p className="ps-5 text-sm font-medium text-storm-gray">{t(labelKey)}</p>
                  <Dropdown
                    listClassName="rounded-xl"
                    position={'bottom end'}
                    options={options}
                    selectedOption={selectedItem?.[propKey as keyof Style] as any}
                    onSelectedChange={({ value }) => setValue(propKey as keyof Style, value)}
                  />
                  {errors[propKey as keyof Style] && (
                    <p className="text-sm text-red-500">{t((errors[propKey as keyof Style] || '') as string)}</p>
                  )}
                </>
              ) : (
                <InstructionInput
                  register={register}
                  errors={errors}
                  name={propKey}
                  className="min-h-64"
                  id={`${propKey}-input`}
                  labelKey={labelKey}
                  initialValue={(selectedItem?.[propKey as keyof Style] as string) || ''}
                  topControls={false}
                  bottomControls={index === length - 1}
                  showSaveOnChanges={false}
                  showSave={showSave}
                />
              )}
            </div>
          ))}
        </>
      )}
    </ConfigurationManager>
  );
}
