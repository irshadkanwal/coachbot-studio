'use client';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const variants = {
  yellow: 'bg-yellow text-background text-sm rounded-3xl px-6 py-0.5 ',
  gray: 'bg-gray-500 text-white text-sm rounded-3xl px-6 py-0.5 ',
  blue: 'bg-blue-500 text-white text-sm rounded-3xl px-6 py-0.5 ',
} as const;

type VariantKey = keyof typeof variants;

export interface BannerProps {
  onClose?: () => void;
  closeButton?: boolean;
  variant?: VariantKey;
  children?: React.ReactNode;
  className?: string;
  text?: string;
}

export function Banner({ className, closeButton, variant, children, text, onClose }: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsVisible(false);

    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={twMerge('relative', variant && variants[variant], className)}>
      {text}
      {children}
      {closeButton && (
        <span
          className="cbi-close-circle absolute inset-y-0 right-0 h-full -translate-x-[20%] px-1 text-base"
          onClick={handleClose}
        ></span>
      )}
    </div>
  );
}
