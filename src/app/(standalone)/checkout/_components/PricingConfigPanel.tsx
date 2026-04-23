'use client';

import { useTranslations } from 'next-intl';

import { Price } from '@/lib/models/checkout.models';
import { Button } from '@/shared/Button';
import Dropdown from '@/shared/Dropdown';
import { Input } from '@/shared/Input';

const getCurrencyOptions = (prices: Price[], t: any) => {
  const allCurrencies = [...new Set(prices.flatMap(({ currency_options }) => Object.keys(currency_options)))];
  const currencyTranslationKey = 'CoachDetails.Config.MonetizationPage.priceForm.curencyOptions';

  return allCurrencies.map((currency: string, id: number) => ({
    id,
    value: currency.toLowerCase(),
    ...(t.has(`${currencyTranslationKey}.${currency.toLowerCase()}`)
      ? { labelKey: `${currencyTranslationKey}.${currency.toLowerCase()}` }
      : { label: currency.toUpperCase() }),
  }));
};

export default function PricingConfigTable({
  currency,
  onChange,
  prices,
}: {
  currency: string;
  onChange: (cur: string) => any;
  prices: Price[];
}) {
  const t = useTranslations();
  const currencyOptions = getCurrencyOptions(prices, t);

  return (
    <div className="flex w-full min-w-0 flex-grow items-center justify-center gap-x-10 border-b border-storm-gray pb-3.5">
      <div className="flex min-w-0 max-w-96 flex-grow basis-1/2 flex-col gap-y-1.5">
        <p className="ps-3 text-sm text-light-gray">{t('Checkout.pricingTableConfig.currencyLabel')}</p>
        <Dropdown
          listClassName="[--anchor-gap:-3rem] rounded-xl"
          selectedOption={currency}
          className={`text-nowrap py-2.5`}
          options={currencyOptions}
          onSelectedChange={({ value }) => onChange(value)}
        ></Dropdown>
      </div>
      <div className="hidden min-w-0 max-w-96 flex-grow basis-1/2 flex-col gap-y-1.5">
        <p className="ps-3 text-sm text-light-gray">{t('Checkout.pricingTableConfig.promocodeLabel')}</p>
        <form action="" className="flex min-w-0 flex-1 flex-grow gap-x-1">
          <Input
            name="promocode"
            id="promocode"
            className="flex-grow"
            placeholder={t('Checkout.pricingTableConfig.promocodePlaceholder')}
            inputClassName="bg-white-opacity border-background-border/[11%]"
          />
          <Button variant="solid" color="dark" className="px-6">
            <i className="cbi-tick-circle-fill" />
            Apply
          </Button>
        </form>
      </div>
    </div>
  );
}
