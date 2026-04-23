'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Chat } from '@/lib/models/chat.models';
import { getDateDay, getDateWeekDay, getTime } from '@/lib/utils/date.utils';
import { deleteChat } from '@/server/actions/chatActions';
import { ExportChatButton } from '@/shared/FunctionalButtons';
import { DeleteWithConfirmationButton } from '@/shared/ModalButtons';

const modalConfig = {
  buttonTitleKey: 'Chat.deleteModal.submitButton',
  buttonIcon: 'cbi-trash',
  titleIcon: 'cbi-send',
  titleKey: 'Chat.deleteModal.title',
  variant: 'red',
};

export default function ChatList({ chats }: { chats: Chat[] | null }) {
  const t = useTranslations();
  const allChats = chats;

  if (!allChats) {
    return <div>No chats</div>;
  }

  return (
    <ul className="flex flex-grow flex-col gap-y-1 overflow-y-auto overflow-x-hidden">
      {allChats.map((chat: Chat) => (
        <li
          key={chat.id}
          className="flex w-full flex-nowrap items-center gap-x-3 rounded-xl px-4 py-2.5 hover:bg-white-opacity"
        >
          <Link href={`/chat/${chat.id}`} className="flex flex-grow items-center gap-x-3">
            <div className="flex flex-grow flex-col">
              <span className="text-sm text-light-gray">{getDateWeekDay(chat.created_at)}</span>
              <span className="text-base text-main">{getDateDay(chat.created_at)}</span>
            </div>
            <div className="text-base font-medium text-main">{getTime(chat.created_at)}</div>
          </Link>
          <ExportChatButton chat={chat} />
          <DeleteWithConfirmationButton
            iconClassName="cbi-trash !text-xl"
            className="p-0 text-xl text-storm-gray hover:text-main"
            config={{
              ...modalConfig,
              confirm: async () => {
                await deleteChat(chat.id);
              },
            }}
          >
            <div className="flex flex-col gap-y-5 text-main">
              <p>{t('Chat.deleteModal.content', { name: chat.name })}</p>
            </div>
          </DeleteWithConfirmationButton>
        </li>
      ))}
    </ul>
  );
}
