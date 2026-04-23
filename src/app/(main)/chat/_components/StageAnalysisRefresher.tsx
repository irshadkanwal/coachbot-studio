'use client';

import { useRef } from 'react';
import { useParams } from 'next/navigation';

import { useRootContext } from '@/contexts/RootContextProvider';
import { useSSE } from '@/hooks/useSSE';
import { getChat } from '@/server/actions/chatActions';

export default function StageAnalysisRefresher() {
  const params = useParams();
  const { setSelectedChat } = useRootContext();
  const chatId = params.id as string;
  const isRefreshing = useRef(false);

  const refreshChatData = async () => {
    if (isRefreshing.current) return;

    try {
      isRefreshing.current = true;
      const updatedChat = await getChat(chatId);
      if (updatedChat) {
        setSelectedChat(updatedChat);
      }
    } catch (error) {
      console.error('Error refreshing chat data:', error);
    } finally {
      isRefreshing.current = false;
    }
  };

  useSSE({
    events: {
      'chat-update': (data) => {
        if (data?.chatId === chatId) {
          refreshChatData();
        }
      },
    },
  });

  return null;
}
