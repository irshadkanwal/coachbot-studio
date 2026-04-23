import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RangeProps {
  id: string;
  currentValue?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  labelClassName?: string;
  customColor?: string;
  onValueSelected?: (value: number) => void;
}

export const Range: React.FC<RangeProps> = ({
  id,
  onValueSelected,
  currentValue,
  className,
  labelClassName,
  label,
  min = 0.0,
  max = 1.0,
  step = 0.01,
  customColor = 'dark-aquamarine',
}) => {
  const [value, setValue] = useState<number>(min);

  useEffect(() => {
    setValue(currentValue ?? min);
  }, [currentValue, min]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex min-w-0 flex-col gap-y-4 pb-7 pe-2">
      {label && (
        <label htmlFor={id} className={twMerge('text-base uppercase text-main', labelClassName)}>
          {label}
        </label>
      )}
      <div
        className={twMerge('relative flex flex-grow flex-col items-center justify-center pt-2.5', className)}
        style={
          {
            '--custom-color': `rgb(var(--colors-${customColor}))`,
          } as React.CSSProperties
        }
      >
        <input
          id={id}
          type="range"
          data-value={value.toFixed(2)}
          min={min}
          max={max}
          step={step}
          style={{ '--track-percentage': `${percentage}%`, '--current-value': `${value}` } as React.CSSProperties}
          className={twMerge('range-slider z-10 h-1 w-full cursor-pointer appearance-none rounded-lg transition-all')}
          value={value}
          onChange={(event) => setValue(parseFloat(event.target.value))}
          onMouseUp={() => onValueSelected && onValueSelected(value)}
          onTouchEnd={() => onValueSelected && onValueSelected(value)}
        />
        <span className="absolute left-0.5 top-full mt-2 text-sm text-light-gray">{min.toFixed(2)}</span>
        <span className="absolute right-0.5 top-full mt-2 text-sm text-light-gray">{max.toFixed(2)}</span>
      </div>
    </div>
  );
};
