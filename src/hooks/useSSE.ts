import { useEffect, useState } from 'react';

type EventCallback = (data: any) => void;

interface SSEOptions {
  url?: string;
  events: { [key: string]: EventCallback };
}

export function useSSE({ url = '/api/sse', events }: SSEOptions) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = (error) => {
      console.warn('[useSSE] Error:', error, new Date().toISOString());
      setIsConnected(false);
    };

    Object.entries(events).forEach(([eventName, callback]) => {
      eventSource.addEventListener(eventName, (event: any) => {
        try {
          const data = event?.data != null ? JSON.parse(event.data) : null;
          callback(data);
        } catch (error) {
          console.error(`[useSSE] Error parsing SSE event [${eventName}]:`, error);
        }
      });
    });

    return () => eventSource.close();
  }, [url, JSON.stringify(Object.keys(events))]);

  return { isConnected };
}
