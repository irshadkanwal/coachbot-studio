import { useEffect, useState } from 'react';

interface AsyncState<T> {
  loading: boolean;
  error: any | null;
  data: T | null;
}

export function useAsync<T>(cb: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ loading: true, error: null, data: null });

  useEffect(() => {
    let isMounted = true;

    const runAsync = async () => {
      try {
        setState({ loading: true, error: null, data: null });
        const data = await cb();
        isMounted && setState({ loading: false, error: null, data });
      } catch (error: any) {
        isMounted && setState({ loading: false, error, data: null });
      }
    };

    runAsync();

    return () => {
      isMounted = false;
    };
  }, [cb]);

  return state;
}
