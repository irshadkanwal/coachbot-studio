import React from 'react';
import { redirect } from 'next/navigation';

import { PrivateRoutes } from '@/lib/constants';
import { AssistantAccessMode } from '@/lib/models/assistant.models';
import { getAssistantChatById, getCachedAssistantChats } from '@/server/actions/assistantActions';
import { getUser } from '@/server/actions/userActions';
import { getAssistantData } from '@/server/db/assistantClient';
import ConsentModal from '../../_components/ConsentModal';
import MessagesPanel from './_components/MessagesPanel';
import SessionsList from './_components/SessionsList';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sessionId: string }>;
}) {
  const [{ id }, { sessionId }, user] = await Promise.all([params, searchParams, getUser()]);
  const [platformSessions, assistant] = await Promise.all([
    getCachedAssistantChats(id, { limit: 20 }),
    getAssistantData(id),
  ]);

  const sessions = {
    items: platformSessions.items,
    page: 1,
    limit: 20,
    count: platformSessions.count,
    total: platformSessions.total,
    hasMore: platformSessions.hasMore,
  };
  let activeSession = sessionId ? (sessions.items.find(({ id }) => id === sessionId) ?? null) : null;
  let sessionNotFound = false;
  if (sessionId && !activeSession) {
    activeSession = await getAssistantChatById(id, sessionId);
    if (!activeSession) {
      sessionNotFound = true;
    }
  }

  if (!assistant || assistant?.accessMode !== AssistantAccessMode.fullAccess) {
    return redirect(`${PrivateRoutes.dashboard}?status=${assistant?.status}`);
  }

  if (!user?.consentAccepted) {
    return <ConsentModal id={id} />;
  }

  const emptyChats = {
    items: [],
    page: 1,
    limit: 20,
    count: 0,
    total: 0,
    hasMore: false,
  };

  return (
    <section className="flex min-h-0 flex-grow gap-x-5">
      <SessionsList
        assistantId={id}
        initialData={sessions}
        initialPlatformData={platformSessions}
        initialInternalData={emptyChats}
        className="flex w-[48%] shrink flex-col"
      />
      <div className="flex shrink-0 flex-grow basis-[50%] flex-col gap-y-1 overflow-y-auto overflow-x-hidden">
        <MessagesPanel activeSession={activeSession} sessionNotFound={sessionNotFound} />
      </div>
    </section>
  );
}
