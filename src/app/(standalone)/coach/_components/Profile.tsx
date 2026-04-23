'use client';

import { useActionState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { Assistant } from '@/lib/models/assistant.models';
import { State, Template } from '@/lib/models/common.models';
import { updateAssistant } from '@/server/actions/assistantActions';
import { Button } from '@/shared/Button';
import { Input } from '@/shared/Input';

export default function Profile({ assistant }: { assistant: Assistant }) {
  const t = useTranslations();
  const [state, saveAction, isPending] = useActionState<State<Assistant | null>, any>(
    async (_: State<Assistant | null>, formData: FormData) => {
      const name = formData.get('name')?.toString().trim() || assistant.name;
      const description = formData.get('description')?.toString().trim() || assistant.description;
      const updatedAssistant = { ...assistant, template: {} as Template, name, description };

      const response = await updateAssistant(assistant.id, { name, description });

      return { ...response, value: response.value || updatedAssistant };
    },
    { value: assistant }
  );

  const errors = useMemo(
    () => state.errors?.reduce((errs, item) => ({ ...errs, [item.name]: item.message }), {} as any),
    [state.errors]
  );

  return (
    <div className="flex flex-grow flex-col gap-y-8">
      <h5 className="text-center text-base font-semibold text-light-gray">
        {t('CoachDetails.Config.ProfilePage.description')}
      </h5>

      <form action={saveAction} className="mt-2 flex flex-grow flex-col gap-y-3">
        <div className="flex flex-col gap-y-3 rounded-2xl border border-background-border/[11%] bg-white-opacity p-3.5">
          <div className="flex flex-col gap-y-2">
            <Input
              className="flex flex-col gap-y-2.5"
              placeholderKey="Assistants.newForm.namePlaceholder"
              id="name"
              name="name"
              labelKey="Assistants.newForm.nameLabel"
              labelClassName="text-sm ps-2"
              inputClassName="bg-white/[8%] text-base text-light-gray focus:text-main focus:border-main"
              disabled={isPending}
              initialValue={state.value?.name || ''}
            />
            {!!errors?.name && t.has(String(errors?.name)) && (
              <p className="text-sm text-salmon">{t(String(errors?.name))}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <Input
              id="description"
              type="textarea"
              name="description"
              labelClassName="text-sm ps-2"
              labelKey="Assistants.newForm.descriptionLabel"
              placeholderKey="Assistants.newForm.descriptionPlaceholder"
              className="textarea flex flex-grow flex-col gap-y-2.5"
              inputClassName="overflow-y-auto line-height-[1.2em] bg-white/[8%] min-h-64 placeholder:text-base text-base focus:border-main text-light-gray focus:text-main"
              disabled={isPending}
              initialValue={state.value?.description || ''}
            />
            {errors?.description && t.has(String(errors.description)) && (
              <p className="text-sm text-salmon">{t(String(errors?.description))}</p>
            )}
          </div>
        </div>
        <div className="flex w-1/2 flex-row justify-end gap-x-1 self-end">
          <Button
            type="submit"
            variant="solid"
            color="light"
            className={`w-44 px-7 ${isPending && 'animate-pulse'}`}
            disabled={isPending}
          >
            <i className="cbi-tick-circle-fill" />
            {t('General.saveButton')}
          </Button>
        </div>
      </form>
    </div>
  );
}
