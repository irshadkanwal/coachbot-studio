'use client';

import React, { ReactNode, use, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FieldErrors, Path, useForm, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import { State } from '@/lib/models/common.models';
import { deepEqual } from '@/lib/utils/data.utils';
import CustomizableDropdown from './CustomizableDropdown';
import { BaseValue } from './Dropdown';

interface FormState {
  errorMessage?: string | null;
  successMessage?: string | null;
  errors?: { name: string; message: string }[];
}

type Item<T = BaseValue> = BaseValue & FormState & T;

export interface FormManagerProps<T> {
  register: UseFormRegister<Item<T>>;
  errors: FieldErrors<Item<T>>;
  setValue: UseFormSetValue<Item<T>>;
  showSave: boolean;
  selectedItem: Item<T>;
  isLoading: boolean;
  isFormDisabled: boolean;
}

interface ConfigurationManagerProps<T> {
  items$: Promise<Item<T>[]>;
  selected?: Item<T>;
  editableItems?: boolean;
  translationKey: string;
  tooltipKey?: string;
  optonLabelProp: string;
  titleKey: string;
  movableItems?: boolean;
  onCreate: (title: string) => Promise<State<Item<T> | null>>;
  onEdit: (id: any, title: string) => Promise<State<Item<T> | null>>;
  onMove?: (item: Item<T>, order: number, items: Item<T>[]) => Promise<Item<T>[]>;
  onDelete: (id: any) => Promise<State<Item<T> | null>>;
  onSubmit: (item: Item<T>, nativeEvent?: any) => Promise<State<Item<T> | null>>;
  onSelectedChanged?: (item: Item<T>) => void;
  children: (props: FormManagerProps<T>) => ReactNode;
}

export default function ConfigurationManager<T>({
  items$,
  selected,
  translationKey,
  editableItems,
  titleKey,
  tooltipKey,
  optonLabelProp,
  movableItems,
  onCreate,
  onEdit,
  onDelete,
  onSubmit,
  onMove,
  onSelectedChanged,
  children,
}: ConfigurationManagerProps<T>) {
  const t = useTranslations();
  const items = use(items$);
  const [selectedItem, setSelectedItem] = useState<Item<T>>({} as Item<T>);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<Item<T>>({
    defaultValues: (selectedItem || {}) as any,
    mode: 'onChange',
    shouldFocusError: true,
    disabled: !Object.keys(selectedItem).length,
  });
  const formValues = watch();
  const isFormDisabled = useMemo(() => !Object.keys(selectedItem).length, [selectedItem]);
  const isFormChanged = useMemo(() => !deepEqual(formValues, selectedItem), [selectedItem, formValues]);

  const handleItemSelect = useCallback(
    (item: Item<T>, emit: boolean = true) => {
      setSelectedItem(item);
      emit && onSelectedChanged?.(item);
      item &&
        Object.keys(item as object).forEach((key: string) =>
          setValue(key as Path<Item<T>>, item[key as keyof Item<T>] as any)
        );
    },
    [setValue]
  );

  const onSubmitHandler = useCallback(
    async (data: Item<T>, { nativeEvent }: any) => {
      const response = await onSubmit(data, nativeEvent);

      if (response.errors) {
        return response.errors.forEach(({ name, message }: any) => setError(name, { message }));
      }

      response.value && handleItemSelect(response.value);
      setValue('errorMessage' as Path<Item<T>>, response.error as any);
      setValue('successMessage' as Path<Item<T>>, response.successMessage as any);
    },
    [onSubmit]
  );

  useEffect(() => {
    const item = (selectedItem?.id && items.find((item) => item.id === selectedItem.id)) || items?.[0];
    item && handleItemSelect(item);
  }, [items]);

  useEffect(() => {
    selected && setSelectedItem(selected);
  }, [selected]);

  return (
    <div className="flex flex-grow flex-col">
      <CustomizableDropdown
        optonLabelProp={optonLabelProp}
        selectedValue={selectedItem}
        editableItems={editableItems}
        values={items}
        movableItems={movableItems}
        onSelect={(value: any) => handleItemSelect(value as Item<T>)}
        translationKey={translationKey}
        tooltipKey={tooltipKey}
        handleCreation={onCreate}
        handleEdit={onEdit}
        handleDelete={onDelete}
        handleMove={onMove}
      />

      <div className="flex min-h-0 flex-grow flex-col gap-y-5 pt-7">
        <h4 className="ps-5 text-sm font-bold uppercase text-main">{t(titleKey)}</h4>

        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmitHandler)}>
          {children({
            register,
            errors,
            setValue,
            showSave: isFormChanged,
            selectedItem,
            isLoading: isLoading || isSubmitting,
            isFormDisabled,
          })}
          {formValues.errorMessage && <p className="text-salmon">{t(formValues.errorMessage)}</p>}
          {formValues.successMessage && <p className="text-dark-aquamarine">{t(formValues.successMessage)}</p>}
        </form>
      </div>
    </div>
  );
}
