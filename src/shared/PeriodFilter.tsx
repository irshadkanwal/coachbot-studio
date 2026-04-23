'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Period } from '@/lib/models/common.models';
import { RadioGroup } from './RadioGroup';

export const periodOptions = [
  { id: 0, value: Period.allTime, labelKey: 'Dashboard.periodOptions.0' },
  { id: 1, value: Period.last7Days, labelKey: 'Dashboard.periodOptions.1' },
  { id: 2, value: Period.last30Days, labelKey: 'Dashboard.periodOptions.2' },
];

export function PeriodFilter({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPeriod, setSelectedPeriod] = useState(searchParams.get('period') || Period.allTime);

  const handleChange = (period: Period) => {
    setSelectedPeriod(period);
    const params = new URLSearchParams(searchParams.toString());

    period === Period.allTime ? params.delete('period') : params.set('period', period);

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setSelectedPeriod(searchParams.get('period') || Period.allTime);
  }, [searchParams]);

  return (
    <RadioGroup
      disabled={disabled}
      options={periodOptions}
      selected={selectedPeriod}
      setSelected={handleChange}
      className="w-full gap-x-1"
      variant="white"
    />
  );
}
