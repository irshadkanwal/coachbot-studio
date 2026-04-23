import { useCallback, useState } from 'react';
import { Switch } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export default function Switcher({ className, onChange }: { className?: string; onChange?: (value: boolean) => void }) {
  const [enabled, setEnabled] = useState(false);

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
    <Switch
      checked={enabled}
      onChange={hadleChange}
      className={twMerge(
        'group relative flex h-5 w-8 cursor-pointer rounded-full bg-main/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[checked]:bg-main/10 data-[focus]:outline-1 data-[focus]:outline-main',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={twMerge(
          'pointer-events-none inline-block size-3 translate-x-0 rounded-full shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-3',
          enabled ? 'bg-main' : 'bg-light-gray'
        )}
      />
    </Switch>
  );
}
