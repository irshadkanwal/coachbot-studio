'use client';

import { use, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { useRootContext } from '@/contexts/RootContextProvider';
import { Chat as ChatModel, Message, MessageRole } from '@/lib/models/chat.models';
import { getMessage } from '@/lib/utils/chat.utils';
import { updateChat } from '@/server/actions/chatActions';

const Messages = dynamic(() => import('./Messages'));
const ControlPanel = dynamic(() => import('./ControlPanel'));

export default function Chat({ chat$ }: { chat$?: Promise<ChatModel | null> }) {
  const chat = chat$ ? use(chat$) : ({} as ChatModel);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const { chatInfo, setSelectedChat, selectedAssistant } = useRootContext();
  const router = useRouter();

  useEffect(() => {
    setSelectedChat(chat);
    setAllMessages(chat?.Messages || []);
  }, [chat?.Messages?.length]);

  const navigate = useCallback(
    async (id: string) => {
      if (!chat?.id || chat?.id !== id) {
        router.push(`/chat/${id}`);
      }
    },
    [chat?.id, router]
  );

  const handleMessageSend = useCallback(
    async (message: string) => {
      const newMessage = getMessage(message, MessageRole.user, chatInfo);
      if (!selectedAssistant?.id) {
        setAllMessages([
          { id: `${allMessages.length + 2}`, content: '', role: 'noAssistant' } as Message,
          newMessage,
          ...allMessages,
        ]);
        return;
      }

      setAllMessages([{ ...newMessage, isLoading: true }, ...allMessages]);

      const chatId = await updateChat(chat?.id, [newMessage, ...allMessages], chatInfo);

      chatId
        ? navigate(chatId)
        : setAllMessages((prev) =>
            prev.map((message) =>
              message.id === newMessage.id
                ? { ...message, error: true, isLoading: false }
                : { ...message, isLoading: false }
            )
          );
    },
    [chat, chatInfo, allMessages, selectedAssistant?.id]
  );

  return (
    <section className="z-0 flex min-h-0 flex-grow flex-col">
      <Messages className="" messages={allMessages} />
      <ControlPanel onSendMessage={handleMessageSend} />
    </section>
  );
}
