import type { Metadata } from 'next';

import '@/styles/globals.css';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

import { AccessProvider } from '@/contexts/AccessProvider';
import { PostHogProvider } from '@/contexts/PostHogProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { getUser } from '@/server/actions/userActions';
import { Analytics } from '@/shared/Analytics';
import { Banner } from '@/shared/Banner';
import { DebugFeatureFlagBanner } from '@/shared/DebugFeatureFlagBanner';
import { cbi, helveticaNow } from '@/styles/fonts';

const GradientBackground = dynamic(() => import('@/shared/Background').then((mod) => mod.GradientBackground));

export const metadata: Metadata = {
  title: 'CoachBot Studio',
  description: 'Your 24/7 Growth Partner.',
};

export default async function RootLayout({ children, modal }: Readonly<{ children: ReactNode; modal: ReactNode }>) {
  const [locale, messages, t] = await Promise.all([getLocale(), getMessages(), getTranslations()]);
  let user = null;
  try {
    user = await getUser();
  } catch {
    // User not authenticated, continuing with anonymous session
  }

  return (
    <html lang={locale} className={'size-full scroll-smooth bg-violet-950 antialiased'}>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico"></link>
      </head>
      <body className={`${helveticaNow.className} ${cbi.className} flex flex-grow flex-col antialiased`}>
        <Analytics envUrl={process.env.APP_BASE_URL} user$={Promise.resolve(user)} />
        <NextIntlClientProvider messages={messages}>
          <PostHogProvider user={user}>
            <AccessProvider>
              <ThemeProvider>
                {process.env.ERROR_BANNER_ENABLED === 'true' && (
                  <Banner
                    variant="yellow"
                    className="w-full rounded-none text-center text-sm md:text-base"
                    closeButton={true}
                  >
                    {t('Common.errorBannerMessage')}
                  </Banner>
                )}
                <DebugFeatureFlagBanner />
                {children}
                {modal}
              </ThemeProvider>
            </AccessProvider>
          </PostHogProvider>
        </NextIntlClientProvider>
        <GradientBackground />
      </body>
    </html>
  );
}
