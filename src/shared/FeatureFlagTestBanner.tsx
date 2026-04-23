'use client';

import { useFeatureFlagEnabled } from '@/hooks/useFeatureFlag';
import { FeatureFlags } from '@/lib/services/featureFlags';
import { Banner } from '@/shared/Banner';

export function FeatureFlagTestBanner() {
  const [isEnabled, isLoading] = useFeatureFlagEnabled(FeatureFlags.TEST_BANNER);

  if (isLoading || !isEnabled) {
    return null;
  }

  return (
    <Banner variant="blue" className="w-full rounded-none text-center text-sm md:text-base" closeButton={true}>
      🚀 This is a test banner controlled by a feature flag! Feature flags are working correctly.
    </Banner>
  );
}
