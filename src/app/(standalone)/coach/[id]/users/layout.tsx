import { redirect } from 'next/navigation';

import { PrivateRoutes } from '@/lib/constants';
import { AssistantAccessMode } from '@/lib/models/assistant.models';
import { getAssistantClientUsers } from '@/server/actions/assistantActions';
import { getUser } from '@/server/actions/userActions';
import { getAssistantData } from '@/server/db/assistantClient';
import ConsentModal from '../../_components/ConsentModal';
import UsersList from './_components/UsersList';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, getUser()]);
  const assistant = await getAssistantData(id);

  const isFullAccess = assistant?.accessMode === AssistantAccessMode.fullAccess;
  const isHighLevel = assistant?.accessMode === AssistantAccessMode.highLevel;
  const usersAllowed = isFullAccess || isHighLevel;

  if (!assistant || !usersAllowed) {
    return redirect(`${PrivateRoutes.dashboard}?status=${assistant?.status}`);
  }

  if (!user?.consentAccepted) {
    return <ConsentModal id={id} />;
  }

  const initialUsersResponse = await getAssistantClientUsers(id, {
    limit: 2,
  });

  return (
    <section className="flex min-h-0 flex-grow gap-x-5">
      <UsersList users$={Promise.resolve(initialUsersResponse)} className="flex w-[48%] shrink flex-col" />
      <div className="flex shrink-0 flex-grow basis-[50%]">{children}</div>
    </section>
  );
}
