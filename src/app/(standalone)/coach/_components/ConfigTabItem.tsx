import { getTranslations } from 'next-intl/server';
import { twMerge } from 'tailwind-merge';

import { ConfigToggler } from './ConfigToggler';

export async function ConfigTabItem({
  nameKey,
  descriptionKey,
  onToggle,
  iconClass,
  iconPaths,
  checked,
  disabled,
}: {
  iconClass?: string;
  nameKey: string;
  iconPaths?: number;
  descriptionKey: string;
  checked?: boolean;
  disabled?: boolean;
  onToggle?: (on: boolean) => Promise<any>;
}) {
  const t = await getTranslations();

  return (
    <div
      className={twMerge(
        'flex flex-grow justify-between rounded-xl bg-white-opacity px-6 py-3.5',
        checked && 'bg-dark-aquamarine/[11%]'
      )}
    >
      <div className="flex flex-col gap-y-1">
        <h5 className="inline-flex gap-x-1.5 text-start text-lg font-semibold uppercase text-main">
          {iconClass && (
            <span className={iconClass}>
              {iconPaths &&
                Array.from({ length: iconPaths }).map((_: any, i: number) => (
                  <span key={i} className={`path${i + 1}`}></span>
                ))}
            </span>
          )}
          {t(nameKey)}
        </h5>
        <p className="line-clamp-2 text-start text-light-gray">{t(descriptionKey)}</p>
      </div>
      {(onToggle || disabled) && <ConfigToggler checked={checked} onToggle={onToggle} disabled={disabled} />}
    </div>
  );
}
