import { getTranslations } from 'next-intl/server';

import { Assistant } from '@/lib/models/assistant.models';
import { getCategories } from '@/server/actions/goalsActions';
import { Button } from '@/shared/Button';
import CategoriesManager from './CategoriesManager';

export default async function GoalVision({ assistant }: { assistant: Assistant }) {
  const [t, categories] = await Promise.all([getTranslations(), getCategories(assistant.id)]);
  const isEnabled = !!assistant.meta?.goalVision;

  return (
    <section className="flex flex-grow flex-col gap-y-3">
      <h5 className="text-center font-semibold text-light-gray">
        {t('CoachDetails.Config.GoalVisionPage.description')}
      </h5>
      <div
        className={`flex flex-col gap-y-3 overflow-hidden rounded-2xl border bg-white-opacity p-3.5 ${isEnabled ? 'border-dark-aquamarine' : 'pointer-events-none border-graphic/[20%]'}`}
      >
        <p className="text-center text-sm text-main">{t('CoachDetails.Config.GoalVisionPage.categoriesAreaTitile')}</p>
        <CategoriesManager assistantId={assistant.id} categories={categories} isDisabled={!isEnabled} />
      </div>
      <div className={`flex justify-end gap-x-5 ${!isEnabled && 'pointer-events-none opacity-30'}`}>
        <Button variant="solid" color="dark" type="reset" form="goalVisionForm">
          <i className="cbi-undo" />
          {t('General.Instruction.resetButton')}
        </Button>

        <Button name={`categories-submit`} type="submit" variant="solid" color="light" form="goalVisionForm">
          <i className="cbi-archive-tick" />
          {t('General.Instruction.saveButton')}
        </Button>
      </div>
    </section>
  );
}
