import Stripe from 'stripe';

import { PrivateRoutes } from '@/lib/constants';
import { PriceCurrency, Subscription, SubscriptionStatus } from '@/lib/models/checkout.models';
import { User } from '@/lib/models/common.models';
import { isActiveSubscription, isTrialSubscription, withoutTrailingSlash } from '@/lib/utils/common.utils';

class StripeClient {
  private static instances = new Map<string, StripeClient>();
  private _stripe: Stripe | null = null;
  private _envKey: string;

  private constructor(envKey: string) {
    this._envKey = envKey;
  }

  public static getInstance(envKey: string): StripeClient {
    if (!envKey) {
      throw new Error('[StripeClient] envKey is required.');
    }

    if (!this.instances.has(envKey)) {
      this.instances.set(envKey, new StripeClient(envKey));
    }

    return this.instances.get(envKey)!;
  }

  private get secretKey(): string {
    const secretKey = !!this._envKey && process.env[this._envKey];

    if (!secretKey || !secretKey.startsWith('sk_')) {
      throw new Error(`[StripeClient] Invalid or missing secret key env variable: ${this._envKey}`);
    }

    return secretKey;
  }

  private get stripe(): Stripe {
    if (!this._stripe) {
      this._stripe = new Stripe(this.secretKey, {
        apiVersion: '2025-06-30.basil',
        typescript: true,
      });
    }

    return this._stripe;
  }

  public async getSubscriptionData(id?: string | null): Promise<Stripe.Subscription | null> {
    try {
      if (!id) return null;

      const subscription = await this.stripe.subscriptions.retrieve(id, { expand: ['items.data.price.product'] });

      return subscription;
    } catch (error) {
      console.error(`[stripeClient] Error getting subscription ${id} data:`, error);
      return null;
    }
  }

  public async getAllPrices(): Promise<{ data: Stripe.Price[] }> {
    try {
      return this.stripe.prices.list({ active: true, expand: ['data.product', 'data.currency_options'], limit: 100 });
    } catch (error) {
      console.error(`[stripeClient] Error getting price list:`, error);
      return { data: [] };
    }
  }

  public async getCustomerByEmail(email: string) {
    try {
      return this.stripe.customers.search({ query: `email:'${email}'`, expand: ['data.subscriptions'] });
    } catch (error) {
      console.error(`[stripeClient] Error fetching customer by email ${email}:`, error);
      throw new Error('Could not fetch customer by email');
    }
  }

  public async getStripeCustomer(email: string, name?: string) {
    try {
      const { data } = await this.getCustomerByEmail(email);

      return data[0] || (await this.stripe.customers.create({ email, name }));
    } catch (error) {
      console.error(`[stripeClient] Error creating customer for email ${email}:`, error);
      throw new Error('Could not create customer');
    }
  }

  public async getStripeActiveSubscriptionByEmail(email: string) {
    try {
      const allSubscriptions = await this.getAllStripeSubscriptionByEmail(email);

      return allSubscriptions.find(({ status }) =>
        [SubscriptionStatus.active, SubscriptionStatus.trialing].includes(status as any)
      );
    } catch (error) {
      console.error(`[stripeClient] Error getting subscription by email ${email}:`, error);
      throw new Error('Could not get customer subscription');
    }
  }

