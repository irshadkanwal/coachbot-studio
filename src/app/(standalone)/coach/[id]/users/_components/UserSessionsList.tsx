import { memo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { CoachRoutes, PrivateRoutes } from '@/lib/constants';
import type { AssistantUserChat } from '@/lib/models/assistant.models';
import { getDateDay, getDayLabel } from '@/lib/utils/date.utils';
import { calculateChatDurationSeconds, formatDuration, sortByCreatedAtDesc } from '@/lib/utils/user-session.utils';
import { Button } from '@/shared/Button';
import EmptyUserSessionsState from '@/shared/EmptyStates/EmptyUserSessionsState';

const ViewSessionButton = memo(function ViewSessionButton({
  session,
  assistantId,
  isHighLevel,
}: {
  session: AssistantUserChat;
  assistantId: string;
  isHighLevel: boolean;
}) {
  const t = useTranslations();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative flex flex-grow justify-end"
      onMouseEnter={() => isHighLevel && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Button
        variant="outline"
        className="border border-background-border/[6%] text-sm text-storm-gray hover:!text-main disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-storm-gray group-hover:text-light-gray"
        href={
          isHighLevel
            ? undefined
            : `${PrivateRoutes.coach}/${assistantId}${CoachRoutes.conversations}?sessionId=${session.id}`
        }
        disabled={isHighLevel}
      >
        {t('CoachDetails.Users.SessionsList.viewSessionButton')}
      </Button>
      {showTooltip && isHighLevel && (
        <div className="absolute bottom-full right-0 z-50 mb-2 w-max max-w-xs rounded-lg bg-main px-3 py-2 text-xs text-background shadow-lg">
          {t('CoachDetails.tooltips.conversationsDisabled')}
        </div>
      )}
    </div>
  );
});

const UserSessionsList = memo(function UserSessionsList({
  sessions,
  assistantId,
  isHighLevel = false,
}: {
  sessions?: AssistantUserChat[];
  assistantId: string;
  isHighLevel?: boolean;
}) {
  const t = useTranslations();

  if (!sessions) return null;

  const sortedSessions = sortByCreatedAtDesc(sessions);

  if (sortedSessions.length === 0) {
    return <EmptyUserSessionsState />;
  }

  return (
    <ul className="flex w-full flex-grow flex-col gap-y-1 overflow-y-auto overflow-x-hidden">
      {sortedSessions.map((session) => {
        const duration = formatDuration(calculateChatDurationSeconds(session.messages));

        return (
          <li
            key={`session-${session.id}`}
            className="group flex items-center justify-between divide-x divide-storm-gray rounded-xl border border-transparent px-2.5 py-1.5 hover:border-background-border/[16%] hover:bg-white-opacity"
          >
            <div className="flex w-1/4 shrink-0 flex-col justify-center gap-1 ps-1">
              <span className="text-xs text-light-gray">{getDayLabel(session.created_at)}</span>
              <span className="text-sm text-main">{getDateDay(session.created_at)}</span>
            </div>
            <div className="flex flex-grow items-center gap-8 ps-5">
              <div className="flex flex-1 items-center gap-1 text-sm">
                <span className="font-medium text-main">{session.messages?.length}</span>
                <span className="text-light-gray">{t('CoachDetails.Users.SessionsList.messagesLabel')}</span>
              </div>
              <div className="flex flex-1 items-center gap-x-3 text-sm">
                <span className="text-light-gray">&#9642;</span>
                <span className="text-main">{duration}</span>
              </div>
              <ViewSessionButton session={session} assistantId={assistantId} isHighLevel={isHighLevel} />
            </div>
          </li>
        );
      })}
    </ul>
  );
});

export default UserSessionsList;
