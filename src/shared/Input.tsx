'use client';

import { forwardRef, ReactNode, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export interface InputProps {
  children?: ReactNode;
  id: string;
  name?: string;
  type?: string;
  className?: string;
  inputClassName?: string;
  placeholderKey?: string;
  placeholder?: string;
  disablePalaceholderKey?: string;
  initialValue?: string;
  labelKey?: string;
  disabled?: boolean;
  readOnly?: boolean;
  isSubmitting?: boolean;
  labelClassName?: string;
  step?: string;
  onChange?: (event: any) => any;
  onBlur?: (event: any) => any;
  onKeyDown?: (event: any) => any;
  onFocus?: (event: any) => any;
  required?: boolean;
  max?: string | number;
  min?: string | number;
  value?: string;
  autoComplete?: HTMLInputElement['autocomplete'];
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      id,
      type = 'text',
      name,
      className,
      inputClassName,
      placeholderKey,
      placeholder,
      disablePalaceholderKey,
      labelKey,
      labelClassName,
      disabled,
      children,
      initialValue,
      isSubmitting,
      readOnly,
      required,
      max,
      min,
      value,
      ...props
    },
    ref
  ) => {
    const t = useTranslations();
    const elRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

    const adjustHeight = useCallback(() => {
      if (type === 'textarea' && elRef?.current) {
        elRef.current.style.height = 'auto';
        elRef.current.style.height = `${elRef.current.scrollHeight + 2}px`;
      }
    }, [elRef]);

    useEffect(() => adjustHeight(), [isSubmitting, initialValue]);

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined;
    const inputValue = isControlled ? { value } : { defaultValue: initialValue };

    return (
      <div className={twMerge('relative flex flex-col gap-x-2 font-normal', className)}>
        {labelKey && (
          <label htmlFor={id} className={twMerge('text-base text-light-gray', labelClassName)}>
            {t(labelKey)}
            {required && <span className="ml-1 text-red-500">*</span>}
            {children}
          </label>
        )}
        {type === 'textarea' ? (
          <textarea
            ref={(el) => {
              elRef.current = el;
              if (typeof ref === 'function') ref(el);
              else if (ref) (ref as any).current = el;
            }}
            id={id}
            disabled={disabled}
            rows={1}
            {...inputValue}
            name={name}
            placeholder={
              disabled && disablePalaceholderKey ? t(disablePalaceholderKey) : placeholderKey && t(placeholderKey)
            }
            className={twMerge(
              'focus:no-outline !max-h-40 resize-none overflow-y-auto rounded-lg border border-light-gray bg-white/[18%] px-4 py-3 text-lg text-main focus:ring-0',
              disabled && 'pointer-events-none animate-pulse bg-dark-gray/[80%] text-transparent placeholder:text-main',
              inputClassName
            )}
            {...props}
            onChange={async (e: any) => {
              adjustHeight();
              await props.onChange?.(e);
            }}
          />
        ) : (
          <input
            ref={ref as any}
            id={id}
            disabled={disabled}
            readOnly={readOnly}
            type={type}
            name={name}
            max={max}
            min={min}
            {...inputValue}
            placeholder={(placeholderKey && t(placeholderKey)) || placeholder}
            className={twMerge(
              'focus:no-outline rounded-lg border border-light-gray bg-white/[18%] px-4 py-2 text-lg text-main placeholder:text-base focus:ring-0',
              disabled && 'pointer-events-none animate-pulse bg-dark-gray/[80%] placeholder:hidden',
              inputClassName
            )}
            {...props}
          />
        )}
        {children}
      </div>
    );
  }
);

Input.displayName = 'Input';
