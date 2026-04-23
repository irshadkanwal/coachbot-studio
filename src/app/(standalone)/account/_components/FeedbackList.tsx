'use client';

import React, { use, useCallback, useEffect, useState } from 'react';
import Script from 'next/script';

import Loader from '../feedback/loading';

declare global {
  interface Window {
    Canny: any;
  }
}

interface FeedbackProps {
  theme?: 'light' | 'dark' | 'auto';
  boardToken: string;
  basePath?: string | null;
  ssoToken$: Promise<string | null>;
}

export default function Feedback({
  ssoToken$,
  boardToken,
  theme = 'light',
  basePath = '/account/feedback',
}: FeedbackProps) {
  const ssoToken = use(ssoToken$);
  const [isLoading, setIsLoading] = useState(true);

  const renderCanny = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.Canny !== 'function') return;

    window.Canny('render', {
      boardToken,
      basePath: basePath,
      ssoToken,
      theme: theme,
    });

    setTimeout(() => setIsLoading(false), 1500);
  }, [ssoToken, basePath, theme]);

  useEffect(() => renderCanny(), [renderCanny]);

  return (
    <>
      {boardToken && (
        <Script src="https://canny.io/sdk.js" id="canny-jssdk" onLoad={renderCanny} strategy="afterInteractive" />
      )}

      <div data-canny className={`${isLoading && 'max-h-[90dvh] overflow-hidden'}`}>
        {isLoading && <Loader />}
      </div>
    </>
  );
}
