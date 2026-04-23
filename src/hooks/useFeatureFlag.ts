'use client';

import { useEffect, useState } from 'react';

import { FeatureFlags, featureFlagService, FeatureFlagValue } from '@/lib/services/featureFlags';

export function useFeatureFlag<T extends FeatureFlagValue>(
  flagName: FeatureFlags,
  defaultValue: T,
  expectedType?: 'string' | 'boolean' | 'number'
): [T, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadFlag = async () => {
      try {
        const flagsLoaded = await featureFlagService.waitForFeatureFlags();

        if (!mounted) return;

        if (flagsLoaded) {
          const flagValue = featureFlagService.getFlag(flagName, defaultValue, expectedType);
          setValue(flagValue);
        } else {
          console.warn(`Failed to load feature flags within timeout. Using default value for ${flagName}`);
          setValue(defaultValue);
        }
      } catch (error) {
        console.error(`Error loading feature flag ${flagName}:`, error);
        if (mounted) {
          setValue(defaultValue);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadFlag();

    return () => {
      mounted = false;
    };
  }, [flagName, defaultValue, expectedType]);

  return [value, isLoading];
}

export function useFeatureFlagEnabled(flagName: FeatureFlags): [boolean, boolean] {
  const [value, setValue] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkFlag = () => {
      if (featureFlagService.areFeatureFlagsLoaded()) {
        const flagValue = featureFlagService.getFlag(flagName, false, 'boolean');
        setValue(flagValue);
        setIsLoading(false);
      }
    };

    checkFlag();

    const interval = setInterval(checkFlag, 500);

    setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => clearInterval(interval);
  }, [flagName]);

  return [value, isLoading];
}

export function useFeatureFlagString(flagName: FeatureFlags, defaultValue: string = ''): [string, boolean] {
  return useFeatureFlag(flagName, defaultValue, 'string');
}

export function useFeatureFlagNumber(flagName: FeatureFlags, defaultValue: number = 0): [number, boolean] {
  return useFeatureFlag(flagName, defaultValue, 'number');
}
