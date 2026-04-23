import { PriceConfiguration } from './assistant.models';
import { User } from './common.models';

export interface PriceCurrencyOption {
  custom_unit_amount?: number | null;
  tax_behavior: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

export interface Price {
  id: string;
  amount: number;
  currency: string;
  product: any;
  interval: string;
  name: string;
  description: string;
  marketing_features: { name: string }[];
  isActive: boolean;
  currency_options: Record<string, PriceCurrencyOption>;
}

export enum PriceInterval {
  Month = 'month',
  Year = 'year',
}

export enum SubscriptionStatus {
  active = 'active',
  trialing = 'trialing',
  canceled = 'canceled',
  paused = 'paused',
  unpaid = 'unpaid',
  past_due = 'past_due',
  incomplete = 'incomplete',
  incomplete_expired = 'incomplete_expired',
}

export interface Subscription {
  id: string;
  subscriptionId: string | null;
  customerId: string;
  name: string | null;
  status: SubscriptionStatus | string;
  canceledAt: Date | null;
  coaches: string | null;
  analytics: string | null;
  allowedIntegration: boolean | null;
  trialDays: string | null;
  trialUsed?: boolean | null;
  userId: string;
  user?: User;
}

export enum PriceCurrency {
  usd = 'usd',
  eur = 'eur',
  gbp = 'gbp',
  aud = 'aud',
  cad = 'cad',
}

export enum Currency {
  eur = '€',
}

export enum PriceRecuringPeriod {
  month = 'month',
  year = 'year',
}

export interface PriceBasePayload {
  price: Pick<PriceConfiguration, 'currency' | 'monthly' | 'yearly'>;
  exchangeRates: Record<PriceCurrency, number>;
  product?: string;
}
