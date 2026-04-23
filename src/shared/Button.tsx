import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

const baseStyles =
  'inline-flex border border-transparent items-center justify-center gap-x-2 rounded-lg py-2 px-5 font-medium text-base disabled:opacty-30 disabled:pointer-events-none';

const variantStyles = {
  solid: {
    primary:
      'bg-dark-aquamarine text-white hover:bg-transparent hover:text-dark-aquamarine hover:border-dark-aquamarine',
    gray: 'bg-white/[8%] border-background-border/[16%] text-light-gray hover:border-main hover:text-main',
    aquamarine:
      'bg-white/[8%] border-background-border/[18%] text-dark-aquamarine hover:bg-dark-aquamarine hover:text-main',
    dark: 'bg-background text-main hover:bg-main hover:text-background ',
    light: 'bg-main text-background hover:bg-storm-gray hover:border-main hover:text-main',
  },
  outline: {
    darkGray: 'border-dark-gray text-light-gray hover:text-main hover:border-storm-gray',
    red: 'border-salmon text-salmon hover:text-main hover:border-main',
  },
  dashed: {
    gray: 'border border-dashed border-storm-gray text-light-gray hover:border-main hover:text-main',
  },
};

type ButtonProps = (
  | { variant?: 'solid'; color?: keyof typeof variantStyles.solid }
  | { variant: 'outline'; color?: keyof typeof variantStyles.outline }
  | { variant: 'dashed'; color?: keyof typeof variantStyles.dashed }
) &
  (
    | (Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> & { href?: undefined })
    | (Omit<React.ComponentPropsWithoutRef<typeof Link>, 'color'> & { href: string })
  );

export function Button({ className, variant, color, ...props }: ButtonProps) {
  const variantConfig: any = variant ? variantStyles[variant] : undefined;
  className = twMerge(baseStyles, variantConfig && color && variantConfig[color], className);

  return typeof props.href === 'undefined' ? (
    <button className={twMerge('disabled:cursor-not-allowed disabled:opacity-75', className)} {...props} />
  ) : (
    <Link prefetch={false} className={className} {...props} />
  );
}
