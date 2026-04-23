import { ComponentType, ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { Controller, FieldPath, FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

type FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  name: TName;
  labelKey?: string;
  as: ComponentType<any>;
  rules?: RegisterOptions<TFieldValues, TName>;
  defaultValue?: any;
  wrapperClassName?: string;
  labelClassName?: string;
  fieldClassName?: string;
  children?: React.ReactNode;
  value?: any;
  [key: string]: any;
};

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  labelKey,
  as: Component,
  rules,
  defaultValue,
  wrapperClassName,
  labelClassName,
  fieldClassName,
  children,
  value,
  ...props
}: FormFieldProps<TFieldValues, TName>): ReactElement {
  const t = useTranslations();
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const errorMsg = name.split('.').reduce((acc, key) => (acc && acc[key] ? acc[key] : undefined), errors as any)
    ?.message as string | undefined;

  return (
    <div className={twMerge('flex flex-col gap-y-1', wrapperClassName)}>
      {labelKey && t.has(labelKey) && <label className={labelClassName}>{t(labelKey)}</label>}
      <div className={fieldClassName}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          defaultValue={defaultValue}
          render={({ field }) => (
            <Component
              {...props}
              {...field}
              value={value ?? field.value ?? ''}
              onChange={(e: any) => {
                if (props.onChange) props.onChange(e);
                field.onChange(e);
              }}
            />
          )}
        />
        {children}
      </div>
      {errorMsg && <p className="order-3 w-full ps-3 text-sm text-salmon">{t(String(errorMsg))}</p>}
    </div>
  );
}
