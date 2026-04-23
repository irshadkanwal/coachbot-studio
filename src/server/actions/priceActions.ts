'use server';

import Stripe from 'stripe';

import { Assistant, AssistantPrice, PriceConfiguration, StripePriceConfiguration } from '@/lib/models/assistant.models';
import { PriceBasePayload, PriceCurrency, PriceRecuringPeriod } from '@/lib/models/checkout.models';
import { State } from '@/lib/models/common.models';
import { stripePriceSchema } from '@/lib/utils/db.utils';
import { getPricePayload, isMissingProductError } from '@/lib/utils/price.utils';
import { cbStripeClient } from '../db/stripeClient';
import { updateAssistantMetaPrice } from './assistantActions';

async function getExchangeRates(currency: PriceCurrency | string): Promise<Record<PriceCurrency, number>> {
  try {
    return await cbStripeClient.getExchangeRates(currency as PriceCurrency);
  } catch (error) {
    console.error(`[priceActions] Error getting exchange rates for currency ${currency}:`, error);

    return {} as Record<PriceCurrency, number>;
  }
}

async function getProductId(productName: string, currentPrice?: AssistantPrice) {
  try {
    if (!!currentPrice?.stripeProductId) return currentPrice.stripeProductId;

    const product = await cbStripeClient.createProduct(productName);

    return product.id;
  } catch (error: any) {
    console.error(`[priceActions] Error getting product ${productName} id:`, error);
    throw new Error('[priceActions] Error getting product id', error);
  }
}

async function createNewPrices(
  newPrice: PriceConfiguration,
  basePayload: PriceBasePayload,
  currentPrice?: AssistantPrice
): Promise<[Stripe.Price | null, Stripe.Price | null]> {
  try {
    const shouldCreateMonthly = !currentPrice || newPrice.monthly !== currentPrice?.monthly;
    const shouldCreateYearly = newPrice.yearly && (!currentPrice || newPrice.yearly !== currentPrice?.yearly);

    if (!shouldCreateMonthly && !shouldCreateYearly) return [null, null];

    return await Promise.all([
      shouldCreateMonthly ? cbStripeClient.createPrice(getPricePayload(basePayload, PriceRecuringPeriod.month)) : null,
      shouldCreateYearly ? cbStripeClient.createPrice(getPricePayload(basePayload, PriceRecuringPeriod.year)) : null,
    ]);
  } catch (error: any) {
    console.error(`[priceActions] Error creating stripe prices for product ${basePayload.product}:`, error);
    throw new Error('[priceActions] Error creating stripe prices for product', error);
  }
}

async function archiveOldPrices(
  { monthlyPriceId, yearlyPriceId }: StripePriceConfiguration,
  currentPrice?: AssistantPrice
): Promise<void> {
  const shouldArchiveMonthly = currentPrice?.monthlyPriceId && monthlyPriceId !== currentPrice.monthlyPriceId;
  const shouldArchiveYearly = currentPrice?.yearlyPriceId && yearlyPriceId !== currentPrice.yearlyPriceId;

  await Promise.all([
    shouldArchiveMonthly ? cbStripeClient.updatePrice(currentPrice.monthlyPriceId, { active: false }) : null,
    shouldArchiveYearly ? cbStripeClient.updatePrice(currentPrice?.yearlyPriceId || '', { active: false }) : null,
  ]);
}

async function getStripePrices(
  price: PriceConfiguration,
  productName: string,
  currentPrice?: AssistantPrice
): Promise<StripePriceConfiguration> {
  try {
    const [exchangeRates, stripeProductId] = await Promise.all([
      getExchangeRates(price.currency),
      getProductId(productName, currentPrice),
    ]);

    const basePayload = { price, exchangeRates, product: stripeProductId };

    const [newMonthly, newYearly] = await createNewPrices(price as PriceConfiguration, basePayload, currentPrice);
    newMonthly && (await cbStripeClient.updateProduct(stripeProductId, { default_price: newMonthly.id }));

    const data = {
      stripeProductId,
      monthlyPriceId: newMonthly?.id || currentPrice?.monthlyPriceId || '',
      yearlyPriceId: price.yearly ? newYearly?.id || currentPrice?.yearlyPriceId : null,
    };

    currentPrice && (await archiveOldPrices(data, currentPrice));

    return data;
  } catch (error: any) {
    console.error(`[priceActions] Error getting stripe product and prices data for ${productName}:`, error);
    throw new Error('[priceActions] Error getting stripe product and prices data', error);
  }
}

export async function setPrice(
  assistant: Assistant,
  newPriceData: Partial<PriceConfiguration>,
  currentPrice?: AssistantPrice
): Promise<State<PriceConfiguration | null>> {
  try {
    const parsed = stripePriceSchema.safeParse(newPriceData);
    if (!parsed.success) return { error: parsed.error.message, value: null };

    const price = parsed.data;
    const stripeData = await getStripePrices(price as PriceConfiguration, assistant.name, currentPrice);

    return await updateAssistantMetaPrice(assistant, { ...price, ...stripeData });
  } catch (error: any) {
    if (isMissingProductError(error)) {
      console.warn(`[priceActions] Product missing for ${assistant.name}, recreating...`);
      return await setPrice(assistant, newPriceData);
    }

    console.error(`[priceActions] Failed set price data for assistant ${assistant.id}:`, error);
    return { error: 'General.errors.unexpectedError', value: null };
  }
}
