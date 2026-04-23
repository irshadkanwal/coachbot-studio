import { getTranslations } from 'next-intl/server';

import { chageSelectedModel, getPresets } from '@/server/actions/customizationActions';
import ComingSoon from '@/shared/CoomingSoon';
import Dropdown from '@/shared/Dropdown';
import Configuration from './_components/ConfigurationSettings';

const models: string[] = ['gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano'];
const modelsOptions = models.map((model: string, id: number) => ({ id, label: model, value: model }));

export default async function ConfigurationPage() {
  const t = await getTranslations();
  const presets$ = getPresets();

  return (
    <div className="relative flex flex-grow flex-col gap-y-4 rounded-xl bg-white-opacity p-3.5">
      <ComingSoon className="py-0" />

      <div className="flex flex-col gap-y-2">
        <p className="ps-5 text-sm font-medium text-storm-gray">
          {t('Customization.Configuration.modelDropdownLabel')}
        </p>
        <Dropdown options={modelsOptions} onSelectedChange={chageSelectedModel} className="normal-case" />
      </div>
      <Configuration presets$={presets$} />
    </div>
  );
}
