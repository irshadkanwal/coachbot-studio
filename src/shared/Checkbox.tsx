import { useCallback, useEffect, useState } from 'react';
import { Field, Checkbox as HeadlessCheckbox, Label } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export default function Checkbox({
  selected,
  name,
  disabled,
  className,
  label,
  labelClassName,
  checkboxClassName,
  onChange,
}: {
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  name?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  onChange?: (value: boolean) => void;
}) {
  const [enabled, setEnabled] = useState(selected);

  useEffect(() => {
    if (selected !== undefined) {
      setEnabled(selected);
    }
  }, [selected]);

  const hadleChange = useCallback(
    (value: boolean) => {
      setEnabled(value);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );

  return (
    <Field className="flex items-center gap-2">
      <HeadlessCheckbox
        disabled={disabled}
        name={name}
        checked={enabled}
        onChange={hadleChange}
        className={twMerge(
          'group flex size-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset ring-dark-aquamarine',
          className
        )}
      >
        <span
          className={twMerge(
            'cbi-checkmark hidden text-[1.25rem] leading-6 text-dark-aquamarine group-data-[checked]:block',
            checkboxClassName
          )}
        />
      </HeadlessCheckbox>
      {label && <Label className={labelClassName}>{label}</Label>}
    </Field>
  );
}
