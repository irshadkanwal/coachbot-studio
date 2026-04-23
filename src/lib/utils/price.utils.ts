import { PriceBasePayload, PriceCurrency, PriceRecuringPeriod } from '../models/checkout.models';

export function formatPrice(
  price?: { amount?: number | null; currency?: string | null },
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
): string {
  return (price?.amount ?? 0).toLocaleString(locale, {
    style: 'currency',
    currency: price?.currency ?? 'usd',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });
}

const getCurrencyAmount = (
  amount: number,
  currency: PriceCurrency,
  exchangeRates: Record<PriceCurrency, number>
): number | null => {
  const rate = exchangeRates[currency];
  if (!rate || rate <= 0) return null;

  const rawAmount = Math.floor(amount / rate) + 0.99;

  return Math.round(rawAmount * 100);
};

export const getCurrencyOptions = (exchangeRates: Record<PriceCurrency, number>, amount: number) => {
  return Object.values(PriceCurrency).reduce((options, currency) => {
    const unitAmount = getCurrencyAmount(amount, currency, exchangeRates);

    return unitAmount === null ? options : { ...options, [currency]: { unit_amount: unitAmount } };
  }, {});
};

export const getPricePayload = ({ price, product, exchangeRates }: PriceBasePayload, interval: PriceRecuringPeriod) => {
  const amount = interval === PriceRecuringPeriod.month ? price.monthly : price.yearly;

  if (amount == null) return null;

  return {
    unit_amount: Math.round(amount * 100),
    currency: price.currency,
    recurring: { interval },
    product,
    currency_options: getCurrencyOptions(exchangeRates, amount) || undefined,
  };
};

export const isMissingProductError = (error: any) =>
  error?.type === 'StripeInvalidRequestError' && error?.code === 'resource_missing' && error?.param === 'product';
