import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const sizes = {
  s: 'py-0 px-2.5 text-base',
  m: 'py-1 px-3.5 text-base',
  md: 'py-1.5 px-5 text-base',
};

const variants = {
  white: 'bg-main text-background',
  aquamarine: 'bg-dark-aquamarine text-background',
  blue: 'bg-blue text-background',
  transparent: 'bg-transparent text-main border border-storm-gray',
  gray: 'bg-light-gray text-background',
  graphic: 'bg-graphic/[14%] text-light-gray',
  dark: 'bg-background text-main border border-background-border/[6%]',
};

export interface ChipProps {
  text?: string;
  size?: keyof typeof sizes;
  variant: keyof typeof variants;
  className?: string;
  textClassName?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({ text, size, variant, className, textClassName, children, onClick }) => {
  return (
    <div className={twMerge('inline text-center', className)} onClick={onClick}>
      <div
        className={twMerge(
          'inline-flex min-w-0 shrink-0 items-center justify-center text-wrap rounded-full md:text-nowrap',
          size && sizes[size],
          variant && variants[variant],
          textClassName
        )}
      >
        {text}
        {children}
      </div>
    </div>
  );
};
