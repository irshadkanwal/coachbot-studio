import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        background?: string;
        speed?: number | string;
        loop?: boolean;
        autoplay?: boolean;
        style?: React.CSSProperties;
      };
    }
  }
}
