'use client';

import { JSX, ReactNode, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export interface TabOption {
  nameKey?: string;
  name?: string;
  listItemContent?: ReactNode | Promise<JSX.Element>;
  content: ((props: any) => JSX.Element) | JSX.Element;
  props?: any;
  className?: string;
}

export default function Tabs({
  id,
  tabs,
  hideList,
  className,
  listClassName,
  panelClassName,
  tabClassName,
  initialTabName,
}: {
  id?: string;
  hideList?: boolean;
  tabs: TabOption[];
  className?: string;
  listClassName?: string;
  panelClassName?: string;
  tabClassName?: string;
  initialTabName?: string;
}) {
  const t = useTranslations();
  const [tabIndex, setTabIndex] = useState(initialTabName ? tabs.findIndex((tab) => tab.name === initialTabName) : 0);

  return (
    <TabGroup
      className={twMerge('flex min-h-0 flex-grow flex-col justify-between gap-y-2.5 rounded-xl', className)}
      selectedIndex={tabIndex}
      onChange={setTabIndex}
    >
      {!hideList && (
        <TabList
          key={id}
          className={twMerge('flex w-full flex-row flex-nowrap rounded-xl border border-white/[2%]', listClassName)}
        >
          {tabs.map(({ listItemContent, nameKey, name }, index: number) => (
            <Tab
              key={nameKey || `tab-${index}`}
              className={twMerge(
                'flex flex-1 items-center justify-center rounded-xl text-light-gray focus:outline-none data-[hover]:bg-background/[44%] data-[hover]:data-[selected]:bg-background data-[selected]:bg-background data-[hover]:text-main data-[selected]:text-main',
                tabClassName
              )}
            >
              {listItemContent ? listItemContent : nameKey ? t(nameKey) : name}
            </Tab>
          ))}
        </TabList>
      )}
      <TabPanels
        className={twMerge('flex flex-grow rounded-xl md:overflow-y-auto md:overflow-x-hidden', panelClassName)}
      >
        {tabs.map(({ name, content, className }: TabOption, index: number) => (
          <TabPanel key={`panel-${name || index}`} className={twMerge('w-full', className)}>
            {typeof content === 'function' ? content({ name }) : content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
