import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { Subscription } from '@/lib/models/checkout.models';
import {
  getCancelSubscriptionData,
  getUpdatedSubscriptionData,
  updateSubscriptionData,
} from '@/server/actions/checkoutActions';
import { stripeClient } from '@/server/db/stripeClient';
import { getUserSubscription } from '@/server/db/userClient';

enum StripeEvent {
  CUSTOMER_SUBSCRIPTION_CREATED = 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_PAUSED = 'customer.subscription.paused',
  CUSTOMER_SUBSCRIPTION_DELETED = 'customer.subscription.deleted',
  CUSTOMER_DELETED = 'customer.deleted',
}

export async function POST(req: NextRequest) {
  let event;

  try {
    const bodyArrayBuffer = await req.arrayBuffer();
    const body = Buffer.from(bodyArrayBuffer);
    const signature = req.headers && req.headers.get('stripe-signature');
    event = await stripeClient.getWebhook(body, signature || '');

    if (!event?.data.object) {
      return new NextResponse(JSON.stringify({ error: `Stripe webhook construct error` }), { status: 400 });
    }

    const eventData: any = event?.data.object;
    let subscriptionData, cancelSubscription;

    switch (event.type) {
      case StripeEvent.CUSTOMER_SUBSCRIPTION_CREATED:
      case StripeEvent.CUSTOMER_SUBSCRIPTION_UPDATED:
      case StripeEvent.CUSTOMER_SUBSCRIPTION_PAUSED:
        if (!!eventData.metadata.current_active && eventData.metadata.current_active !== eventData.id) {
          cancelSubscription = eventData.metadata.current_active;
        }

        subscriptionData = await getUpdatedSubscriptionData(eventData as Stripe.Subscription);
        break;
      case StripeEvent.CUSTOMER_SUBSCRIPTION_DELETED:
        const existingSubscription = await getUserSubscription(eventData.customer, eventData.id);

        if (existingSubscription) subscriptionData = await getCancelSubscriptionData(eventData);
        break;
      case StripeEvent.CUSTOMER_DELETED:
        await updateSubscriptionData(eventData.id as string, {} as any, true);
        break;
      default:
        break;
    }

    subscriptionData && (await updateSubscriptionData(subscriptionData.customerId, subscriptionData as Subscription));
    cancelSubscription && (await stripeClient.cancelSubscription(cancelSubscription));

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error(`[stripeWebhook] Error during processing stripe webhook for event ${event?.type}:`, error);

    return new NextResponse(JSON.stringify({ error: `Stripe webhook error: ${error.message}` }), { status: 400 });
  }
}
