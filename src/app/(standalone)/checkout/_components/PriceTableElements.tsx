import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { Price, PriceCurrency, PriceInterval } from '@/lib/models/checkout.models';
import { toBoolean } from '@/lib/utils/data.utils';
import { formatPrice } from '@/lib/utils/price.utils';
import { Button } from '@/shared/Button';
import { Chip } from '@/shared/Chip';
import ComingSoon from '@/shared/CoomingSoon';
import { Spinner } from '@/shared/Loaders';
import { DeleteWithConfirmationButton } from '@/shared/ModalButtons';
import { CollapsibleFeatureList } from './FeatureList';

export enum Currency {
  eur = '€',
}

const modalConfig = {
  titleKey: 'Checkout.priceTable.unsubscribeModal.title',
  buttonTitleKey: `Checkout.priceTable.unsubscribeModal.buttonTitle`,
  variant: 'red',
  cancelButtonTitleKey: `Checkout.priceTable.unsubscribeModal.cancelButton`,
};

export function PriceHeader({
  price,
  withDescription,
  className,
}: {
  price: Price;
  withDescription?: boolean;
  className?: string;
}) {
  const t = useTranslations();
  const { isPopular, inDevelopment } = price.product.metadata;

  return (
    <div className={twMerge(`flex w-full flex-col gap-y-2.5 border-b border-b-graphic/[16%] pb-4`, className)}>
      <h2 className="flex flex-wrap items-center justify-center gap-x-2 text-[1.4rem] font-bold uppercase leading-7 text-main 2xl:flex-nowrap">
        {price.name} {toBoolean(inDevelopment) && <ComingSoon className="text-nowrap p-0" onlyLabel={true} />}
      </h2>
      {withDescription && <p className={'text-wrap text-base leading-5 text-light-gray'}>{price.description}</p>}

      {isPopular && (
        <Chip
          className="absolute right-1.5 top-1.5"
          variant="aquamarine"
          size="s"
          text={t('Checkout.priceTable.mostPopularLabel')}
          textClassName="bg-yellow-green-gradient text-sm py-0 px-3 rounded-full font-medium text-background"
        />
      )}
    </div>
  );
}

export const PriceCell = memo(function PriceCell({
  price,
  interval,
  currency,
}: {
  price: Price;
  interval: PriceInterval;
  currency: string;
}) {
  const t = useTranslations();
  const { customPrice } = price.product.metadata;
  const isEnterprise = price.name.toLowerCase().includes('enterprise');
  const hasCustomPrice = toBoolean(customPrice) || isEnterprise;

  // If Enterprise or custom price, don't show price (button handles contact)
  const amount = price.currency_options?.[currency]?.unit_amount;
  if (hasCustomPrice || !amount) {
    return null;
  }

  const amountInCurrency = amount / 100;
  const annualPrice = interval === PriceInterval.Year ? amountInCurrency : amountInCurrency * 12;
  const monthlyPrice = interval === PriceInterval.Year ? amountInCurrency / 12 : amountInCurrency;

  return (
    <div className="flex min-h-0 flex-col gap-y-2">
      <p className={'text-lg font-medium text-main'}>
        <span className="text-5xl text-yellow">{formatPrice({ amount: monthlyPrice, currency })}</span> /
        {t('Checkout.Prices.monthlyLabel')}
      </p>
      {interval === PriceInterval.Year && (
        <span className="text-base text-light-gray">
          {t('Checkout.Prices.annuallyLabel', { price: formatPrice({ amount: annualPrice, currency }) })}
        </span>
      )}
    </div>
  );
});

export const ButtonCell = memo(function ButtonCell({
  onClick,
  isActive,
  isLoading,
  contactButton,
  name,
}: {
  onClick: () => void;
  isActive: boolean;
  isLoading?: boolean;
  name: string;
  contactButton?: boolean;
}) {
  const t = useTranslations();

  if (contactButton) {
    return (
      <Button
        variant="solid"
        color="light"
        className={'w-full max-w-80 text-nowrap px-3 py-2 text-xl'}
        href="mailto:support@coachbot.ai?subject=Enterprise Subscription&cc=lewin@coachbot.ai"
      >
        {t('Checkout.priceTable.contactUsButton')}
      </Button>
    );
  }

  return isActive ? (
    <DeleteWithConfirmationButton
      buttonText={t('Checkout.priceTable.activePlanButton')}
      iconClassName="cbi-none"
      className={twMerge(
        'w-full max-w-80 text-nowrap border border-yellow px-3 py-2 text-xl text-yellow hover:bg-main hover:text-background'
      )}
      config={{ ...modalConfig, confirm: onClick }}
    >
      <p className="text-main">{t('Checkout.priceTable.unsubscribeModal.contentKey', { name })}</p>
    </DeleteWithConfirmationButton>
  ) : (
    <Button
      variant="solid"
      color="primary"
      className={twMerge(
        'w-full max-w-80 text-nowrap px-3 py-2 text-xl text-white',
        isLoading && 'animate-pulsew pointer-events-none'
      )}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? <Spinner withText={true} /> : t('Checkout.priceTable.unlockButton')}
    </Button>
  );
});

export const PriceCard = memo(function PriceCard({
  price,
  currency = PriceCurrency.eur,
  isLoading,
  interval = PriceInterval.Month,
  onSubscribe,
  options = false,
}: {
  price: Price;
  currency?: string;
  isLoading?: boolean;
  interval?: PriceInterval;
  onSubscribe?: (price: Price, currency: string) => any;
  options?: boolean;
}) {
  const { isPopular, customPrice, inDevelopment } = price.product.metadata;

  return (
    <div
      className={twMerge(
        'relative flex flex-grow flex-col items-center gap-y-7 rounded-2xl border border-background-border/[16%] bg-light-opacity p-6',
        isPopular && 'border-storm-gray bg-white-opacity py-10 pt-0'
      )}
    >
      <PriceHeader price={price} withDescription={true} className={isPopular && 'pt-10'} />
      <PriceCell price={price} interval={interval} currency={currency} />
      <ButtonCell
        name={price.name}
        isActive={price.isActive}
        onClick={() => onSubscribe?.(price, currency)}
        isLoading={isLoading}
        contactButton={
          toBoolean(customPrice) || toBoolean(inDevelopment) || price.name.toLowerCase().includes('enterprise')
        }
      />
      {options && <CollapsibleFeatureList features={price.marketing_features} />}
    </div>
  );
});

export const TrialBanner = memo(function TrialBanner({ className }: { className?: string }) {
  const t = useTranslations();

  return (
    <div
      className={twMerge(
        'relative my-3.5 flex flex-grow flex-col items-center gap-y-1 rounded-full bg-white-opacity p-3',
        className
      )}
    >
      <h3 className="text-xl font-semibold text-dark-aquamarine">{t('Checkout.priceTable.trialBanner.title')}</h3>
      <p className="inline-flex items-center gap-x-1 text-sm leading-4 text-light-gray">
        <i className="cbi-card-tick !text-sm"></i>
        {t('Checkout.priceTable.trialBanner.description')}
      </p>
    </div>
  );
});
