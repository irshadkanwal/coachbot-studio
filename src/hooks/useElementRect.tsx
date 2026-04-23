import { RefObject, useEffect, useState } from 'react';

export function useElementRect<T extends HTMLElement>(ref: RefObject<T>) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!ref.current) return;

    const updateRect = () => {
      if (ref.current) {
        const domRect = ref.current.getBoundingClientRect();
        setRect(domRect.toJSON ? domRect.toJSON() : { ...domRect });
      }
    };

    updateRect();

    const observer = new ResizeObserver(updateRect);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return rect;
}
