'use client';

import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { Theme, useTheme } from '@/contexts/ThemeContext';

const classNames = {
  root: 'theme-toggler flex items-center gap-1',
  label: 'inline-flex items-center cursor-pointer',
  input: 'sr-only peer',
  switch: 'relative w-[52px] h-[30px] bg-graphic/[16%] border border-background-border/[26%] rounded-full',
  switchCircle:
    "peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-main  peer-checked:after:bg-yellow after:rounded-full after:h-[22px] after:w-[22px] after:transition-all",
  moonIcon: 'cbi-moon text-main !text-xl',
  sunIcon: 'cbi-sun text-yellow !text-xl',
};

export function ThemeToggler({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  const checked = useMemo(() => theme === Theme.LIGHT, [theme]);

  return (
    <div className={twMerge(classNames.root, className)}>
      <i className={classNames.moonIcon} />

      <label className={classNames.label}>
        <input type="checkbox" value="" className={classNames.input} checked={checked} onChange={toggleTheme} />
        <div className={twMerge(classNames.switch, classNames.switchCircle)} />
      </label>

      <i className={classNames.sunIcon} />
    </div>
  );
}
