import { Suspense } from 'react';

import { getChat } from '@/server/actions/chatActions';
import { MessagesSkeleton } from '@/shared/skeletons/MessagesSkeleton';
import { Chat } from '../_components';
import StageAnalysisRefresher from '../_components/StageAnalysisRefresher';

export interface ChatProps {
  params: Promise<{ id: string }>;
}
export default async function ChatPage({ params }: ChatProps) {
  const { id } = await params;
  const chat$: Promise<any> = getChat(id);

  return (
    <>
      <StageAnalysisRefresher />
      <Suspense fallback={<MessagesSkeleton />}>
        <Chat chat$={chat$} />
      </Suspense>
    </>
  );
}
