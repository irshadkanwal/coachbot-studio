'use client';

import { memo, ReactNode, use, useCallback, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { usePriceTable } from '@/hooks/usePriceTable';
import { Price, PriceCurrency, PriceInterval } from '@/lib/models/checkout.models';
import { cancelUserSubscription, createUserCheckoutSession } from '@/server/actions/checkoutActions';
import { Table } from '@/shared/Table';
import { IntervalSwitcher } from './IntervalSwitcher';
import PricesCards from './PricesCards';
import PricingConfigTable from './PricingConfigPanel';

const getIntervalPrices = (value: PriceInterval, prices: Price[]) =>
  prices.filter(({ interval }: Price) => interval != null && interval === value);

const MainPricesTable = memo(function MainPricesTable({
  prices,
  currency,
  onSubscribe,
  interval,
  isLoading,
}: {
  prices: Price[];
  currency: string;
  className?: string;
  isLoading?: boolean;
  interval: PriceInterval;
  onSubscribe: (price: Price, currency: string) => any;
}) {
  const { data, columns } = usePriceTable({ priceList: prices, onSubscribe, type: 'prices', interval, currency });

  return (
    <div className="flex flex-grow border-b border-storm-gray">
      <Table
        isLoading={isLoading}
        data={data}
        columns={columns}
        headersClass="hidden"
        bodyClassName={'[&>tr:last-child>td]:border-none '}
      />
    </div>
  );
});

const FeaturesTable = memo(function FeaturesTable({ prices }: { prices: Price[]; className?: string }) {
  const { data, columns } = usePriceTable({ priceList: prices, type: 'features' });

  return (
    <Table
      data={data}
      columns={columns}
      headersClass="hidden"
      bodyClassName={
        '[&>tr:last-child>td]:border-none [&>tr:last-child>td>div]:rounded-b-xl [&>tr:last-child>td>div.popular]:border-b-storm-gray [&>tr:last-child>td]:align-top  [&>tr:last-child>td>div]:h-fit [&>tr:last-child>td>div]:pb-6 [&>tr:last-child>td>div.popular]:pb-10'
      }
      tableClassName="h-full"
    />
  );
});

export default function PricesTable({
  prices$,
  className,
}: {
  prices$: Promise<Price[]>;
  className?: string;
  children?: ReactNode;
  isLoading?: boolean;
}) {
  const prices = use(prices$);
  const [currency, setCurrency] = useState<string>(PriceCurrency.eur);
  const [interval, setInterval] = useState<PriceInterval>(PriceInterval.Month);
  const [isLoading, setIsLoading] = useState(false);

  const priceList = useMemo(() => getIntervalPrices(interval, prices), [prices, interval]);

  const onSubscribe = useCallback(async (price: Price, currency: string) => {
    try {
      setIsLoading(true);

      const sessionUrl = price.isActive
        ? await cancelUserSubscription()
        : await createUserCheckoutSession(price, currency);

      if (sessionUrl) window.location.href = sessionUrl;
    } catch (error: any) {
      console.error('[priceTable] Subscription error:', error);
      alert('Failed to update subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <section className={twMerge('flex flex-col items-center justify-center gap-y-7 pt-0 sm:p-0 lg:p-10', className)}>
      <IntervalSwitcher defaultInterval={PriceInterval.Month} onIntervalChange={setInterval} />
      <PricingConfigTable currency={currency} onChange={(value: string) => setCurrency(value)} prices={prices} />
      <div className="mb-10 block sm:hidden">
        <PricesCards
          prices={prices}
          interval={interval}
          currency={currency as PriceCurrency}
          onSubscribe={onSubscribe}
          isLoading={isLoading}
        />
      </div>
      <div className="mb-10 hidden sm:block">
        <MainPricesTable
          prices={priceList}
          interval={interval}
          onSubscribe={onSubscribe}
          isLoading={isLoading}
          currency={currency}
        />
        <FeaturesTable prices={priceList} />
      </div>
    </section>
  );
}
