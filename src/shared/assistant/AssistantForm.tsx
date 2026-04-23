'use client';

import { RefObject, use, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { PrivateRoutes } from '@/lib/constants';
import { Assistant, AssistantAccessMode, AssistantEditable } from '@/lib/models/assistant.models';
import { Template } from '@/lib/models/common.models';
import { validateNotEmpty } from '@/lib/utils/input.utils';
import { upsertAssistantWithTemplate } from '@/server/actions/assistantActions';
import { updateSession } from '@/server/actions/sessionActions';
import { Button } from '@/shared/Button';
import Dropdown, { DropdownOption, getOptions } from '@/shared/Dropdown';
import { Input } from '@/shared/Input';
import { Spinner } from '@/shared/Loaders';
import { RadioGroup } from '@/shared/RadioGroup';
import Tooltip from '@/shared/Tooltip';

const modeOptions = [
  { id: 0, value: AssistantAccessMode.fullAccess, labelKey: 'Assistants.newForm.modeOptions.0.title' },
  { id: 1, value: AssistantAccessMode.highLevel, labelKey: 'Assistants.newForm.modeOptions.1.title' },
  { id: 2, value: AssistantAccessMode.confidential, labelKey: 'Assistants.newForm.modeOptions.2.title' },
];

const defaultTemplateOption = { id: '0', value: '', label: 'None' };

export default function NewAssistantForm({
  ref,
  assistant,
  templates$,
  setModalHandler,
}: {
  ref?: RefObject<HTMLFormElement>;
  assistant?: Assistant | null;
  templates$: Promise<Template[]>;
  setModalHandler?: (value: boolean) => void;
}) {
  const t = useTranslations();
  const templates = use(templates$);
  const router = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isLoading },
  } = useForm<AssistantEditable & { template?: Template }>({
    defaultValues: assistant
      ? { ...assistant, template: assistant?.configuration?.template }
      : { accessMode: AssistantAccessMode.fullAccess },
    mode: 'onChange',
  });

  const formValues = watch();

  const templateOptions = useMemo(() => [defaultTemplateOption, ...getOptions([...templates], 'name')], [templates]);

  const handleResponse = async (createdAssistant: Assistant) => {
    if (assistant) return router.back();

    await updateSession(
      { assistantId: createdAssistant?.id ?? null },
      ['stages', 'styles', 'firstStage'],
      ['/instructions']
    );
    router.push(PrivateRoutes.instructions);
  };

  const onSubmitHandler = useCallback(
    async (data: AssistantEditable) => {
      const response = await upsertAssistantWithTemplate(
        {
          ...data,
          name: data.name.trim(),
          description: data.description.trim(),
        },
        assistant?.id
      );

      if (response.errors) {
        return response.errors.forEach(({ name, message }: any) => setError(name, { message }));
      }

      response.value && handleResponse(response.value);
    },
    [setModalHandler]
  );

  useEffect(() => {
    setValue('accessMode', assistant?.accessMode || AssistantAccessMode.fullAccess);
    assistant?.configuration?.template && setValue('template', assistant?.configuration?.template);
  }, []);

  return (
    <div className="flex flex-col gap-y-2 md:max-w-3xl">
      <h3 className="ps-2 text-base font-semibold text-main">{t('Assistants.newForm.title')}</h3>
      <p className="text-wrap ps-2 text-sm text-light-gray">{t('Assistants.newForm.subTitle')}</p>

      <form ref={ref} onSubmit={handleSubmit(onSubmitHandler)} className="mt-2 flex flex-col gap-y-3">
        {!assistant && (
          <div className="flex flex-col gap-y-2 border-b border-storm-gray pb-3">
            <label htmlFor="template" className="px-2 text-sm font-medium text-main">
              {t('Assistants.newForm.presetsLabel')}
            </label>
            <Dropdown
              selectedOption={formValues.template || defaultTemplateOption.value}
              className="w-full bg-white/[8%] text-main"
              options={templateOptions as DropdownOption<string | Template>[]}
              onSelectedChange={({ value }) => !!value && setValue('template', value as Template)}
            />
            {errors.template && <p className="text-sm text-salmon">{t(String(errors.template.message))}</p>}
          </div>
        )}
        <div className="flex flex-col gap-y-2">
          <Input
            className="flex flex-col gap-y-2.5"
            placeholderKey="Assistants.newForm.namePlaceholder"
            id="name"
            labelKey="Assistants.newForm.nameLabel"
            labelClassName="text-sm ps-2"
            inputClassName="bg-white/[8%] text-base"
            {...register('name', { required: 'General.errors.emptyFiled', validate: validateNotEmpty })}
            disabled={isLoading}
          />
          {errors.name && t.has(String(errors.name.message)) && (
            <p className="text-sm text-salmon">{t(String(errors.name.message))}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          <Input
            id="description"
            type="textarea"
            labelClassName="text-sm ps-2"
            labelKey="Assistants.newForm.descriptionLabel"
            placeholderKey="Assistants.newForm.descriptionPlaceholder"
            className="textarea flex flex-grow flex-col gap-y-2.5"
            inputClassName="overflow-y-auto line-height-[1.2em] bg-white/[8%] min-h-32 placeholder:text-base text-base"
            disabled={isLoading}
            {...register('description', { required: 'General.errors.emptyFiled', validate: validateNotEmpty })}
          />
          {errors.description && t.has(String(errors.description.message)) && (
            <p className="text-sm text-salmon">{t(String(errors.description.message))}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-2 border-b border-storm-gray pb-3">
          <label className="-mb-1 inline-flex items-center gap-x-2 ps-3 text-sm text-main">
            {t('Assistants.newForm.modeSelectionLabel')}
            <Tooltip
              iconClass="cbi-message-question text-light-gray"
              tooltipLabel={'Assistants.newForm.modeSelectionLabel'}
              tooltipClassName="-translate-x-[80%]"
            />
          </label>
          <RadioGroup
            options={modeOptions}
            optionClassName="px-3 py-1.5 text-base font-medium rounded-xl text-center"
            className="w-full gap-x-1 rounded-xl bg-graphic/[14%] p-1 backdrop-blur-sm"
            variant="transparent"
            selected={formValues.accessMode}
            setSelected={(value: AssistantAccessMode) => setValue('accessMode', value)}
          />
          <p className="inline-flex items-center ps-2 text-sm text-main">
            <i className="cbi-info-circle me-2" />
            {t.rich(
              formValues.accessMode === AssistantAccessMode.fullAccess
                ? 'Assistants.newForm.termConditionsFullAccessNote'
                : 'Assistants.newForm.termConditionsConfidentialNote',
              {
                link: (chunk: any) => (
                  <Link
                    prefetch={false}
                    className="text-sm text-main underline underline-offset-2"
                    target="_blank"
                    href={'https://coachbot.ai/legal/terms-of-service'}
                  >
                    {chunk}
                  </Link>
                ),
              }
            )}
          </p>
        </div>
        <div className="flex w-1/2 flex-row justify-end gap-x-1 self-end">
          <Button
            type="button"
            variant="outline"
            color="darkGray"
            disabled={isLoading}
            onClick={() => router.back()}
            className="flex-1 flex-grow px-10 text-base"
          >
            {t('General.cancelButton')}
          </Button>

          <Button
            disabled={isLoading || !!errors.name || !!errors.description}
            type="submit"
            variant="solid"
            color="light"
            className={twMerge(
              'inline-flex flex-1 flex-grow items-center text-nowrap px-7 py-2.5 text-base disabled:opacity-30',
              isLoading && 'animate-pulse'
            )}
          >
            {isLoading ? <Spinner /> : <i className={assistant ? 'cbi-edit-2' : 'cbi-add'} />}
            {t(assistant ? 'Assistants.modal.editTitle' : 'Assistants.modal.title')}
          </Button>
        </div>
      </form>
    </div>
  );
}
