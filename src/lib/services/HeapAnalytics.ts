import { HeapEventProperties, HeapUser } from '../models/analytic.models';
import { isLowerEnv } from '../utils/common.utils';
import { getPassedTime } from '../utils/date.utils';

declare global {
  interface Window {
    heap: any;
    heapReadyCb: any[];
  }
}

export class HeapAnalytics {
  private static instance: HeapAnalytics;
  private initialized: boolean = false;
  // TODO: add envId value
  private readonly envId: string = '811011296';

  private constructor() {}

  public static getInstance(): HeapAnalytics {
    if (!HeapAnalytics.instance) {
      HeapAnalytics.instance = new HeapAnalytics();
    }
    return HeapAnalytics.instance;
  }

  public init(envUrl: string): void {
    const isNotProd = isLowerEnv(envUrl || process.env.NEXT_PUBLIC_BASE_URL || '');

    if (this.initialized || typeof window === 'undefined' || isNotProd) return;

    try {
      this.initializeHeapScript();
      this.initialized = true;
    } catch (error: any) {
      console.error('[HeapAnalytics] Initialization error:', error);
    }
  }

  public identifyUser(userId: string, userData: Partial<HeapUser>): void {
    if (!this.initialized) return;

    try {
      window.heap.identify(userId);
      if (Object.keys(userData).length > 0) {
        window.heap.addUserProperties(this.sanitizeProperties(userData));
      }
    } catch (error: any) {
      console.error('[HeapAnalytics] User identification error:', error);
    }
  }

  public addUserProperties(properties: HeapEventProperties): void {
    if (!this.initialized) return;

    try {
      window.heap.addUserProperties(this.sanitizeProperties(properties));
    } catch (error: any) {
      console.error('[HeapAnalytics] Add user properties error:', error);
    }
  }

  public trackEventSpendTime(eventName: string, startTime: number, properties?: HeapEventProperties): void {
    if (!this.initialized) return;

    try {
      this.trackEvent(eventName, { ...properties, timeTakenInSeconds: getPassedTime(startTime) });
    } catch (error: any) {
      console.error('[HeapAnalytics] Event spent time tracking error:', error);
    }
  }

  public trackEvent(eventName: string, properties?: HeapEventProperties): void {
    if (!this.initialized) return;

    try {
      window.heap.track(eventName, this.sanitizeProperties(properties || {}));
    } catch (error: any) {
      console.error('[HeapAnalytics] Event tracking error:', error);
    }
  }

  private initializeHeapScript(): void {
    const scriptId = 'heap-analytics';
    const script = document.getElementById(scriptId) as HTMLElementTagNameMap['script'];

    if (!script) {
      window.heapReadyCb = window.heapReadyCb || [];
      window.heap = window.heap || [];
      window.heap.load = (envId: string, config: any) => {
        window.heap.envId = envId;
        window.heap.clientConfig = config = config || {};
        window.heap.clientConfig.shouldFetchServerConfig = false;

        const script = document.createElement('script');
        script.id = 'heap-analytics';
        script.type = 'text/javascript';
        script.async = true;
        script.src = `https://cdn.us.heap-api.com/config/${envId}/heap_config.js`;

        const firstScript = document.getElementsByTagName('script')[0];
        firstScript?.parentNode?.insertBefore(script, firstScript);
      };

      this.setupHeapMethods();

      window.heap.load(this.envId);
    }
  }

  private setupHeapMethods(): void {
    const heapMethods = [
      'init',
      'startTracking',
      'stopTracking',
      'track',
      'resetIdentity',
      'identify',
      'getSessionId',
      'getUserId',
      'getIdentity',
      'addUserProperties',
      'addEventProperties',
      'removeEventProperty',
      'clearEventProperties',
      'addAccountProperties',
      'addAdapter',
      'addTransformer',
      'addTransformerFn',
      'onReady',
      'addPageviewProperties',
      'removePageviewProperty',
      'clearPageviewProperties',
      'trackPageview',
    ];

    heapMethods.forEach((method) => {
      window.heap[method] = (...args: any[]) => {
        window.heapReadyCb.push({
          name: method,
          // eslint-disable-next-line prefer-spread
          fn: () => window.heap[method]?.apply(window.heap, args),
        });
      };
    });
  }

  private sanitizeProperties(properties: any): any {
    return Object.entries(properties).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
  }
}

export const heapAnalytics = HeapAnalytics.getInstance();