  public async createSubscription(customer: string, price: string, trial_period_days?: number) {
    try {
      return this.stripe.subscriptions.create({
        customer,
        items: [{ price }],
        trial_period_days,
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        },
      });
    } catch (error: any) {
      console.error(
        `[stripeClient] Error during creating subscription with trial ${trial_period_days} for customer ${customer}:`,
        error
      );

      throw new Error('[stripeClient] Could not create subscription with trial');
    }
  }

  public async getSubscriptionProduct(subscription: any) {
    try {
      return this.stripe.products.retrieve(subscription.plan.product);
    } catch (error) {
      console.error(`[stripeClient] Error fetching product ${subscription.plan.product}:`, error);
      throw new Error('Could not fetch subscription product');
    }
  }

  public async getWebhook(payload: string | Buffer, header: string | Buffer | string[]) {
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET is missing');

      return this.stripe.webhooks.constructEvent(payload, header, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      console.error(`[stripeClient] Error in constructing webhook event:`, error);
      throw new Error('Could not construct webhook event');
    }
  }

  public async cancelSubscription(subscriptionId: string, comment?: string) {
    try {
      return await this.stripe.subscriptions.cancel(subscriptionId, {
        cancellation_details: {
          comment:
            comment ||
            `[studio webhook] Canceled subscription (${subscriptionId}) as it is no longer active due to a new purchase.`,
        },
      });
    } catch (error) {
      console.error(`[stripeClient] Error canceling subscription ${subscriptionId}:`, error);
      return null;
    }
  }

  public async deleteCustomer(userId?: string) {
    try {
      if (!userId) return;
      return await this.stripe.customers.del(userId);
    } catch (error) {
      console.error(`[stripeClient] Error deleting customer ${userId}:`, error);
      return null;
    }
  }

  public async createCheckoutSession(
    priceId: string,
    currency: string = 'eur',
    subscription?: Subscription,
    trial_period_days?: number
  ) {
    try {
      const metadata =
        subscription && isActiveSubscription(subscription)
          ? { current_active: subscription.subscriptionId }
          : undefined;

      return this.stripe.checkout.sessions.create({
        currency: isActiveSubscription(subscription) ? undefined : currency,
        customer: subscription?.customerId,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        allow_promotion_codes: true,
        success_url: `${withoutTrailingSlash(process.env.APP_BASE_URL)}${PrivateRoutes.chat}?success=true`,
        cancel_url: `${withoutTrailingSlash(process.env.APP_BASE_URL)}${PrivateRoutes.checkout}`,
        subscription_data: { metadata, trial_period_days },
        automatic_tax: {
          enabled: true,
        },
        tax_id_collection: {
          enabled: true,
        },
        customer_update: subscription?.customerId
          ? {
              name: 'auto',
              address: 'auto',
            }
          : undefined,
        consent_collection: {
          terms_of_service: 'required',
        },
        custom_text: {
          terms_of_service_acceptance: {
            message:
              "I agree to the Coachbot AI GmbH's [Terms of Service](https://www.coachbot.ai/legal/terms-of-service)",
          },
        },
      });
    } catch (error) {
      console.error(`[stripeClient] Error creating checkout session:`, error);
      throw new Error('Failed to create checkout session');
    }
  }

  public async checkTrialSubscriptions({ email }: User) {
    const allSubscriptions = await this.getAllStripeSubscriptionByEmail(email);

    return allSubscriptions.some((subscription) => isTrialSubscription(subscription, process.env.STRIPE_FREE_PRICE));
  }

  public async createProduct(name: string, data?: Stripe.ProductCreateParams.DefaultPriceData | null) {
    return this.stripe.products.create({ name, default_price_data: data || undefined });
  }

  public async updateProduct(id: string, params: Stripe.ProductUpdateParams) {
    return this.stripe.products.update(id, params);
  }

  public async createPrice(data: Stripe.PriceCreateParams | null) {
    if (!data) return null;

    return this.stripe.prices.create(data);
  }

  public async updatePrice(id: string, data: Stripe.PriceUpdateParams | null) {
    if (!data) return null;

    return this.stripe.prices.update(id, data);
  }

  public async getExchangeRates(baseCurrency: PriceCurrency) {
    // TODO: refactor to SDK usage, after stripe 14.0.0 will be released
    const form = new URLSearchParams();

    form.append('to_currency', baseCurrency);
    form.append('lock_duration', 'none');
    Object.keys(PriceCurrency).forEach(
      (currency) => currency !== baseCurrency && form.append('from_currencies[]', currency)
    );

    const res = await fetch('https://api.stripe.com/v1/fx_quotes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env[this._envKey]}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2025-06-30.basil; fx_quote_preview=v1',
      },
      body: form,
    });

    const quote = await res.json();

    return Object.entries(quote.rates as Record<PriceCurrency, { exchange_rate: number }>).reduce(
      (exchageRates, [key, value]) => ({ ...exchageRates, [key]: value.exchange_rate }),
      {} as Record<PriceCurrency, number>
    );
  }

  private async getAllStripeSubscriptionByEmail(email: string): Promise<Stripe.Subscription[]> {
    try {
      const { data } = await this.getCustomerByEmail(email);

      if (!data?.length) return [];

      const subscriptions = await this.stripe.subscriptions.list({
        customer: data[0].id,
        status: 'all',
        limit: 100,
      });

      return subscriptions.data;
    } catch (error) {
      console.error(`[stripeClient] Error getting all subscription by email ${email}:`, error);
      throw new Error('Could not get all customer subscriptions');
    }
  }
}

export const stripeClient = StripeClient.getInstance('STRIPE_SECRET_KEY');
export const cbStripeClient = StripeClient.getInstance('CB_STRIPE_SECRET_KEY');
