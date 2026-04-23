import { getLocaleDate } from './date.utils';

export function filterArray<T extends { id: any }>(values: T[], targteId: any): T[] {
  return values.filter(({ id }) => id !== targteId);
}

export function upsertArrayItem<T extends { id: any }>(values: T[], newValue: T): T[] {
  const existingItem = values.map(({ id }) => id).includes(newValue.id);

  return existingItem ? values.map((value) => (value.id === newValue.id ? newValue : value)) : [...values, newValue];
}

export function getArraysInterseptions<T extends { id: any }>(values1: T[], values2: T[]): T[] {
  return values1.filter((value1) => values2.some((value2) => value2.id === value1.id));
}

export function getArraysDiff<T extends { id: any }>(values1: T[], values2: T[]): T[] {
  return values1.filter((value1) => !values2.some((value2) => value2.id === value1.id));
}

export function getUniqueArray<T extends { id: any }>(values: T[]): T[] {
  const seen = new Set<string | number>();

  return values.filter((value: T) => {
    if (seen.has(value.id)) return false;

    seen.add(value.id);
    return true;
  });
}

export function filterByDayDateField<T>(
  values: T[],
  field: keyof T,
  minDate: Date | string | number,
  locale = 'en-US'
) {
  const min = getLocaleDate(minDate.toString(), locale).startOf('day');

  return values.filter((v) => getLocaleDate(String(v[field]), locale).startOf('day').toMillis() >= min.toMillis());
}
