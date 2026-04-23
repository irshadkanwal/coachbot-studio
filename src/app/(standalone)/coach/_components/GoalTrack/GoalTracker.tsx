import { useTranslations } from 'next-intl';
import DatePicker from 'react-datepicker';
import { UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { GoalCompletionType, GoalFrequency, GoalMonthlyRepeat, NewGoal } from '@/lib/models/goal.models';
import { getWeekDaysOptions } from '@/lib/utils/date.utils';
import { handleBlockedKeys, handleInputMinMaxRange } from '@/lib/utils/input.utils';
import Dropdown from '@/shared/Dropdown';
import { FormField } from '@/shared/FormField';
import { Input } from '@/shared/Input';
import { MultiSelect } from '@/shared/MultiSelect';
import { RadioGroup } from '@/shared/RadioGroup';

const periodOptions = [
  {
    id: 0,
    value: GoalFrequency.daily,
    labelKey: 'CoachDetails.Config.GoalTrackPage.addGoalForm.periodOptions.daily',
    icon: 'cbi-calendar-day',
  },
  {
    id: 2,
    value: GoalFrequency.weekly,
    labelKey: 'CoachDetails.Config.GoalTrackPage.addGoalForm.periodOptions.weekly',
    icon: 'cbi-calendar-2',
  },
  {
    id: 3,
    value: GoalFrequency.monthly,
    labelKey: 'CoachDetails.Config.GoalTrackPage.addGoalForm.periodOptions.monthly',
    icon: 'cbi-calendar-circle',
  },
];

const monthlyOptions = [
  {
    id: 0,
    value: GoalMonthlyRepeat.everySecondDay,
    labelKey: 'CoachDetails.Config.GoalTrackPage.addGoalForm.goalTracker.montlyOptions.0',
  },
  {
    id: 1,
    value: GoalMonthlyRepeat.monday,
    labelKey: 'CoachDetails.Config.GoalTrackPage.addGoalForm.goalTracker.montlyOptions.1',
  },
];

const completionOptions = [
  {
    id: 0,
    value: GoalCompletionType.never,
    labelKey: 'CoachDetails.Config.GoalTrackPage.addGoalForm.completionOptions.0',
  },
  {
    id: 2,
    value: GoalCompletionType.date,
    labelKey: 'CoachDetails.Config.GoalTrackPage.addGoalForm.completionOptions.1',
  },
  {
    id: 3,
    value: GoalCompletionType.after,
    labelKey: 'CoachDetails.Config.GoalTrackPage.addGoalForm.completionOptions.2',
  },
];

export default function GoalTracker({ form, disabled }: { form: UseFormReturn<NewGoal>; disabled?: boolean }) {
  const t = useTranslations();

  const formValues = form.watch();

  return (
    <section
      className={twMerge(
        'flex flex-grow flex-col gap-y-3.5 rounded-2xl border border-main bg-graphic/[14%] p-2.5',
        disabled && 'pointer-events-none border-transparent opacity-40'
      )}
    >
      <div className="flex items-center gap-x-2 border-b border-storm-gray pb-3.5">
        <FormField
          wrapperClassName="flex flex-grow flex-col gap-y-1.5"
          labelClassName="ps-3 text-sm text-main"
          name="frequency"
          labelKey={'CoachDetails.Config.GoalTrackPage.addGoalForm.goalTracker.periodLabel'}
          rules={{ required: t('General.errors.emptyFiled') }}
          as={RadioGroup}
          options={periodOptions}
          optionClassName="px-3 py-2.5 text-sm font-medium rounded-xl text-center"
          className="w-full gap-x-1 rounded-xl bg-graphic/[14%] p-1 backdrop-blur-sm"
          variant="transparent"
          disabled={disabled || form.formState.isLoading}
        />
        <span className="pt-5 text-main">&mdash;</span>
        <FormField
          wrapperClassName="flex basis-1/5 flex-col gap-y-1.5"
          labelClassName="text-sm ps-3 text-main"
          name="repeatEvery"
          labelKey="CoachDetails.Config.GoalTrackPage.addGoalForm.repeatEveryLabel"
          as={Input}
          id="repeat"
          type="number"
          step={1}
          placeholder="1"
          max={100}
          min={1}
          inputClassName="bg-transparent text-base rounded-xl text-center text-main focus:text-main focus:border-main py-2.5"
          onKeyDown={handleBlockedKeys as React.KeyboardEventHandler<HTMLInputElement>}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputMinMaxRange(e, 1, 100)}
          disabled={form.formState.isLoading || disabled}
        />
      </div>
      {formValues.frequency && formValues.frequency !== GoalFrequency.daily && (
        <div className="flex flex-grow border-b border-storm-gray pb-3.5">
          {formValues.frequency === GoalFrequency.weekly && (
            <FormField
              name="weeklyRepeat"
              as={MultiSelect}
              disabled={form.formState.isLoading || disabled}
              wrapperClassName="flex flex-col gap-y-1.5 flex-grow"
              labelKey={'CoachDetails.Config.GoalTrackPage.addGoalForm.goalTracker.weeklyRepeatLabel'}
              labelClassName="text-sm text-main ps-3"
              optionClassName="capitalize"
              options={getWeekDaysOptions('en', 'short').map((opt, id) => ({
                id,
                value: opt.value,
                label: opt.label,
              }))}
            />
          )}
          {formValues.frequency === GoalFrequency.monthly && (
            <FormField
              disabled={form.formState.isLoading || disabled}
              wrapperClassName="w-full"
              name="monthlyRepeat"
              as={Dropdown}
              selectedOption={formValues.monthlyRepeat}
              options={monthlyOptions}
              className="w-full flex-grow border-storm-gray bg-transparent normal-case text-main"
            />
          )}
        </div>
      )}
      <div className="flex items-center gap-x-2">
        <FormField
          disabled={form.formState.isLoading || disabled}
          wrapperClassName="flex w-[65%] flex-col gap-y-1.5"
          labelClassName="ps-3 text-sm text-main"
          labelKey="CoachDetails.Config.GoalTrackPage.addGoalForm.goalTracker.completionLabel"
          name="completionRule.type"
          as={RadioGroup}
          options={completionOptions}
          optionClassName="px-3 py-2.5 text-sm font-medium rounded-xl text-center"
          className="w-full gap-x-1 rounded-xl bg-graphic/[14%] p-1 backdrop-blur-sm"
          variant="transparent"
        />
        {formValues.completionRule?.type && formValues.completionRule?.type !== GoalCompletionType.never && (
          <>
            <span className="pt-6 text-main">&mdash;</span>

            <div className="flex basis-1/4 self-end">
              {formValues.completionRule?.type === GoalCompletionType.after && (
                <>
                  <FormField
                    name="completionRule.times"
                    wrapperClassName="flex flex-row flex-wrap gap-x-2 items-center flex-grow"
                    labelKey="CoachDetails.Config.GoalTrackPage.addGoalForm.timesLabel"
                    labelClassName="text-sm text-light-gray order-1"
                    as={Input}
                    className="flex min-w-[75%] shrink flex-row flex-nowrap items-center gap-x-2"
                    id="times"
                    type="number"
                    step="1"
                    placeholder="1"
                    max={1000}
                    min={1}
                    inputClassName="h-max flex-grow bg-transparent text-base rounded-xl text-center text-main focus:text-main focus:border-main py-2.5 border-storm-gray"
                    onKeyDown={handleBlockedKeys}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputMinMaxRange(e, 1, 1000)}
                    disabled={form.formState.isLoading || disabled}
                  />
                </>
              )}
              {formValues.completionRule?.type === GoalCompletionType.date && (
                <>
                  <FormField
                    disabled={form.formState.isLoading || disabled}
                    wrapperClassName="cursor-pointer"
                    fieldClassName="relative"
                    name="completionRule.date"
                    as={DatePicker}
                    className="cursor-pointer rounded-xl border border-storm-gray bg-transparent p-2.5 text-base text-main outline-none"
                    minDate={new Date()}
                    locale="en"
                    selected={formValues.completionRule?.date ? new Date(formValues.completionRule.date) : new Date()}
                    value={formValues.completionRule?.date ? new Date(formValues.completionRule.date) : new Date()}
                    dateFormat="MMM d, yyyy"
                    formatWeekDay={(nameOfDay: string) => nameOfDay.slice(0, 3)}
                    calendarClassName="bg-background border border-main rounded-2xl overflow-hidden text-main z-10"
                    popperClassName="bg-transparent"
                    weekDayClassName={() => 'text-light-gray text-sm w-fit font-light uppercase'}
                    dayClassName={() => 'text-main font-medium text-sm leading-[1.65rem] datepicker-current-month'}
                    popperPlacement="bottom-end"
                  >
                    <span className="cbi-calendar-edit absolute right-3 top-1/2 -z-10 -translate-y-1/2 text-xl text-light-gray"></span>
                  </FormField>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
