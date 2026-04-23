import { Price, PriceCurrency, PriceInterval } from '../../../../lib/models/checkout.models';
import { PriceCard, TrialBanner } from './PriceTableElements';

interface PricesCardsProps {
  prices: Price[];
  interval: PriceInterval;
  currency: PriceCurrency;
  onSubscribe: (price: Price, currency: string) => any;
  isLoading: boolean;
}

export default function PricesCards({ prices, interval, currency, onSubscribe, isLoading }: PricesCardsProps) {
  const filteredPrices = prices.filter((price) => price.interval === interval);

  return (
    <div>
      <div className="mb-10 flex flex-col items-center gap-4 md:flex-row">
        {filteredPrices.map((price) => (
          <div key={price.id} className="w-full text-center">
            <PriceCard
              price={price}
              interval={interval}
              currency={currency}
              options={true}
              onSubscribe={onSubscribe}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>

      <TrialBanner className="!rounded-[39px]" />
    </div>
  );
}
