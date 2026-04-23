'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { usePagination } from '@/hooks/usePagination';
import { CoachRoutes, PrivateRoutes } from '@/lib/constants';
import { DEBOUNCE_DELAYS } from '@/lib/constants/pagination';
import { AssistantUser, AssistantUsersResponse } from '@/lib/models/assistant.models';
import { debounce } from '@/lib/utils/debounce.utils';
import { filterUsersBySessionTimeFrame, getSessionDate, isInactiveUser } from '@/lib/utils/user-session.utils';
import { getAssistantClientUsers } from '@/server/actions/assistantActions';
import { Chip } from '@/shared/Chip';
import ComingSoon from '@/shared/CoomingSoon';
import EmptyUsersState from '@/shared/EmptyStates/EmptyUsersState';
import ListSearchBar from '../../../_components/ListSearchBar';
import SidebarList from '../../../_components/SidebarList';

enum UserFilter {
  allTime = 'allTime',
  days30 = 30,
  days7 = 7,
  inactive = 'inactive',
}

const filterOptions = [
  { id: 0, value: UserFilter.allTime, labelKey: 'CoachDetails.Users.filterOptions.0' },
  { id: 1, value: UserFilter.days7, labelKey: 'CoachDetails.Users.filterOptions.1' },
  { id: 1, value: UserFilter.days30, labelKey: 'CoachDetails.Users.filterOptions.2' },
  { id: 1, value: UserFilter.inactive, labelKey: 'CoachDetails.Users.filterOptions.3' },
];

export default function UsersList({
  users$,
  className,
}: {
  users$: Promise<AssistantUsersResponse>;
  className?: string;
}) {
  const initialUsersResponse = use(users$);
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();

  const [timeFilter, setTimeFilter] = useState<UserFilter>(UserFilter.allTime);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const loadMoreUsers = useCallback(
    async (page: number, limit: number) => {
      const response = await getAssistantClientUsers(params.id as string, {
        needle: searchQuery,
        page,
        limit,
      });

      return {
        data: response.users,
        hasMore: response.hasMore,
        page: response.page,
        limit: response.limit,
      };
    },
    [params.id, searchQuery]
  );

  const searchUsers = useCallback(
    async (query: string, page: number, limit: number) => {
      setSearchLoading(true);

      const response = await getAssistantClientUsers(params.id as string, {
        needle: query,
        page,
        limit,
      });

      setSearchLoading(false);

      return {
        data: response.users,
        hasMore: response.hasMore,
        page: response.page,
        limit: response.limit,
      };
    },
    [params.id]
  );

  const {
    data: users,
    pagination,
    loadMore,
    search,
    reset: resetPagination,
  } = usePagination<AssistantUser>({
    initialData: initialUsersResponse.users,
    initialResponse: {
      data: initialUsersResponse.users,
      hasMore: initialUsersResponse.hasMore,
      page: initialUsersResponse.page,
      limit: initialUsersResponse.limit,
    },
    onLoadMore: loadMoreUsers,
    onSearch: searchUsers,
  });

  // Memoize debounced search to prevent recreation on every render
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        search(query);
      }, DEBOUNCE_DELAYS.SEARCH),
    [search]
  );

  useEffect(() => {
    if (searchQuery !== '') {
      debouncedSearch(searchQuery);
    } else {
      resetPagination();
    }
  }, [searchQuery, debouncedSearch, resetPagination]);

  const [activeUser, setActiveUser] = useState<AssistantUser | null>(
    users.find((user) => user.id === params.userId) || null
  );

  const filteredUsers = useMemo(() => filterUsersBySessionTimeFrame(users, timeFilter), [users, timeFilter]);

  if (initialUsersResponse.users.length === 0) {
    return (
      <div className={`m-3.5 flex gap-1 rounded-xl bg-graphic/[14%] p-3.5 ${className}`}>
        <EmptyUsersState />
      </div>
    );
  }

  return (
    <div className={`flex gap-3.5 rounded-xl p-3.5 ${className}`}>
      <ComingSoon textKey="CoachDetails.Conversations.whatsappNotAvailableText" className="py-0" onlyLabel={true} />
      <ListSearchBar
        isLoading={searchLoading}
        filterOptions={filterOptions}
        onSearch={(event) => setSearchQuery(event?.target?.value || '')}
        onFilterChanged={(value) => setTimeFilter(value.value)}
      />
      <SidebarList
        data={filteredUsers}
        emptyDescriptionKey="CoachDetails.Conversations.emptyList.title"
        emptyTitleKey={!initialUsersResponse?.users?.length ? 'CoachDetails.Conversations.emptyList.description' : ''}
        hasMore={pagination.hasMore}
        isLoading={pagination.isLoading}
        onLoadMore={loadMore}
      >
        {(item: AssistantUser, index: number) => (
          <li
            key={`user-list-item-${index}`}
            className={twMerge(
              'flex items-center gap-x-2 rounded-xl border border-transparent p-2.5 hover:bg-white-opacity',
              item.id === activeUser?.id && 'border-dark-aquamarine bg-white-opacity'
            )}
            onClick={() => {
              setActiveUser(item);
              router.push(`${PrivateRoutes.coach}/${params.id}${CoachRoutes.users}/${item.id}`);
            }}
          >
            <div className="flex flex-grow flex-col justify-start gap-y-1 overflow-hidden ps-1">
              <span
                className={`text-nowrap break-words text-sm font-bold uppercase ${item.id === activeUser?.id ? 'text-dark-aquamarine' : 'text-main'}`}
              >
                {item.name}
              </span>
              <span className="break-words text-xs text-light-gray">{item.email}</span>
              {isInactiveUser(item) && (
                <Chip
                  variant={'dark'}
                  size="s"
                  text={t('CoachDetails.Users.inactiveLabel')}
                  textClassName="text-xs border border-background-border/[18%]"
                  className="w-fit"
                />
              )}
            </div>
            <div className="flex flex-grow items-center justify-end gap-x-3.5">
              <div className="flex w-52 justify-evenly gap-x-3 divide-x divide-storm-gray rounded-xl border border-storm-gray px-3.5 py-2.5">
                <div className="flex flex-col justify-center gap-y-1 text-nowrap text-xs text-light-gray">
                  {t('CoachDetails.Users.firstSessionLabel')}
                  <span className="text-sm leading-3 text-main">{getSessionDate(item, false)}</span>
                </div>
                <div className="flex flex-col justify-center gap-y-1 text-nowrap ps-3 text-xs text-light-gray">
                  {t('CoachDetails.Users.lastSessionLabel')}
                  <span className="text-sm leading-3 text-main">{getSessionDate(item, true)}</span>
                </div>
              </div>
              <p className="flex flex-col justify-center gap-y-1 text-nowrap py-2.5 text-xs text-light-gray">
                {t('CoachDetails.Users.totalSessionsLabel')}
                <span className="text-sm text-main">{item.session.total ?? 0}</span>
              </p>
              {/* <div onClick={(e) => e.stopPropagation()}>
                  <Button className="h-fit rounded-xl border border-graphic/[14%] px-2.5 py-1 text-light-gray hover:bg-white-opacity hover:text-salmon">
                    <i className="cbi-warning"></i>
                    {t('CoachDetails.Users.reportButton')}
                  </Button>
                </div> */}
            </div>
          </li>
        )}
      </SidebarList>
    </div>
  );
}
