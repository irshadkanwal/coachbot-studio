import { AssistantAccessMode } from '@/lib/models/assistant.models';
import { getAssistantUserChats } from '@/server/actions/assistantActions';
import { getAssistantData } from '@/server/db/assistantClient';
// import Tabs from '@/shared/Tabs';
import UserPageContent from '../_components/UserPageContent';

// import UserGoalTrack from './_components/UserGoalTrack';
// import UserGoalVision from './_components/UserGoalVision';

export default async function UserPage({ params }: { params: Promise<{ id: string; userId: string }> }) {
  const { id, userId } = await params;
  const [userChats, assistant] = await Promise.all([getAssistantUserChats(id, userId), getAssistantData(id)]);

  if (!userChats.length) {
    return <div className="flex shrink-0 flex-grow text-sm text-main">User's session data was not found</div>;
  }

  if (!assistant) {
    return <div className="flex shrink-0 flex-grow text-sm text-main">Assistant not found</div>;
  }

  const isHighLevel = assistant.accessMode === AssistantAccessMode.highLevel;

  //TODO: Add tabs back in when the feature is complete for User Goal Vision and Goal Track

  // const tabs = [
  //   {
  //     name: 'sessions',
  //     nameKey: 'CoachDetails.Users.DashboardTabs.0',
  //     content: <UserSessionsList sessions={userChats} assistantId={id} />,
  //     className: 'w-full',
  //   },
  //   {
  //     name: 'goalVision',
  //     nameKey: 'CoachDetails.Users.DashboardTabs.1',
  //     content: <UserGoalVision assistant={assistant} userId={userId} />,
  //   },
  //   {
  //     name: 'goalTrack',
  //     nameKey: 'CoachDetails.Users.DashboardTabs.2',
  //     content: <UserGoalTrack assistant={assistant} userId={userId} />,
  //   },
  // ];

  return (
    <div className="flex flex-grow flex-col gap-y-3.5">
      <UserPageContent sessions={userChats} assistantId={id} isHighLevel={isHighLevel} />
      {/*
      //TODO: Uncomment this when the feature is complete for User Goal Vision and Goal Track
       <Tabs
        id="user-session-tabs"
        listClassName="bg-graphic/[14%] p-0.5"
        tabClassName="py-2 text-sm"
        panelClassName="flex-grow"
        tabs={tabs}
      /> */}
    </div>
  );
}
