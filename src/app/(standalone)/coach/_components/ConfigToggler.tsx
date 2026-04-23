'use client';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function ConfigToggler({
  checked,
  className,
  onToggle,
  disabled,
}: {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  onToggle?: (on: boolean) => Promise<any>;
}) {
  const [isChecked, setIsChecked] = useState(checked);
  const handleToggle = () => {
    if (disabled) return;
    onToggle?.(!isChecked);
    setIsChecked((prev) => !prev);
  };

  return (
    <div className={twMerge('flex items-center gap-1', className)}>
      <label
        className={twMerge('inline-flex items-center', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}
      >
        <input
          type="checkbox"
          value=""
          className={'peer sr-only size-0'}
          checked={isChecked}
          onChange={handleToggle}
          disabled={disabled}
        />
        <div
          className={twMerge(
            `peer relative h-7 w-12 rounded-full border border-light-gray bg-graphic/[6%] after:absolute after:start-[3px] after:top-[3px] after:size-5 after:rounded-full after:bg-light-gray after:transition-all after:content-[''] peer-checked:border-main peer-checked:after:translate-x-full peer-checked:after:bg-main rtl:peer-checked:after:-translate-x-full`
          )}
        />
      </label>
    </div>
  );
}
