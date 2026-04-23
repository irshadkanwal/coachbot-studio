import { IntlErrorCode } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE } from '@/lib/constants';
import { Locale, locales } from '@/lib/models/locale.models';
import { getUserLocale } from '@/lib/utils/locale.utils';

export default getRequestConfig(async () => {
  let locale = await getUserLocale();

  if (!locales.includes(locale as Locale)) {
    locale = DEFAULT_LOCALE;
  }

  return {
    locale,
    messages: (await import(`../../i18n_messages/${locale}.json`)).default,
    onError(error) {
      console.error('[i18nConfig] Error during setup iternationalization config: ', error);
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.');

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return path + ' is not yet translated';
      } else {
        return '[i18nConfig] fix this message: ' + path;
      }
    },
  };
});
