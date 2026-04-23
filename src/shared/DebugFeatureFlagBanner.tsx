'use client';

import { useEffect, useState } from 'react';

import { useFeatureFlagEnabled } from '@/hooks/useFeatureFlag';
import { FeatureFlags } from '@/lib/services/featureFlags';
import { posthogService } from '@/lib/services/posthog';
import { Banner } from '@/shared/Banner';

export function DebugFeatureFlagBanner() {
  const [isEnabled, isLoading] = useFeatureFlagEnabled(FeatureFlags.TEST_BANNER);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const checkStatus = () => {
      const isInit = posthogService.isInitialized();
      const client = isInit ? posthogService.getClient() : null;

      if (client) {
        const flagValue = client.getFeatureFlag('test-banner-feature');

        setDebugInfo(`Init: ${isInit}, Flag: ${flagValue}, Type: ${typeof flagValue}, Enabled: ${isEnabled}`);
      } else {
        setDebugInfo(`PostHog not initialized`);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [isEnabled, isLoading]);

  if (isLoading) {
    return null;
  }

  if (isEnabled) {
    return (
      <Banner variant="blue" className="w-full rounded-none text-center text-sm md:text-base" closeButton={true}>
        🚀 Feature flag is ENABLED! {debugInfo}
      </Banner>
    );
  }

  return null;
}
