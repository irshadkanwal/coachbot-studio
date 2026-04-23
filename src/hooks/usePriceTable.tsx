import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { PriceCard, PriceHeader, TrialBanner } from '@/app/(standalone)/checkout/_components/PriceTableElements';
import { Price, PriceInterval } from '@/lib/models/checkout.models';
import { Column } from '@/shared/Table';

enum MainPriceRows {
  name = 'name',
  price = 'price',
  action = 'action',
  trial = 'trial',
  feature = 'Feature',
}

const mainPriceRows = [
  { key: MainPriceRows.name, name: 'Checkout.Prices.titles.0' },
  { key: MainPriceRows.price, name: 'Checkout.Prices.titles.1' },
  { key: MainPriceRows.action, name: 'Checkout.Prices.titles.2' },
  { key: MainPriceRows.trial, name: 'Checkout.Prices.titles.3' },
];

const classNames = {
  th: 'text-start px-5 py-4 md:px-7 align-baseline',
  td: 'text-wrap text-sm text-main py-0 min-h-0 px-2 text-wrap',
};

export interface PriceTableData {
  name: string;
  [key: string]: boolean | string | number;
}

export interface UsePriceTableProps {
  priceList: Price[];
  onSubscribe?: (price: Price, currency: string) => any;
  type: 'prices' | 'features';
  interval?: PriceInterval;
  currency?: string;
}

type Feature = { feature: string; value: string | boolean; planName?: string };

const parseFeature = (raw: string): Feature => {
  const match = raw.match(/^\s*\[([^\]]+)\]\s*\((.+)\)/);
  const [_, feature, rowValue] = match || [];
  const formatedValue = rowValue?.trim().toLowerCase() ?? '';
  const value = formatedValue === 'yes' ? true : formatedValue === 'no' ? false : rowValue.trim();

  return {
    feature: feature.trim() ?? '',
    value: value ?? false,
  };
};

const getFeatures = (priceList: Price[]): PriceTableData[] => {
  const featureMap = new Map<string, PriceTableData>();

  priceList.forEach(({ name: planName, marketing_features }) => {
    marketing_features.forEach(({ name }) => {
      const { feature = '', value } = parseFeature(name);

      !featureMap.has(feature) && featureMap.set(feature, { name: feature });
      featureMap.get(feature)![planName] = value;
    });
  });

  return Array.from(featureMap.values());
};

const getData = (priceList: Price[], type: 'prices' | 'features', t: any) => {
  if (type === 'prices') return mainPriceRows.map((item) => ({ ...item, name: t(item.name) }));

  const allFeatures = getFeatures(priceList);
  const headerRow: PriceTableData = priceList.reduce((row: any, { name }) => ({ ...row, [name]: name }), {
    name: '',
    key: MainPriceRows.feature,
  });

  return [headerRow, ...allFeatures];
};

export const usePriceTable = ({ priceList, onSubscribe, type, interval, currency }: UsePriceTableProps) => {
  const t = useTranslations();

  return useMemo(() => {
    const data: PriceTableData[] = getData(priceList, type, t);
    const columns: Column<PriceTableData>[] = [
      {
        key: 'name' as const,
        label: 'Name',
        cellClassName: `w-1/6 min-w-52 pb-2 text-start border-b border-b-graphic/[16%] ${classNames.td}`,
      },
      ...priceList.map((price, index) => {
        const isPopular = price.product.metadata.isPopular;

        return {
          key: price.product.name,
          label: price.product.name,
          cellClassName: `${classNames.td} has-[.feature]:align-bottom`,
          renderCell: (value: any, row: PriceTableData, isLoading?: boolean) => {
            if (row.key === MainPriceRows.trial) return <TrialBanner />;
            if (row.key === MainPriceRows.feature)
              return (
                <PriceHeader
                  price={price}
                  className={`feature relative h-fit self-end rounded-t-xl border border-graphic/[16%] ${isPopular ? 'border-storm-gray bg-white-opacity pt-10' : 'bg-light-opacity pt-6'}`}
                />
              );
            if (row.key === MainPriceRows.name)
              return (
                <PriceCard
                  price={price}
                  isLoading={isLoading}
                  interval={interval}
                  onSubscribe={onSubscribe}
                  currency={currency}
                />
              );

            return (
              <div
                className={`flex size-full items-center justify-center border-x border-b border-graphic/[16%] py-3 text-center text-base ${isPopular ? 'popular border-x-storm-gray bg-white-opacity' : 'bg-light-opacity'}`}
              >
                {typeof value === 'string' ? (
                  <span className="px-1 leading-7 text-dark-aquamarine">{value}</span>
                ) : (
                  <i
                    className={
                      value
                        ? 'cbi-tick-circle !text-xl text-dark-aquamarine'
                        : 'cbi-close-circle !text-xl text-light-gray'
                    }
                  />
                )}
              </div>
            );
          },
          getRowspan: (row: PriceTableData) => {
            if (type !== 'prices' || row.key === MainPriceRows.trial) return 1;

            return row.key === MainPriceRows.name ? data.length - 1 : 0;
          },
          getColspan: (row: PriceTableData) => (row.key === MainPriceRows.trial && index === 0 ? priceList.length : 1),
        } as Column<PriceTableData>;
      }),
    ];
    return { data, columns };
  }, [priceList, currency]);
};
