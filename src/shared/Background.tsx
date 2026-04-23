'use client';

import { memo } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { Theme, useTheme } from '@/contexts/ThemeContext';
import { useIsClient } from '@/hooks/useIsClient';

const BG_IMAGES = {
  [Theme.LIGHT]: '/images/background_light.svg',
  [Theme.DARK]: '/images/background.svg',
} as const;

export const GradientBackground = memo(function GradientBackground({
  className,
  imgClass,
  fillImage = true,
}: {
  className?: string;
  imgClass?: string;
  fillImage?: boolean;
}) {
  const { theme } = useTheme();
  const isClient = useIsClient();

  return (
    <div className={twMerge('fixed inset-0 -z-50', className)}>
      <Image
        alt="background"
        src={isClient ? BG_IMAGES[theme] : BG_IMAGES[Theme.DARK]}
        quality={100}
        {...(fillImage && { fill: true })}
        priority={true}
        className={twMerge('opacity-70] object-cover object-[0%_0%]', imgClass)}
      />
    </div>
  );
});
