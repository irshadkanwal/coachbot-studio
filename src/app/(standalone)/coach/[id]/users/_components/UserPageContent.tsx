'use client';

import { memo, useEffect, useState } from 'react';

import { AssistantUserChat } from '@/lib/models/assistant.models';
import EmptyUserSessionsState from '@/shared/EmptyStates/EmptyUserSessionsState';
import UserSessionsAnalyticsSkeleton from '@/shared/skeletons/UserSessionsAnalyticsSkeleton';
import UserSessionsListSkeleton from '@/shared/skeletons/UserSessionsListSkeleton';
import UserSessionsAnalytics from './UserSessionsAnalytics';
import UserSessionsList from './UserSessionsList';

interface UserPageContentProps {
  sessions: AssistantUserChat[];
  assistantId: string;
  isHighLevel?: boolean;
}

const UserPageContent = memo(function UserPageContent({
  sessions,
  assistantId,
  isHighLevel = false,
}: UserPageContentProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-grow flex-col gap-y-3.5">
        <UserSessionsAnalyticsSkeleton />
        <UserSessionsListSkeleton count={5} />
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return <EmptyUserSessionsState />;
  }

  return (
    <div className="flex flex-grow flex-col gap-y-3.5">
      <UserSessionsAnalytics sessions={sessions} />
      <UserSessionsList sessions={sessions} assistantId={assistantId} isHighLevel={isHighLevel} />
    </div>
  );
});

export default UserPageContent;
