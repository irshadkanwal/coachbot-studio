'use client';

import { useCallback, useState } from 'react';

import { PriceInterval } from '@/lib/models/checkout.models';
import { RadioGroup } from '@/shared/RadioGroup';

export const intervalOptions = [
  {
    id: 0,
    value: PriceInterval.Year,
    labelKey: 'Checkout.priceTable.interval.yearly',
    icon: 'cbi-calendar-circle !text-xl',
  },
  {
    id: 1,
    value: PriceInterval.Month,
    labelKey: 'Checkout.priceTable.interval.monthly',
    icon: 'cbi-calendar',
  },
];

interface IntervalSwitcherProps {
  defaultInterval?: PriceInterval;
  onIntervalChange?: (interval: PriceInterval) => void;
}

export function IntervalSwitcher({ defaultInterval = PriceInterval.Month, onIntervalChange }: IntervalSwitcherProps) {
  const [interval, setInterval] = useState(defaultInterval);

  const handleIntervalChange = useCallback((newInterval: PriceInterval) => {
    setInterval(newInterval);
    onIntervalChange?.(newInterval);
  }, []);

  return (
    <RadioGroup
      options={intervalOptions}
      selected={interval}
      setSelected={handleIntervalChange}
      optionClassName="px-3 py-2 md:text-lg sm:text-base rounded-xl text-center capitalize bg-transparent data-[checked]:bg-main data-[checked]:text-background"
      className="gap-x-1 rounded-xl bg-graphic/[14%] p-1 text-sm font-medium backdrop-blur-sm"
      variant="white"
    />
  );
}
