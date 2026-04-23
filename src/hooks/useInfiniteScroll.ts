import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function useInfiniteScroll(
  onIntersect: () => void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 0.1, rootMargin = '100px', enabled = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const isIntersecting = entry.isIntersecting;
      setIsIntersecting(isIntersecting);

      if (isIntersecting && enabled && !isLoading) {
        onIntersect();
      }
    },
    [onIntersect, enabled, isLoading]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleIntersection, threshold, rootMargin, enabled]);

  return { ref, isIntersecting, isLoading, setIsLoading };
}
