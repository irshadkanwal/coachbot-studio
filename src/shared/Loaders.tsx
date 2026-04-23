import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

import { Logo } from './Logo';

export const Spinner = memo(function Spinner({
  className,
  withText,
  text,
  textClassName,
  icon = 'cbi-Loader',
}: {
  className?: string;
  withText?: boolean;
  text?: string;
  textClassName?: string;
  icon?: string;
}) {
  return (
    <>
      <p className={twMerge('flex items-center gap-x-3 text-xl', className)}>
        <span className={twMerge('gradient-loader inline-flex animate-spin text-xl', icon)}></span>
        {withText && <span className={twMerge('text-sm text-light-gray', textClassName)}>{text ?? 'Loading...'}</span>}
      </p>
    </>
  );
});

export const FullScreenLoader = memo(function FullScreenLoader({ className }: { className?: string }) {
  return (
    <>
      <main className={twMerge('flex h-svh w-svw flex-col items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-y-7">
          <Logo className="h-8 sm:h-10 xl:h-12" />
          <Spinner withText={true} className="text-2xl" />
        </div>
      </main>
    </>
  );
});
