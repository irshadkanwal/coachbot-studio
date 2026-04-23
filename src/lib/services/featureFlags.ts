'use client';

import { posthogService } from './posthog';

export enum FeatureFlags {
  TEST_BANNER = 'test-banner-feature',
  TEST_BACKGROUND_COLOR = 'test-background-color',
  TRANSCRIPT_UPLOAD_ENABLED = 'transcript-upload-enabled',
}

export type FeatureFlagValue = string | boolean | number | null;

export class FeatureFlagService {
  private static instance: FeatureFlagService;

  private constructor() {}

  static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  getFlag<T extends FeatureFlagValue>(
    flagName: FeatureFlags,
    defaultValue: T,
    expectedType?: 'string' | 'boolean' | 'number'
  ): T {
    if (!posthogService.isInitialized()) {
      console.warn(`PostHog not initialized. Using default value for flag: ${flagName}`);
      return defaultValue;
    }

    try {
      const client = posthogService.getClient();
      const flagValue = client.getFeatureFlag(flagName) as T;

      if (expectedType && flagValue !== null && flagValue !== undefined) {
        const actualType = typeof flagValue;
        if (actualType !== expectedType) {
          console.warn(
            `Feature flag "${flagName}" expected type "${expectedType}" but got "${actualType}". Using default value.`
          );
          return defaultValue;
        }
      }

      return flagValue !== null && flagValue !== undefined ? flagValue : defaultValue;
    } catch (error) {
      console.error(`Error getting feature flag "${flagName}":`, error);
      return defaultValue;
    }
  }

  isEnabled(flagName: FeatureFlags): boolean {
    return this.getFlag(flagName, false, 'boolean');
  }

  getString(flagName: FeatureFlags, defaultValue: string = ''): string {
    return this.getFlag(flagName, defaultValue, 'string');
  }

  getNumber(flagName: FeatureFlags, defaultValue: number = 0): number {
    return this.getFlag(flagName, defaultValue, 'number');
  }

  areFeatureFlagsLoaded(): boolean {
    if (!posthogService.isInitialized()) {
      return false;
    }

    return true;
  }

  async waitForFeatureFlags(timeoutMs: number = 3000): Promise<boolean> {
    return new Promise((resolve) => {
      if (!posthogService.isInitialized()) {
        resolve(false);
        return;
      }

      if (this.areFeatureFlagsLoaded()) {
        resolve(true);
        return;
      }

      const pollInterval = setInterval(() => {
        if (this.areFeatureFlagsLoaded()) {
          clearInterval(pollInterval);
          if (timeoutId !== null) clearTimeout(timeoutId);
          resolve(true);
        }
      }, 100);

      // declare before use to avoid TDZ and guard accesses
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      timeoutId = setTimeout(() => {
        clearInterval(pollInterval);
        resolve(false);
      }, timeoutMs);
    });
  }
}

export const featureFlagService = FeatureFlagService.getInstance();
