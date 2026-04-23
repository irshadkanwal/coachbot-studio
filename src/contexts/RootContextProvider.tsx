'use client';

import { createContext, Dispatch, SetStateAction, use, useContext, useEffect, useState } from 'react';

import { Assistant, AssistantStatus } from '@/lib/models/assistant.models';
import { Chat, ChatInfo, ChatMode } from '@/lib/models/chat.models';
import { SessionDetails, User } from '@/lib/models/common.models';
import { Stage } from '@/lib/models/instruction.models';
import { mapSessionStageAnalysis } from '@/lib/utils/chat.utils';
import { updateSession } from '@/server/actions/sessionActions';

interface RootContextType {
  selectedChat: Chat | null;
  user: User | null;
  setSelectedChat: (chat: Chat | null) => void;
  setChatInfo: Dispatch<SetStateAction<ChatInfo>>;
  chatInfo: ChatInfo;
  sessionDetails?: SessionDetails;
  assistants: Assistant[];
  selectedAssistant: Assistant | null;
  updateSelectedAssistant: (assistant: Assistant) => Promise<void>;
}

const RootContext = createContext<RootContextType | undefined>(undefined);

export function useRootContext() {
  const context = useContext(RootContext);

  if (context === undefined) {
    throw new Error('useRootContext must be used within a RootProvider');
  }

  return context;
}

export const RootContextProvider = ({
  firstStage$,
  assistants$,
  user$,
  children,
  sessionAssistantId,
}: {
  firstStage$: Promise<Stage | null>;
  assistants$: Promise<Assistant[]>;
  user$: Promise<User | null>;
  children: React.ReactNode;
  sessionAssistantId: string;
}) => {
  const firstStage = use(firstStage$);
  const assistants = use(assistants$);
  const currentUser = use(user$);
  const [user, setUser] = useState<User | null>(currentUser);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    assistants.find(
      (a) => ![AssistantStatus.inProgress, AssistantStatus.archived].includes(a.status as AssistantStatus)
    ) || null
  );

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatInfo, setChatInfo] = useState<ChatInfo>({
    stage: firstStage?.name || '',
    style: null,
    mode: ChatMode.new,
  });
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>({
    // progress: mockTabsData.progress,
    // context: mockTabsData.context,
  } as SessionDetails);

  const updateSelectedAssistant = async (assistant: Assistant) => {
    await updateSession({ assistantId: assistant?.id ?? null }, ['stages', 'styles', 'firstStage'], ['/instructions']);
    setSelectedAssistant(assistant ?? null);
  };

  useEffect(() => {
    setChatInfo((prevInfo) => ({ ...prevInfo, stage: selectedChat?.currentStage || firstStage?.name || '' }));
    setSessionDetails((prev) => ({ ...prev, details: mapSessionStageAnalysis(selectedChat?.stageAnalysis) }));
  }, [selectedChat]);

  useEffect(() => {
    setChatInfo((prevInfo) => ({ ...prevInfo, stage: selectedChat?.currentStage || firstStage?.name || '' }));
  }, [firstStage, selectedChat?.currentStage]);

  useEffect(() => setUser(user), [user]);

  useEffect(() => {
    if (assistants.length) {
      const selectedAssistant = sessionAssistantId && assistants.find((a) => a.id === sessionAssistantId);
      selectedAssistant ? setSelectedAssistant(selectedAssistant) : updateSelectedAssistant(assistants[0]);
    }
  }, [sessionAssistantId, assistants]);

  return (
    <RootContext.Provider
      value={{
        user,
        sessionDetails,
        chatInfo,
        selectedChat,
        assistants,
        selectedAssistant,
        updateSelectedAssistant,
        setSelectedChat,
        setChatInfo,
      }}
    >
      {children}
    </RootContext.Provider>
  );
};
