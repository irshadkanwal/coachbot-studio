'use client';

import { useEffect } from 'react';

interface LottiePlayerProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  background?: string;
  speed?: number;
  style?: React.CSSProperties;
}

export default function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  background = 'transparent',
  speed = 1,
  style = { width: '150px', height: '150px' },
}: LottiePlayerProps) {
  useEffect(() => {
    // Register custom element ONLY on client
    if (typeof window !== 'undefined' && !customElements.get('dotlottie-player')) {
      import('@dotlottie/player-component');
    }
  }, []);

  return (
    <dotlottie-player src={src} loop={loop} autoplay={autoplay} background={background} speed={speed} style={style} />
  );
}
