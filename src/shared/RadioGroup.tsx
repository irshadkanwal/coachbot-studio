'use client';

import { RadioGroup as Group, Radio } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

const variants = {
  white:
    'bg-white-opacity text-light-gray border border-transparent hover:border-main hover:text-main data-[checked]:bg-storm-gray data-[checked]:border-storm-gray data-[checked]:text-main',
  graphic:
    'bg-graphic/[14%] border border-white-opacity text-light-gray hover:border-main hover:text-main data-[checked]:bg-background data-[checked]:text-main',
  bordered:
    'bg-white-opacity text-light-gray border border-transparent hover:border-main hover:text-main data-[checked]:border-main data-[checked]:text-main data-[checked]:bg-storm-gray',
  transparent:
    'bg-transparent text-light-gray hover:bg-white-opacity hover:text-main data-[checked]:bg-background data-[checked]:text-main',
  aquamarine:
    'bg-transparent text-light-gray hover:bg-white-opacity hover:text-main data-[checked]:bg-dark-aquamarine data-[checked]:text-main rounded-md',
};

export interface Option {
  id: string | number;
  labelKey?: string;
  label?: string;
  value: any;
  displayValue?: any;
  icon?: string;
  className?: string;
  disabled?: boolean;
  titleKey?: string;
}

export interface RadioGroupProps {
  id?: string;
  name?: string;
  selected?: any;
  value?: any;

  className?: string;
  variant?: keyof typeof variants;
  optionClassName?: string;
  iconClassName?: string;
  options: Option[];
  disabled?: boolean;
  setSelected?: (selected: any) => void | Promise<void>;
  onChange?: (value: any) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  id,
  name,
  className,
  optionClassName,
  iconClassName,
  selected,
  value,
  options,
  variant,
  disabled,
  setSelected,
  onChange,
}) => {
  const t = useTranslations();
  return (
    <Group
      id={id}
      name={name}
      disabled={disabled}
      value={selected || value}
      onChange={setSelected || onChange}
      aria-label="radio group"
      className={twMerge('flex flex-row', disabled && 'pointer-events-none', className)}
    >
      {options.map((option, index) => (
        <Radio
          disabled={option.disabled}
          key={option.id || index}
          value={option.value || option}
          className={twMerge(
            'group relative flex flex-1 cursor-pointer items-center justify-center gap-x-3 text-nowrap rounded-xl p-1.5 transition focus:outline-none',
            variant && variants[variant],
            option.disabled && 'cursor-not-allowed opacity-70',
            optionClassName,
            option.className
          )}
          data-activity-radio={option.value}
          title={option.titleKey && t(option.titleKey)}
        >
          {option.icon && <i className={twMerge(option.icon, iconClassName)}></i>}
          {option.labelKey && (
            <p className="inline-flex gap-x-2">
              {t(option.labelKey)}
              {option.displayValue != null && <span className="font-bold">{option.displayValue}</span>}
            </p>
          )}
          {option.label && <p className="inline-flex gap-x-2">{option.label}</p>}
        </Radio>
      ))}
    </Group>
  );
};
