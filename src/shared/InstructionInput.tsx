'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { Button } from './Button';
import Tooltip from './Tooltip';

interface InstructionInputProps {
  id: string;
  name: string;
  className?: string;
  labelKey?: string;
  tooltipKey?: string;
  initialValue?: string;
  disabled?: boolean;
  isLoading?: boolean;
  required?: boolean;
  topControls?: boolean;
  bottomControls?: boolean;
  showSaveOnChanges?: boolean;
  showSave?: boolean;
  onBlur?: (value: string) => void;
  register?: any;
  errors?: any;
}

export default function InstructionInput({
  id,
  name,
  labelKey,
  tooltipKey,
  className,
  disabled,
  isLoading,
  initialValue,
  topControls = true,
  bottomControls = true,
  showSaveOnChanges = true,
  showSave = true,
  register,
  required,
  errors,
  onBlur,
}: InstructionInputProps) {
  const t = useTranslations();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  const isSaveVisible = useMemo(() => {
    return showSaveOnChanges ? initialValue !== value : showSave;
  }, [showSave, showSaveOnChanges, initialValue, value]);

  const inputProps = useMemo(() => {
    if (!register) {
      return { required, value, onChange: (e: any) => setValue(e.target.value), onBlur: () => onBlur && onBlur(value) };
    }

    const registerProps = register(name, { required });

    return {
      ...registerProps,
      onChange: async (e: any) => {
        setValue(e.target.value);
        await registerProps.onChange(e);
      },
      onBlur: async (e: any) => {
        onBlur && onBlur(value);
        await registerProps.onBlur(e);
      },
    };
  }, [register, onBlur, value]);

  return (
    <div className={twMerge('relative flex flex-col gap-y-2.5', className)}>
      <div className="flex items-center justify-between ps-5">
        <label htmlFor={id} className="inline-flex items-center gap-x-2 text-sm text-storm-gray">
          {labelKey && t(labelKey)}
          {tooltipKey && <Tooltip iconClass="cbi-message-question" tooltipLabel={tooltipKey} />}
        </label>
        {topControls && (
          <div className="flex gap-x-1">
            {/* TODO: uncomment when logic will be omplemented
            <Button variant="solid" color="primary" className="py-1.5" disabled>
              <i className="cbi-refresh" />
              {t('General.Instruction.refreshButton')}
            </Button> */}
            {/* <Button variant="outline" color="darkGray" className="py-1.5">
              {t('General.Instruction.userUpdatesButton')}
            </Button> */}
          </div>
        )}
      </div>

      <div
        className={twMerge(
          'relative flex flex-grow flex-col justify-between gap-y-3 rounded-lg border border-light-gray bg-white/[18%] p-1 pt-2',
          (disabled || isLoading) && 'border-light-gray/80 bg-white/[6%]'
        )}
      >
        <textarea
          id={id}
          name={name}
          className={twMerge(
            'focus:no-outline mx-1.5 flex flex-grow resize-none overflow-y-auto bg-transparent pb-20 pe-3 pt-4 text-base text-main focus:ring-0',
            isLoading && 'pointer-events-none animate-pulse',
            disabled && 'pointer-events-none opacity-10'
          )}
          {...inputProps}
        />

        {bottomControls && (
          <div className="absolute bottom-1 right-1 flex gap-x-1">
            {/* TODO: Revert back button once the reset functionality is available */}
            {/* <Button variant="solid" color="dark" className={disabled ? 'pointer-events-none animate-pulse' : ''}>
              <i className="cbi-undo" />
              {t('General.Instruction.resetButton')}
            </Button> */}
            {isSaveVisible && (
              <Button
                name={`${name}-submit`}
                type="submit"
                variant="solid"
                color="light"
                className={`${isLoading && 'pointer-events-none animate-pulse'}`}
              >
                <i className="cbi-archive-tick" />
                {t('General.Instruction.saveButton')}
              </Button>
            )}
          </div>
        )}
      </div>
      {errors && errors[name] && t.has(errors[name].message) && (
        <p className="text-sm text-salmon">{t(errors[name].message)}</p>
      )}
    </div>
  );
}
