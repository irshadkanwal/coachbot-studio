'use client';

import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { Button } from './Button';

export interface BaseValue {
  id: string | number;
  title?: string | null;
  name?: string | null;
  custom?: boolean | null;
}

export interface DropdownOption<T> {
  id: string | number;
  href?: string;
  icon?: string;
  labelKey?: string;
  label?: string;
  value: T;
  className?: string;
  handler?: (option: DropdownOption<T>) => void;
}

interface DropdownProps<T> {
  children?: ReactNode;
  disabled?: boolean;
  options: DropdownOption<T>[];
  selectedOption?: T;
  value?: T;
  position?: any;
  optionClassName?: string;
  listClassName?: string;
  buttonIcon?: string;
  className?: string;
  label?: string;
  movableItems?: boolean;
  onSelectedChange?: (option: DropdownOption<T>) => void;
  onChange?: (value: T) => void;
  onItemMoved?: (up: boolean, option: DropdownOption<T>) => void;
}

export const getOption = function <T extends BaseValue>(value: T, labelKey: string): DropdownOption<T> {
  const label: string = (value[labelKey as keyof T] as string) || value.title || '';

  return {
    id: value.id,
    label: value.custom ? label : label.replaceAll('_', ' '),
    value,
    icon: value.custom ? 'cbi-send' : '',
  };
};

export const getOptions = function <T extends BaseValue>(values: T[], labelKey: string): DropdownOption<T>[] {
  return values.map((value: T) => getOption(value, labelKey));
};

export default function Dropdown<T>({
  children,
  disabled,
  optionClassName,
  listClassName,
  position,
  options,
  buttonIcon = 'cbi-arrow-down group-data-[open]:rotate-180',
  selectedOption,
  value,
  className,
  label,
  movableItems,
  onSelectedChange,
  onChange,
  onItemMoved,
}: DropdownProps<T>) {
  const t = useTranslations();
  const [selected, setSelected] = useState<DropdownOption<T> | null>(options[0] || null);

  const handleSelectedChange = useCallback(
    (option: DropdownOption<T>) => {
      setSelected(option);
      onSelectedChange?.(option);
      onChange?.(option.value);

      if (option.handler) {
        option.handler(option);
      }
    },
    [onSelectedChange, onChange]
  );

  useEffect(() => {
    const targetOption = value || selectedOption;
    const foundOption = options.find((option: DropdownOption<T>) => {
      if (typeof option.value === 'string') {
        return option.value === selectedOption || (value && option.value === (value as any).value);
      }

      return (
        (option.value as BaseValue).id === (targetOption as BaseValue)?.id ||
        JSON.stringify(option.value) === JSON.stringify(targetOption)
      );
    });

    setSelected(foundOption || options[0] || null);
  }, [selectedOption, options, value]);

  return (
    <Listbox value={selected} onChange={handleSelectedChange} disabled={disabled}>
      <ListboxButton
        disabled={!selected}
        className={twMerge(
          'leading-2 group flex items-center justify-between rounded-lg text-base font-medium text-light-gray',
          'rounded-xl border border-storm-gray px-3 py-2.5',
          selected && 'capitalize',
          className
        )}
      >
        {selected?.labelKey && t(selected.labelKey)}
        {selected?.label}
        {!selected && !options.length && t('General.dropdownEmptyPlaceholder')}
        {!!options.length && (buttonIcon || selected?.icon) && <i className={buttonIcon || selected?.icon}></i>}
      </ListboxButton>
      <ListboxOptions
        anchor={position || 'bottom'}
        transition
        className={twMerge(
          'z-20 flex w-[var(--button-width)] origin-top flex-col gap-y-5 rounded-lg border border-light-gray bg-background p-3.5 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0',
          listClassName
        )}
      >
        {label && <p className="text-sm text-storm-gray">{label}</p>}
        {children}
        {options.map((option: DropdownOption<T>, index: number, { length }: DropdownOption<T>[]) => (
          <ListboxOption key={`${option.id}` + index} value={option} as={Fragment}>
            {({ selected }) => (
              <div
                key={option.id}
                className={twMerge(
                  'flex w-full cursor-pointer items-center text-base text-light-gray hover:text-main',
                  optionClassName
                )}
              >
                {option.href ? (
                  <Link
                    prefetch={false}
                    href={option.href}
                    className={twMerge('inline-flex w-full justify-between', option.className)}
                  >
                    <span className="inline-flex items-center gap-x-2">
                      {option.icon && <i className={option.icon}></i>}
                      {option.label || (option.labelKey && t(option.labelKey))}
                    </span>
                    {selected && <i className="cbi-tick-circle text-xs text-saffron"></i>}
                  </Link>
                ) : (
                  <div className="inline-flex w-full justify-between">
                    <span className="inline-flex gap-x-1.5">
                      {option.icon && <i className={option.icon}></i>}
                      {option.label || (option.labelKey && t(option.labelKey))}
                    </span>
                    <div className="flex gap-x-3">
                      {selected && <i className="cbi-tick-circle text-sm text-main"></i>}
                      {movableItems && (
                        <div
                          className="flex flex-col items-center justify-center gap-y-0 text-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            title="Move item up"
                            disabled={index === 0}
                            className="cbi-arrow-up-bold p-0 text-lg leading-3 text-main hover:text-dark-aquamarine disabled:opacity-30"
                            onClick={() => onItemMoved?.(true, option)}
                          />

                          <Button
                            title="Move item down"
                            disabled={index === length - 1}
                            className="cbi-arrow-down-bold p-0 text-lg leading-3 text-main hover:text-dark-aquamarine disabled:opacity-30"
                            onClick={() => onItemMoved?.(false, option)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
