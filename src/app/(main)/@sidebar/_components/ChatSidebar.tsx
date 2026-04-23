'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { useRootContext } from '@/contexts/RootContextProvider';
import { SessionDetails, SessionDetailsTab } from '@/lib/models/common.models';
import Tabs, { TabOption } from '@/shared/Tabs';
import { ChatSidebarPanel } from './ChatSidebarPanel';

const tabsConfig: { nameKey: string; name: string; inDevelopment?: boolean }[] = [
  { nameKey: 'Sidebar.tabs.0', name: 'details' },
  { nameKey: 'Sidebar.tabs.1', name: 'progress', inDevelopment: true },
  { nameKey: 'Sidebar.tabs.2', name: 'context', inDevelopment: true },
];

export const mockTabsData: Record<string, SessionDetailsTab[]> = {
  progress: [
    {
      name: 'Current Stage',
      descriptions: [
        {
          type: 'list',
          title: 'Key Points',
          value: [
            '✨ Client greeted the coach.',
            '✨ Client inquired about the coach’s role.',
            '✨ Client expressed a desire to grow in life.',
          ],
        },
        {
          type: 'list',
          title: 'Progress',
          value: [
            '🎯 Client initiated conversation.',
            '🎯 Client initiated conversation.',
            '🎯 Client asked about the coach\’s role, indicating opennes to coaching.',
          ],
        },
        {
          type: 'list',
          title: 'Next Steps',
          value: [
            '- Clarify specific areas of growth the client is interested in.',
            '- Discuss potential goals and aspirations related to their growth.',
            '- Establish a comfortable and open environment for detailed discussion.',
          ],
        },
      ],
    },
    {
      name: 'Session Overview',
      descriptions: [
        {
          type: 'text',
          value:
            "The user has moved beyond initial greetings and expressed a desire to 'Growth my life,' indicating readiness to discuss specific topics related to personal growth.Basic rapport seems to be established as the user continues the conversation, showing openness to sharing.",
        },
      ],
    },
  ],
  context: [
    {
      name: 'Context',
      descriptions: [
        {
          type: 'text',
          value:
            'The user has not yet mentioned any past experiences, ongoing goals, or provided enough detail that suggests a need for historical context at this stage.',
        },
      ],
    },
  ],
};

export default function ChatSidebar() {
  const t = useTranslations();
  const { sessionDetails, chatInfo, user } = useRootContext();
  const tabs: TabOption[] = useMemo(() => {
    const isEmptyData =
      !sessionDetails ||
      Object.values(sessionDetails).every((value: SessionDetailsTab[]) =>
        value.every((item) => !item.descriptions.length)
      );

    if (isEmptyData) return [];

    return tabsConfig
      .map((config: any, key: number) => {
        const data = sessionDetails[config.name as keyof SessionDetails];

        if (!data) return;

        return {
          ...config,
          content: ({ name }: { name: string }) => (
            <ChatSidebarPanel
              id={`${name}-${key}`}
              key={key}
              data={data}
              name={name}
              inDevelopment={config.inDevelopment}
            />
          ),
        };
      })
      .filter(Boolean) as TabOption[];
  }, [sessionDetails]);

  return (
    <section className="flex min-h-0 flex-grow flex-col gap-y-5">
      <div className="flex flex-col gap-y-3 px-2">
        <h3 className={'text-nowrap pe-14 text-[1.25rem] uppercase text-main'}>{t('Sidebar.defaultTitle')}</h3>

        <h5 className={twMerge('line-clamp-3 text-base capitalize text-main')}>
          {!tabs.length ? t('Sidebar.emptyTitle', { name: user?.name || '' }) : chatInfo.stage.replaceAll('_', ' ')}
        </h5>
      </div>
      {!tabs.length ? (
        <div className="flex flex-col gap-y-2 rounded-lg bg-graphic/[14%] p-3 py-6">
          <p className="text-base text-light-gray">{t('Sidebar.emptyDescription')}</p>
        </div>
      ) : (
        <Tabs
          id="root-sidebar-tab"
          listClassName={`backdrop-blur-md order-2 bg-graphic/[14%] border-white/[44%] overflow-x-hidden ${tabs.length === 1 ? 'hidden border-none' : ''}`}
          panelClassName="order-1"
          tabClassName="py-3 px-5"
          tabs={tabs}
        ></Tabs>
      )}
    </section>
  );
}
