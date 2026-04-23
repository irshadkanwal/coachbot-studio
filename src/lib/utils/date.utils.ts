import { DateTime } from 'luxon';

import { Period } from '../models/common.models';

const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30;
const DAYS_IN_YEAR = 365;
const DAYS_IN_TWO_YEARS = 730;
const MAX_RELATIVE_DAYS = 30;

export const getLocaleDate = (rawDate: string | Date, locale = 'en-US') =>
  DateTime.fromJSDate(new Date(rawDate)).setLocale(locale);

export const getFormatedDate = (
  rawDate: string | Date,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string => {
  return getLocaleDate(rawDate, locale).toLocaleString(options);
};

export const getDateWeekDay = (rawDate: string | Date, locale: string = 'en-US'): string => {
  return getLocaleDate(rawDate, locale).toFormat('cccc'); // full weekday name
};

export const getDateDay = (rawDate: string | Date, locale: string = 'en-US'): string => {
  return getLocaleDate(rawDate, locale).toFormat('LLLL d'); // e.g., August 7
};

export const getTime = (rawDate: string | Date, locale: string = 'en-US'): string => {
  return getLocaleDate(rawDate, locale).toFormat('h:mm a');
};

export function getPassedTime(startTime?: number, range: number = 1000): number {
  return startTime ? Math.floor(Date.now() - startTime) / range : 0;
}

export function getDaysAgoDate(days: number): string {
  return DateTime.now().minus({ days }).toISODate();
}

export function getDayLabel(dateString: string | Date): string {
  const date = DateTime.fromJSDate(new Date(dateString)).startOf('day');
  const now = DateTime.now().startOf('day');
  const diff = Math.round(now.diff(date, 'days').days);

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < DAYS_IN_WEEK) return `${diff} days ago`;
  if (diff < DAYS_IN_MONTH) {
    const weeks = Math.floor(diff / DAYS_IN_WEEK);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  if (diff < DAYS_IN_YEAR) {
    const months = Math.floor(diff / DAYS_IN_MONTH);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  const years = Math.floor(diff / DAYS_IN_YEAR);
  if (years === 1) return '1 year ago';
  if (years < 3) return `${years} years ago`;

  return date.toFormat('MMM d, yyyy');
}

export const getWeekDaysOptions = (locale: string = 'en', format: 'long' | 'short' | 'narrow' = 'long') => {
  const sundayFirstLocales = ['en-US', 'en-CA', 'en-PH', 'es-MX', 'ja-JP', 'pt-BR', 'he-IL', 'ar-SA'];
  const weekStartsOnSunday = sundayFirstLocales.some((l) => locale.startsWith(l.split('-')[0]));
  const baseDate = DateTime.utc(2023, 1, weekStartsOnSunday ? 1 : 2); // Jan 1 or Jan 2
  const baseWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const date = baseDate.plus({ days: i });
    return date.setLocale(locale).toLocaleString({ weekday: format });
  });

  const values = weekStartsOnSunday ? ['Sunday', ...baseWeekdays] : [...baseWeekdays, 'Sunday'];

  return weekdays.map((label, id) => ({
    id,
    label,
    value: values[id],
  }));
};

export function calculateDuration(targetDate: Date | string): string {
  const date = DateTime.fromJSDate(new Date(targetDate));
  const now = DateTime.now();

  const diffInDays = Math.floor(now.diff(date, 'days').days);

  if (diffInDays < 0) return '0 days';

  if (diffInDays >= DAYS_IN_TWO_YEARS) {
    const years = Math.floor(diffInDays / DAYS_IN_YEAR);
    const remainingDays = diffInDays % DAYS_IN_YEAR;
    const months = Math.floor(remainingDays / DAYS_IN_MONTH);

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(', ') : '0 days';
  }

  const months = Math.floor(diffInDays / DAYS_IN_MONTH);
  const remainingDays = diffInDays % DAYS_IN_MONTH;
  const weeks = Math.floor(remainingDays / DAYS_IN_WEEK);
  const days = remainingDays % DAYS_IN_WEEK;

  const parts: string[] = [];
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

  return parts.length > 0 ? parts.join(', ') : '0 days';
}

export const getPeriodStartDate = (period?: Period): string | null => {
  if (!period || period === Period.allTime) return null;

  return getDaysAgoDate(Number(period));
};

export function getEnhancedDateLabel(
  dateString: string | Date,
  options: {
    showTime?: boolean;
    maxRelativeDays?: number;
    locale?: string;
  } = {}
): string {
  const { showTime = false, maxRelativeDays = MAX_RELATIVE_DAYS, locale = 'en-US' } = options;
  const date = DateTime.fromJSDate(new Date(dateString)).setLocale(locale);
  const now = DateTime.now().setLocale(locale);
  const diff = Math.round(now.diff(date, 'days').days);

  if (diff === 0) return showTime ? `Today at ${date.toFormat('h:mm a')}` : 'Today';
  if (diff === 1) return showTime ? `Yesterday at ${date.toFormat('h:mm a')}` : 'Yesterday';
  if (diff < DAYS_IN_WEEK) return `${diff} days ago`;
  if (diff < DAYS_IN_MONTH) {
    const weeks = Math.floor(diff / DAYS_IN_WEEK);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }

  if (diff < maxRelativeDays * DAYS_IN_MONTH) {
    const months = Math.floor(diff / DAYS_IN_MONTH);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  if (showTime) {
    return date.toFormat("MMM d, yyyy 'at' h:mm a");
  }
  return date.toFormat('MMM d, yyyy');
}
