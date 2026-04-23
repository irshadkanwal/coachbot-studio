'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { State } from '@/lib/models/common.models';
import Dropdown, { BaseValue, DropdownOption, getOption, getOptions } from '@/shared/Dropdown';
import Tooltip from '@/shared/Tooltip';
import CreateValuePanel from './CreateValuePanel';
import MultiSelectDropdown, { MultiSelectOption } from './MultiselectDropdown';

interface CustomizableDropdownProps<T> {
  values: T[];
  selectedValue?: T | T[];
  onSelect: (value: T | T[], deletedId?: any) => void;
  translationKey: string;
  tooltipKey?: string;
  optonLabelProp: string;
  editableItems?: boolean;
  multiselect?: boolean;
  disabled?: boolean;
  movableItems?: boolean;
  handleCreation: (value: string) => Promise<State<T | null>>;
  handleEdit: (id: any, value: string) => Promise<State<T | null>>;
  handleMove?: (item: T, value: number, items: T[]) => Promise<T[]>;
  handleDelete: (id: any) => void | Promise<State<T | null>>;
}

export const filterOptions = (options: DropdownOption<any>[], removeId: any) =>
  options.filter(({ id }) => id !== removeId);

export default function CustomizableDropdown<T extends BaseValue>({
  selectedValue,
  values,
  onSelect,
  translationKey,
  tooltipKey,
  optonLabelProp,
  editableItems,
  multiselect = false,
  disabled,
  movableItems,
  handleCreation,
  handleEdit,
  handleDelete,
  handleMove,
}: CustomizableDropdownProps<T>) {
  const t = useTranslations();
  const [options, setOptions] = useState<DropdownOption<T>[]>([]);
  const showEditButtons = useMemo(
    () => (multiselect ? false : !!values?.length && (editableItems || !!(selectedValue as T)?.custom)),
    [values?.length, editableItems, selectedValue, multiselect]
  );

  const initialValue = useMemo(() => {
    const value = (selectedValue as T)[optonLabelProp as keyof T] as string;

    return value?.replaceAll('_', ' ') || '';
  }, [selectedValue]);

  const handleUpdates = useCallback(
    async (value: string, create: boolean, id?: any) => {
      const updatedValue = create ? await handleCreation(value) : await handleEdit(id, value);

      if (updatedValue.value) {
        const option = getOption<T>(updatedValue.value as T, optonLabelProp);
        onSelect(updatedValue.value);
        setOptions((prev) => [...filterOptions(prev || [], updatedValue.value?.id), option]);
      }
    },
    [selectedValue, options]
  );

  const handleDeletion = useCallback(
    async (id: any) => {
      if (id) {
        await handleDelete(id);

        const newOptions = filterOptions(options, id);
        setOptions(newOptions);
        onSelect(newOptions[0]?.value || null, id);
      }
    },
    [selectedValue, options]
  );

  const handleMoving = useCallback(
    async (up: boolean, { value }: DropdownOption<T>) => {
      if (!movableItems || !handleMove) return;

      const updatedValues = await handleMove(
        value,
        up ? -1 : 1,
        options.map(({ value }) => value)
      );
      setOptions(getOptions(updatedValues as T[], optonLabelProp));
    },
    [movableItems, options]
  );

  useEffect(() => {
    values && setOptions(getOptions(values, optonLabelProp));
  }, [values]);

  return (
    <>
      <div className="relative flex items-start gap-x-2 border-b border-main pb-3">
        {tooltipKey && (
          <Tooltip
            iconClass="cbi-message-question"
            tooltipLabel={tooltipKey}
            className="absolute right-0 top-0"
            tooltipClassName=" -translate-x-[97%]"
          />
        )}
        <div className="flex flex-grow flex-col gap-y-2">
          <p className="ps-5 text-sm font-medium text-main">{t(`${translationKey}.dropdown.title`)}</p>

          {multiselect ? (
            <MultiSelectDropdown<T>
              translationKey={translationKey}
              selectedOptions={selectedValue as T[]}
              labelKey={`${translationKey}.dropdown.dropdownLable`}
              titleKey={`${translationKey}.dropdown.dropdownTitle`}
              options={options as MultiSelectOption<T>[]}
              listClassName="translat-y-12"
              onSelectedChange={(values: MultiSelectOption<T>[]) => onSelect(values.map(({ value }) => value) as T[])}
              className="w-full"
              handleEdit={(id: any, value: string) => handleUpdates(value, false, id)}
              handleDelete={handleDeletion}
            />
          ) : (
            <Dropdown
              movableItems={movableItems}
              listClassName="rounded-xl"
              position={'bottom end'}
              className={'rounded-xl border border-storm-gray bg-white/[8%] px-3 py-2.5'}
              options={options}
              selectedOption={selectedValue as T}
              optionClassName="capitalize"
              onSelectedChange={({ value }: DropdownOption<T>) => onSelect(value as T)}
              onItemMoved={handleMoving}
            />
          )}
        </div>
        <div className="flex min-w-48 shrink-0 basis-1/3 gap-x-1 pt-7">
          <CreateValuePanel
            disabled={disabled}
            initialValue={multiselect ? '' : initialValue}
            translationKey={translationKey}
            showEditButtons={showEditButtons}
            handleCreation={(value: string) => handleUpdates(value, true)}
            handleEdit={(value: string) => handleUpdates(value, false, (selectedValue as T).id)}
            handleDelete={() => handleDeletion((selectedValue as T).id)}
          />
        </div>
      </div>
    </>
  );
}
