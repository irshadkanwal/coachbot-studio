import { getTranslations } from 'next-intl/server';

import { getAssistantConfiguration } from '@/server/actions/assistantActions';
import { Tips } from '../../../shared/Tips';
import SystemInstructions from './_components/SystemInstructions';

export default async function InstructionsPage() {
  const t = await getTranslations();

  return (
    <>
      <div className="flex flex-col gap-y-2 border-b border-main px-3 pb-5 ps-5 pt-3 text-main">
        <p className="text-sm">{t('Instructions.systemInstruction.description')}</p>
      </div>
      <SystemInstructions assistantConfig$={getAssistantConfiguration('', false)} className="shrink-0" />
      <Tips titleKey="Instructions.tipsTitle" tipsKey="Instructions.systemInstruction.tipsOptions" t={t} />
    </>
  );
}
