import { getTranslations } from 'next-intl/server';

import { getAssistantClientUsers } from '@/server/actions/assistantActions';
import EmptyUsersState from '@/shared/EmptyStates/EmptyUsersState';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, t] = await Promise.all([params, getTranslations()]);
  const usersResponse = await getAssistantClientUsers(id);

  if (usersResponse.users.length === 0) {
    return (
      <div className="flex flex-grow flex-col">
        <EmptyUsersState />
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-y-4 text-center">
      <div className="rounded-full bg-graphic/[20%] p-6">
        <i className="cbi-user text-4xl text-light-gray" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-main">{t('CoachDetails.Users.selectUserText')}</h3>
        <p className="max-w-md text-sm text-light-gray">
          Choose a user from the list to view their activity and engagement metrics.
        </p>
      </div>
    </div>
  );
}
