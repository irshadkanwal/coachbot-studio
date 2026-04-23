import React, { Suspense } from 'react';
import { unstable_cache } from 'next/cache';

import { AsideContextProvider } from '@/contexts/AsideContext';
import { getSessionUser } from '@/server/actions/sessionActions';
import { getUserChats } from '@/server/db/chatClient';
import { NewChatButton } from '@/shared/FunctionalButtons';
import Sidebar from '@/shared/Sidebar';
import { ListSkeleton } from '@/shared/skeletons/ListSkeleton';
import { ChatList, ChatModeSwitcher } from './_components';

export const dynamicParams = true;

const getCachedChats = unstable_cache(async (userId: string) => getUserChats(userId), ['chats'], {
  revalidate: 1800,
  tags: ['chats'],
});

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const userId = await getSessionUser();
  const chats = userId ? await getCachedChats(userId) : [];

  return (
    <AsideContextProvider isOpen={false}>
      <section className="relative flex min-h-0 flex-grow flex-col gap-y-2.5 rounded-xl border border-light-gray p-2.5">
        <div className="relative flex min-h-0 w-full min-w-0 flex-grow justify-between gap-x-2.5">
          <div className="flex w-1/4 min-w-72 shrink-0 flex-grow flex-col justify-between gap-y-2.5 2xl:max-w-sm 3xl:max-w-lg">
            <Sidebar
              titleKey="Chat.sidebarTitle"
              titleClassName="text-sm text-light-gray"
              openClassName="w-full"
              showOpen={true}
              openButtonLabel={'Chat.chatHistoryButton'}
              className="shrink flex-grow bg-graphic/[14%]"
              contentClassName="pt-0"
            >
              <Suspense fallback={<ListSkeleton length={5} />}>
                <ChatList chats={chats} />
              </Suspense>
            </Sidebar>
            <div className="flex min-h-0 min-w-0 max-w-96 shrink-0 items-center justify-between gap-x-3 px-2 py-0.5">
              <NewChatButton />
              <ChatModeSwitcher />
            </div>
          </div>
          <div className="flex min-h-0 w-3/4 min-w-0 flex-grow flex-col">{children}</div>
        </div>
      </section>
    </AsideContextProvider>
  );
}
