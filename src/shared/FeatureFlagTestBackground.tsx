'use client';

import { ReactNode } from 'react';

import { useFeatureFlagString } from '@/hooks/useFeatureFlag';
import { FeatureFlags } from '@/lib/services/featureFlags';

interface FeatureFlagTestBackgroundProps {
  children: ReactNode;
}

export function FeatureFlagTestBackground({ children }: FeatureFlagTestBackgroundProps) {
  const [backgroundColor, isLoading] = useFeatureFlagString(FeatureFlags.TEST_BACKGROUND_COLOR, '');

  const backgroundStyle = backgroundColor
    ? {
        backgroundColor: backgroundColor,
        transition: 'background-color 0.3s ease',
      }
    : {};

  return (
    <div style={backgroundStyle} className="min-h-screen">
      {children}
      {!isLoading && backgroundColor && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-black/80 px-3 py-2 text-sm text-white backdrop-blur">
          🎨 Background color: {backgroundColor}
        </div>
      )}
    </div>
  );
}
