'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Assistant, PriceConfiguration } from '@/lib/models/assistant.models';
import { PriceCurrency } from '@/lib/models/checkout.models';
import { getFormatedDate } from '@/lib/utils/date.utils';
import { setPrice } from '@/server/actions/priceActions';
import { Button } from '@/shared/Button';
import { Chip } from '@/shared/Chip';
import Dropdown, { DropdownOption } from '@/shared/Dropdown';
import { Input } from '@/shared/Input';
import { Spinner } from '@/shared/Loaders';

export default function PriceForm({ assistant, disabled }: { assistant: Assistant; disabled: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const currencyOptions: DropdownOption<string>[] = Object.entries(
    t.raw('CoachDetails.Config.MonetizationPage.priceForm.curencyOptions')
  ).map(([value, label], id) => ({ id, value, label: label as string }));
  const isPriceExists = useMemo(() => !!assistant.meta?.price, [assistant.meta?.price]);
  const defaultValues = useMemo(
    () => (!disabled && assistant.meta?.price) || ({ currency: PriceCurrency.eur } as PriceConfiguration),
    [assistant.meta?.price, disabled]
  );

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PriceConfiguration & { successMessage?: string | null; errorMessage?: string | null }>({
    mode: 'onChange',
    defaultValues,
  });

  const formValues = watch();

  const updateMessages = useCallback(({ error, successMessage }: any = {}) => {
    setValue('errorMessage', error);
    setValue('successMessage', successMessage);
  }, []);

  const onSubmitHandler = async (data: PriceConfiguration) => {
    updateMessages();
    const response = await setPrice(assistant, data, assistant.meta?.price);

    if (response.errors) {
      return response.errors?.forEach(({ name, message }: any) => setError(name, { message }));
    }

    updateMessages(response);
  };

  const updatedDate = useMemo(() => {
    const { created_at, updated_at } = assistant.meta?.price || {};

    return created_at && updated_at && updated_at.getTime() !== created_at.getTime()
      ? assistant.meta?.price?.updated_at
      : null;
  }, [assistant.meta?.price]);

  useEffect(() => reset(defaultValues), [disabled]);

  return (
    <form
      className={`flex flex-col gap-y-5 rounded-2xl bg-graphic/[14%] p-3.5 ${disabled ? 'opacity-50' : ''}`}
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      {!disabled && (
        <div className="-my-3 flex gap-x-3">
          {assistant.meta?.price?.created_at && (
            <Chip
              variant={'dark'}
              size="s"
              text={'Price created: '}
              textClassName="text-xs border border-background-border/[18%]"
              className="w-fit"
            >
              {getFormatedDate(assistant.meta?.price?.created_at, locale, { dateStyle: 'long' })}
            </Chip>
          )}
          {updatedDate && (
            <Chip
              variant={'white'}
              size="s"
              text={'Price updated: '}
              textClassName="text-xs border border-background-border/[18%]"
              className="w-fit"
            >
              {getFormatedDate(updatedDate, locale, { dateStyle: 'long' })}
            </Chip>
          )}
        </div>
      )}
      <div className="flex flex-col gap-y-2.5 border-b border-storm-gray pb-3.5">
        <label htmlFor="currency" className="ps-3 text-sm font-medium text-light-gray">
          {t('CoachDetails.Config.MonetizationPage.priceForm.currencyLabel')}
        </label>
        <Dropdown
          disabled={isPriceExists}
          listClassName="[--anchor-gap:-3rem] rounded-xl"
          selectedOption={formValues?.currency}
          className={`w-full text-nowrap py-2.5 text-main ${(disabled || isPriceExists) && 'pointer-events-none opacity-45'}`}
          options={currencyOptions}
          onSelectedChange={({ value }) => setValue('currency', value)}
        ></Dropdown>
      </div>
      <div className="flex flex-wrap justify-between gap-2">
        <p className="flex w-full ps-3 text-sm font-medium text-light-gray">
          {t('CoachDetails.Config.MonetizationPage.priceForm.periodLabel')}
        </p>
        <div className="flex w-[47%] flex-col gap-y-1">
          <label htmlFor="monthly" className="ps-3 text-sm font-medium uppercase text-main">
            {t.rich('CoachDetails.Config.MonetizationPage.priceForm.monthlyInputLabel', {
              addition: (chunk: any) => <span className="font-light normal-case">{chunk}</span>,
            })}
          </label>
          <Input
            disabled={isSubmitting || disabled}
            id="monthly"
            type="number"
            step="0.01"
            placeholder="00.00"
            initialValue={formValues.monthly?.toString() || ''}
            inputClassName={`border-storm-gray placeholder:text-light-gray bg-white-opacity text-base focus:border-main ${disabled && 'animate-none'}`}
            {...register('monthly', { required: 'General.errors.emptyFiled' })}
          />
          {errors.monthly && t.has(String(errors.monthly.message)) && (
            <p className="text-sm text-salmon">{t(String(errors.monthly.message))}</p>
          )}
        </div>
        <div className="flex w-[47%] flex-col gap-y-1">
          <label htmlFor="monthly" className="ps-3 text-sm font-medium uppercase text-main">
            {t.rich('CoachDetails.Config.MonetizationPage.priceForm.yearlyInputLabel', {
              addition: (chunk: any) => <span className="font-light normal-case text-light-gray">{chunk}</span>,
            })}
          </label>
          <Input
            disabled={isSubmitting || disabled}
            id="yearly"
            type="number"
            step="0.01"
            placeholder="00.00"
            initialValue={formValues.yearly?.toString() || ''}
            inputClassName={`border-storm-gray placeholder:text-light-gray bg-white-opacity text-base focus:border-main ${disabled && 'animate-none'}`}
            {...register('yearly')}
          />
        </div>
      </div>
      <div className="flex flex-grow justify-end gap-x-1">
        <div className="flex flex-grow flex-col ps-5">
          {formValues.errorMessage && <p className="text-salmon">{t(formValues.errorMessage)}</p>}
          {formValues.successMessage && <p className="text-dark-aquamarine">{t(formValues.successMessage)}</p>}
        </div>
        {!disabled && (
          <Button
            variant="solid"
            color="light"
            className="w-44 px-7 hover:border-background hover:bg-background disabled:border-graphic/[11%] disabled:bg-transparent disabled:text-graphic/[75%]"
            onClick={() => close()}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? <Spinner className="max-h-4" /> : <i className="cbi-tick-circle-fill" />}
            {t('General.saveButton')}
          </Button>
        )}
      </div>
    </form>
  );
}
