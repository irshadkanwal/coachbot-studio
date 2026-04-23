import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { getArraysInterseptions } from '@/lib/utils/array.utils';
import CreateValuePanel from '@/shared/CreateValuePanel';
import { Button } from './Button';
import Checkbox from './Checkbox';

export interface MultiSelectOption<T> {
  id: string | number;
  labelKey?: string;
  label?: string;
  value?: T;
  selected?: boolean;
  custom?: boolean;
  className?: string;
  handler?: (option: MultiSelectOption<T>) => void;
}

interface MultiSelectProps<T> {
  options: MultiSelectOption<T>[];
  selectedOptions?: T[];
  position?: any;
  titleKey?: string;
  optionClassName?: string;
  listClassName?: string;
  className?: string;
  labelKey?: string;
  translationKey: string;
  onSelectedChange: (options: MultiSelectOption<T>[]) => void;
  handleEdit: (id: any, value: string) => any | Promise<any>;
  handleDelete: (id: any) => any | Promise<any>;
  children?: (initialValue: string) => ReactNode;
}

export default function MultiSelectDropdown<T>({
  optionClassName,
  listClassName,
  position,
  options,
  titleKey,
  className,
  labelKey,
  translationKey,
  onSelectedChange,
  handleDelete,
  handleEdit,
}: MultiSelectProps<T>) {
  const t = useTranslations();
  const [selected, setSelected] = useState<MultiSelectOption<T>[]>(options.filter((option) => option.selected));

  const handleAddValue = useCallback((option: MultiSelectOption<T>) => {
    option.selected = true;
    setSelected((prev) => [...prev, option]);
  }, []);

  const handleRemoveValue = useCallback((option: MultiSelectOption<T>) => {
    option.selected = false;
    setSelected((prev) => prev.filter(({ id }) => id !== option.id));
  }, []);

  const isSelected = useCallback(
    ({ id }: MultiSelectOption<T>) => selected.some((option) => id === option.id),
    [selected]
  );

  useEffect(() => onSelectedChange(selected), [selected]);
  useEffect(() => setSelected(getArraysInterseptions(options, selected)), [options]);

  return (
    <div className="flex flex-grow flex-col gap-y-5">
      <Menu>
        <MenuButton
          className={twMerge(
            'leading-2 group flex items-center justify-between rounded-xl border border-storm-gray px-3 py-2.5 text-base font-medium capitalize text-light-gray',
            className
          )}
        >
          {!!options.length ? (
            <>
              {labelKey && t(labelKey)}
              <i className="cbi-arrow-down group-data-[open]:rotate-180"></i>
            </>
          ) : (
            t('General.dropdownEmptyPlaceholder')
          )}
        </MenuButton>

        <MenuItems
          transition
          anchor={position || 'top start'}
          className={twMerge(
            'z-20 flex w-[var(--button-width)] min-w-0 origin-top flex-col items-start justify-start gap-y-4 rounded-lg border border-light-gray bg-background p-3.5 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0',
            !options.length && 'hidden',
            listClassName
          )}
        >
          <p className="text-sm text-storm-gray"> {titleKey && t(titleKey)}</p>
          {options.map((option: MultiSelectOption<T>, index: number) => (
            <MenuItem key={`multi-option-${index}`} as={Fragment}>
              <div className="flex w-full flex-grow justify-between gap-x-2" key={`option-${index}`}>
                <Checkbox
                  selected={isSelected(option)}
                  checkboxClassName={'text-main'}
                  label={option.label}
                  labelClassName={twMerge(
                    'text-base font-medium capitalize text-light-gray',
                    option.selected && 'text-main'
                  )}
                  className={twMerge('flex items-center gap-2 ring-main', optionClassName)}
                  onChange={() => (isSelected(option) ? handleRemoveValue(option) : handleAddValue(option))}
                />

                <CreateValuePanel
                  translationKey={translationKey}
                  showCreateButton={false}
                  showEditButtons={true}
                  initialValue={option.label}
                  className="shrink-1 w-max grow-0"
                  editButtonsClassName="border-0 bg-transparent p-1"
                  handleEdit={(value: string) => handleEdit(option.id, value)}
                  handleDelete={() => handleDelete(option.id)}
                />
              </div>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
      {!!selected.length && (
        <div className="flex flex-wrap gap-1">
          {selected.map((option, index) => (
            <div
              key={index}
              className="inline-flex items-center justify-center gap-x-1 rounded-2xl border border-storm-gray p-2 px-3.5 text-sm capitalize text-main"
            >
              {option.label}
              <Button className="cbi-close-circle p-0 text-lg leading-5" onClick={() => handleRemoveValue(option)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
