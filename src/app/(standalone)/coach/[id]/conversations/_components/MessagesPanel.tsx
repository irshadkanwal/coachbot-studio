'use client';

import { memo, useEffect, useState } from 'react';

import { Messages } from '@/app/(main)/chat/_components';
import { AssistantChat } from '@/lib/models/assistant.models';
import { sortByCreatedAt } from '@/lib/utils/user-session.utils';
import EmptyMessagesState from '@/shared/EmptyStates/EmptyMessagesState';
import EmptySessionNotFoundState from '@/shared/EmptyStates/EmptySessionNotFoundState';
import MessageListSkeleton from '@/shared/skeletons/MessageListSkeleton';

interface MessagesPanelProps {
  activeSession: AssistantChat | null;
  isLoading?: boolean;
  sessionNotFound?: boolean;
}

const MessagesPanel = memo(function MessagesPanel({
  activeSession,
  isLoading = false,
  sessionNotFound = false,
}: MessagesPanelProps) {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (activeSession) {
      setShowSkeleton(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [activeSession?.id]);

  if (isLoading || showSkeleton) {
    return <MessageListSkeleton count={6} />;
  }

  if (sessionNotFound) {
    return <EmptySessionNotFoundState />;
  }

  if (!activeSession) {
    return <EmptyMessagesState />;
  }

  const orderedMessages = sortByCreatedAt(activeSession?.messages || []).reverse();

  if (!orderedMessages.length) {
    return <EmptyMessagesState />;
  }

  return <Messages messages={orderedMessages} />;
});

export default MessagesPanel;
