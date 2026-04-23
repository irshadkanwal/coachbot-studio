'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { normalizeSearchParams } from '@/lib/utils/common.utils';
import ListSearchBar from '../../../_components/ListSearchBar';

enum SubscriptionSort {
  newest = 'asc',
  oldest = 'desc',
}

enum SubscriptionFilter {
  all = 'all',
  month = 'month',
  year = 'year',
}

const filterOptions = [
  { id: 0, value: SubscriptionFilter.all, labelKey: 'CoachDetails.Revenue.subscriptions.filterOptions.0' },
  { id: 1, value: SubscriptionFilter.month, labelKey: 'CoachDetails.Revenue.subscriptions.filterOptions.1' },
  { id: 2, value: SubscriptionFilter.year, labelKey: 'CoachDetails.Revenue.subscriptions.filterOptions.2' },
];

const sortOptions = [
  { id: 0, value: SubscriptionSort.newest, labelKey: 'CoachDetails.Revenue.subscriptions.sortOptions.0' },
  { id: 1, value: SubscriptionSort.oldest, labelKey: 'CoachDetails.Revenue.subscriptions.sortOptions.1' },
];

const ALLOWED_KEYS = ['sort', 'interval'];

export default function SubscriptionsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSortOption = useMemo(() => {
    const sortValue = searchParams?.get('sort') || SubscriptionSort.newest;

    return sortOptions.find(({ value }) => value === sortValue);
  }, [searchParams]);

  const selectedFilterOption = useMemo(() => {
    const sortValue = searchParams?.get('interval') || SubscriptionFilter.all;

    return filterOptions.find(({ value }) => value === sortValue);
  }, [searchParams]);

  const normalizedQuery = useMemo(() => normalizeSearchParams(searchParams, ALLOWED_KEYS), [searchParams]);

  const createQueryString = useCallback(
    (name: 'sort' | 'interval', value: string, ignoreValue: string[] = []) => {
      const query = new URLSearchParams(normalizedQuery);

      value && !ignoreValue.includes(value) ? query.set(name, value) : query.delete(name);

      return query.toString();
    },
    [normalizedQuery]
  );

  useEffect(() => {
    const url = normalizedQuery ? `${pathname}?${normalizedQuery}` : pathname;
    router.replace(url, { scroll: false });
  }, []);

  return (
    <ListSearchBar
      sortSelectedValue={selectedSortOption?.value}
      filterSelectedValue={selectedFilterOption?.value}
      sortOptions={sortOptions}
      filterOptions={filterOptions}
      searchEnabled={false}
      onSortChanged={({ value }) => router.push(pathname + '?' + createQueryString('sort', value))}
      onFilterChanged={({ value }) =>
        router.push(pathname + '?' + createQueryString('interval', value, [SubscriptionFilter.all]))
      }
    />
  );
}
