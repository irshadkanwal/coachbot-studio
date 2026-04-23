import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '../constants';
import { getCookie } from './cookie.utils';

export function normalizeLocale(locale: string): string {
  if (locale.includes('-')) {
    return locale.split('-')[0];
  }

  return locale;
}

export async function getUserLocale() {
  const lanaguage = (await getCookie<string>(LOCALE_COOKIE_NAME)) || DEFAULT_LOCALE;

  return normalizeLocale(lanaguage);
}
