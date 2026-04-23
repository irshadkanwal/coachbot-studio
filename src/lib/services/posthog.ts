'use client';

import posthog from 'posthog-js';

export class PostHogService {
  private static instance: PostHogService;
  private initialized = false;

  private constructor() {}

  static getInstance(): PostHogService {
    if (!PostHogService.instance) {
      PostHogService.instance = new PostHogService();
    }
    return PostHogService.instance;
  }

  init() {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!posthogKey || !posthogHost) {
      console.warn('PostHog configuration missing. Feature flags will not work.');
      return;
    }

    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll handle this manually if needed
      capture_pageleave: true,
    });

    this.initialized = true;
  }

  identify(userId: string, properties?: Record<string, any>) {
    if (!this.initialized) {
      console.warn('PostHog not initialized');
      return;
    }
    posthog.identify(userId, properties);
  }

  getClient() {
    return posthog;
  }

  isInitialized() {
    return this.initialized;
  }
}

export const posthogService = PostHogService.getInstance();
