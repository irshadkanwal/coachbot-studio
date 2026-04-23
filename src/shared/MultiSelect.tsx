import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface MultiSelectOption<T = string> {
  id: string | number;
  value: T;
  label: string;
  disabled?: boolean;
  className?: string;
}

interface MultiSelectProps<T = string> {
  options: MultiSelectOption<T>[];
  value?: T[];
  onChange: (selected: T[]) => void;
  className?: string;
  optionClassName?: string;
  disabled?: boolean;
  label?: string;
  labelClassName?: string;
}

export function MultiSelect<T = string>({
  options,
  value = [],
  onChange,
  className,
  optionClassName,
  disabled,
  label,
  labelClassName,
}: MultiSelectProps<T>) {
  const [selectedOptions, setSelectedOptions] = useState(value);
  const handleToggle = (value: T) => {
    if (disabled) return;

    const updatedValues = selectedOptions.includes(value)
      ? selectedOptions.filter((v) => v !== value)
      : [...selectedOptions, value];

    setSelectedOptions(updatedValues);
    onChange(updatedValues);
  };

  return (
    <div className="flex flex-grow flex-col gap-y-1.5">
      {label && <p className={labelClassName}>{label}</p>}
      <div className={twMerge('flex flex-grow gap-1.5', className)}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={disabled || option.disabled}
            className={twMerge(
              'flex-1 rounded-xl border border-background-border/[11%] bg-graphic/[14%] px-3 py-2 text-sm text-light-gray transition hover:border-main hover:text-main',
              selectedOptions.includes(option.value) && 'bg-background text-main',
              option.disabled && 'cursor-not-allowed opacity-60',
              optionClassName,
              option.className
            )}
            aria-pressed={selectedOptions.includes(option.value)}
            onClick={() => handleToggle(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
