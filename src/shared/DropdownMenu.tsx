'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

import ComingSoon from './CoomingSoon';

export interface MenuOption {
  label?: string;
  labelKey?: string;
  subTitle?: string;
  link?: string;
  inDevelompent?: boolean;
  divider?: boolean;
  icon?: string;
  className?: string;
  disabled?: boolean;
  onClick?: (data: any) => void | Promise<any>;
  children?: (close: () => any) => ReactNode;
}

interface DropdownMenuProps {
  menuId?: string;
  menuBtnClass?: string;
  menuBtnIcon?: string;
  menuItemsClass?: string;
  options: MenuOption[];
}

export function DropdownMenu({ menuId, menuBtnClass, menuBtnIcon, menuItemsClass, options }: DropdownMenuProps) {
  const router = useRouter();

  return (
    <Popover>
      {({ close }) => (
        <div key={menuId} className="relative">
          <PopoverButton
            className={twMerge(
              'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-main focus:outline-none data-[focus]:text-main data-[hover]:text-main data-[open]:text-main',
              menuBtnClass
            )}
            type="button"
          >
            {menuBtnIcon && <i className={menuBtnIcon} />}
          </PopoverButton>

          <PopoverPanel
            transition
            anchor="bottom end"
            className={twMerge(
              'z-10 mt-1 flex w-max min-w-40 flex-col gap-y-1.5 rounded-xl border border-light-gray bg-violet-950 p-2.5 text-light-gray transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0',
              menuItemsClass
            )}
          >
            {options?.map((option, id) => (
              <React.Fragment key={`menu-item-${id}`}>
                {option.children ? (
                  option.children(close)
                ) : (
                  <div className="w-full">
                    <button
                      type="button"
                      disabled={option.disabled}
                      onClick={async () => {
                        if (option.disabled) return;
                        if (option.link) {
                          router.push(option.link);
                        } else {
                          await option.onClick?.(menuId);
                        }
                        close();
                      }}
                      className={twMerge(
                        'group flex w-full items-center justify-start gap-2 p-1.5 text-base font-semibold hover:text-main focus:outline-none',
                        'data-[focus]:text-main data-[hover]:text-main',
                        option.disabled && 'cursor-not-allowed opacity-50 hover:text-light-gray',
                        option.className
                      )}
                    >
                      {option.icon && <i className={option.icon} />}
                      <div className="flex flex-col items-start justify-start">
                        {option.label}
                        {option.subTitle && <span className="leading-4 text-light-gray">{option.subTitle}</span>}
                        {option.inDevelompent && <ComingSoon onlyLabel />}
                      </div>
                    </button>
                  </div>
                )}

                {option.divider && <div className="my-1 h-px bg-storm-gray" />}
              </React.Fragment>
            ))}
          </PopoverPanel>
        </div>
      )}
    </Popover>
  );
}
