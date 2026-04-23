'use client';

import { use, useCallback, useImperativeHandle, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import {
  Category,
  Goal,
  GoalCompletionType,
  GoalFrequency,
  GoalMonthlyRepeat,
  NewGoal,
} from '@/lib/models/goal.models';
import { validateNotEmpty } from '@/lib/utils/input.utils';
import { createNewGoal, updateExistingGoal } from '@/server/actions/goalsActions';
import { Button } from '@/shared/Button';
import Dropdown from '@/shared/Dropdown';
import { Input } from '@/shared/Input';
import GoalTracker from './GoalTracker';

const defaultValues = {
  frequency: GoalFrequency.daily,
  repeatEvery: 1,
  monthlyRepeat: GoalMonthlyRepeat.everySecondDay,
  completionRule: {
    type: GoalCompletionType.never,
    times: 1,
    date: new Date(),
  },
};

const mapNewGoalData = (data: NewGoal) => ({
  ...data,
  weeklyRepeat: data.frequency === GoalFrequency.weekly ? data.weeklyRepeat : null,
  monthlyRepeat: data.frequency === GoalFrequency.monthly ? data.monthlyRepeat : null,
  completionRule: {
    ...data.completionRule,
    date: data.completionRule.type === GoalCompletionType.date ? data.completionRule.date : null,
    times: data.completionRule.type === GoalCompletionType.after ? data.completionRule.times : null,
  },
});

export default function AddGoalForm({
  assistantId,
  goal,
  ref,
  className,
  categories$,
  disabled = false,
}: {
  assistantId: string;
  goal?: Goal;
  className?: string;
  ref?: React.Ref<any>;
  disabled?: boolean;
  categories$: Promise<Category[]>;
}) {
  const t = useTranslations();
  const categories = use(categories$);
  const categoriesOptions = useMemo(
    () => categories.map((category) => ({ id: category.id, label: category.name, value: category })),
    []
  );
  const form = useForm<NewGoal & { successMessage?: string; errorMessage?: string }>({
    mode: 'onChange',
    defaultValues: goal || { ...defaultValues, category: categories[0] },
  });
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors, isLoading },
  } = form;
  const formValues = watch();

  const onSubmitHandler = useCallback(
    async (data: NewGoal) => {
      const mappedData = mapNewGoalData(data);
      const response = goal
        ? await updateExistingGoal(goal.id, mappedData)
        : await createNewGoal(assistantId, mappedData);

      if (response.errors) {
        return response.errors?.forEach(({ name, message }: any) => setError(name, { message }));
      }

      response.successMessage && reset();
      setValue('errorMessage', response.error);
      setValue('successMessage', response.successMessage);
    },
    [reset]
  );

  useImperativeHandle(ref, () => ({ submit: () => handleSubmit(onSubmitHandler)(), getValues }), [
    handleSubmit,
    onSubmitHandler,
    formValues.successMessage,
  ]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="flex w-full flex-grow flex-col gap-y-3">
        <div
          className={twMerge(
            'flex flex-col gap-y-5 rounded-2xl',
            className,
            disabled && 'border border-background-border/[6%]'
          )}
        >
          {!goal && (
            <h4 className="pt-2 text-center text-sm text-main">
              {t('CoachDetails.Config.GoalTrackPage.addGoalForm.title')}
            </h4>
          )}

          <div className="flex gap-x-2.5">
            <div className="flex flex-1 flex-col gap-y-2">
              <p className="ps-3 text-sm font-medium text-light-gray">
                {t('CoachDetails.Config.GoalTrackPage.addGoalForm.categoriesLabel')}
              </p>
              <Dropdown
                selectedOption={formValues?.category}
                options={categoriesOptions}
                onSelectedChange={({ value }) => setValue('category', value)}
                className={twMerge('normal-case text-main outline-none', disabled && 'pointer-events-none opacity-30')}
              />
              {errors.category && <p className="text-sm text-salmon">{t(String(errors.category.message))}</p>}
            </div>
            <div className="flex flex-1 flex-col gap-y-2">
              <p className="ps-3 text-sm font-medium text-light-gray">
                {t('CoachDetails.Config.GoalTrackPage.addGoalForm.inputLabel')}
              </p>
              <Input
                id="title"
                className="flex-grow gap-y-2"
                placeholder={`Add topic ${1} / 10`}
                inputClassName="flex items-center justify-between gap-x-2 rounded-xl border border-storm-gray bg-white-opacity p-2 px-5  text-main hover:border-main placeholder:text-light-gray"
                {...register('title', { required: 'General.errors.emptyFiled', validate: validateNotEmpty })}
                disabled={disabled || isLoading}
              />
              {errors.title && <p className="text-sm text-salmon">{t(String(errors.title.message))}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="ps-3 text-sm font-medium text-light-gray">
              {t('CoachDetails.Config.GoalTrackPage.addGoalForm.scheduleTitle')}
            </p>
            <GoalTracker form={form} disabled={disabled} />
          </div>
        </div>
        <div className="flex items-center gap-x-10">
          <div className="flex flex-grow flex-col ps-5">
            {formValues.errorMessage && <p className="text-salmon">{t(formValues.errorMessage)}</p>}
            {formValues.successMessage && <p className="text-dark-aquamarine">{t(formValues.successMessage)}</p>}
          </div>
          {!goal && (
            <Button
              variant="solid"
              color="light"
              className="w-1/4 self-end"
              type="submit"
              disabled={disabled || isLoading}
            >
              <i className="cbi-add-circle text-background" />
              {t('CoachDetails.Config.GoalTrackPage.addGoalForm.submitButton')}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
