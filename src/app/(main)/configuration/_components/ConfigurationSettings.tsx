'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';

import CustomizableDropdown from '@/shared/CustomizableDropdown';
import { Range } from '@/shared/Range';

export default function Configuration({ presets$ }: { presets$: Promise<any[]> }) {
  const t = useTranslations();
  const presets = use(presets$);

  return (
    <section className="flex flex-grow flex-col gap-y-5">
      <div>
        <CustomizableDropdown
          values={presets}
          selectedValue={presets[0]}
          optonLabelProp="title"
          onSelect={(value) => console.warn(value)}
          translationKey="Customization.Configuration"
          tooltipKey="Customization.Configuration.presetsDropdownTooltip"
          handleCreation={(() => null) as any}
          handleEdit={(() => null) as any}
          handleDelete={(() => null) as any}
        />
        <div className="flex flex-grow flex-col gap-y-3 pt-6">
          <h5 className="ms-3 text-sm text-storm-gray">{t('Customization.Configuration.settingsTitle')}</h5>
          <div className="flex flex-col gap-y-2 rounded-xl bg-white/[16%] px-5 py-4">
            <Range id="temperature-input" className="w-full" currentValue={0.56} label={'Temperature'} />
            <Range id="top-p-input" className="w-full" currentValue={0.79} label={'Top P'} />
            <Range id="frequency-input" className="w-full" currentValue={0.39} label={'Frequency Penalty'} />
            <Range id="fresence-input" className="w-full" currentValue={0.45} label={'Fresence Penalty'} />
          </div>
        </div>
      </div>
    </section>
  );
}
