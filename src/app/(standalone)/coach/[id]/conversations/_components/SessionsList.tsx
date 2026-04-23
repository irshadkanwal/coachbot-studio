'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { useFeatureFlagEnabled } from '@/hooks/useFeatureFlag';
import { usePagination } from '@/hooks/usePagination';
import { CoachRoutes, PrivateRoutes } from '@/lib/constants';
import { AssistantChat } from '@/lib/models/assistant.models';
import { PaginatedData } from '@/lib/models/common.models';
import { FeatureFlags } from '@/lib/services/featureFlags';
import { getDateDay, getDayLabel } from '@/lib/utils/date.utils';
import { debounce } from '@/lib/utils/debounce.utils';
import { getAssistantChats } from '@/server/actions/assistantActions';
import { getChats } from '@/server/actions/chatActions';
import ComingSoon from '@/shared/CoomingSoon';
import { ExportSessionsButton } from '@/shared/FunctionalButtons';
import SessionListSkeleton from '@/shared/skeletons/SessionListSkeleton';
import TranscriptUpload from '@/shared/TranscriptUpload';
import ListSearchBar from '../../../_components/ListSearchBar';
import SidebarList from '../../../_components/SidebarList';
import { SessionsByEmail } from './SessionsByEmail';

enum SessionSort {
  newer = 'newer',
  oldest = 'oldest',
  mostMessages = 'most-messages',
  lessMessages = 'less-messages',
}

const sortOptions = [
  { id: 0, value: SessionSort.newer, labelKey: 'CoachDetails.Conversations.sortOptions.0' },
  { id: 1, value: SessionSort.oldest, labelKey: 'CoachDetails.Conversations.sortOptions.1' },
  { id: 2, value: SessionSort.mostMessages, labelKey: 'CoachDetails.Conversations.sortOptions.2' },
  { id: 3, value: SessionSort.lessMessages, labelKey: 'CoachDetails.Conversations.sortOptions.3' },
];

export default function SessionsList({
  assistantId,
  initialData,
  initialPlatformData,
  initialInternalData,
  className,
}: {
  assistantId: string;
  initialData: PaginatedData<AssistantChat>;
  initialPlatformData: PaginatedData<AssistantChat>;
  initialInternalData: PaginatedData<AssistantChat>;
  className?: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [activeSession, setActiveSession] = useState<AssistantChat | null>(null);
  const [email, setEmail] = useState<string>('');
  const [transcriptSessions, setTranscriptSessions] = useState<AssistantChat[] | null>(null);

  const [sortBy, setSortBy] = useState<SessionSort>(SessionSort.newer);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const isInitialRender = useRef(true);
  const [isTranscriptUploadEnabled] = useFeatureFlagEnabled(FeatureFlags.TRANSCRIPT_UPLOAD_ENABLED);

  // Track pagination separately for both sources
  const [platformPage, setPlatformPage] = useState(initialPlatformData.page);
  const [internalPage, setInternalPage] = useState(initialInternalData.page);
  const [platformHasMore, setPlatformHasMore] = useState(initialPlatformData.hasMore);
  const [internalHasMore, setInternalHasMore] = useState(initialInternalData.hasMore);

  const loadMoreSessions = useCallback(
    async (page: number, limit: number) => {
      // Fetch from both sources in parallel
      const [platformResponse, internalResponse] = await Promise.all([
        platformHasMore
          ? getAssistantChats(params.id as string, {
              user: searchQuery,
              page: platformPage + 1,
              limit,
              orderBy: sortBy,
            })
          : Promise.resolve({ items: [], hasMore: false, page: platformPage, limit }),
        internalHasMore
          ? getChats(internalPage + 1, limit)
          : Promise.resolve({ items: [], hasMore: false, page: internalPage, limit, count: 0, total: 0 }),
      ]);

      // Update pagination state for both sources
      setPlatformPage(platformResponse.page);
      setInternalPage(internalResponse.page);
      setPlatformHasMore(platformResponse.hasMore);
      setInternalHasMore(internalResponse.hasMore);

      // Merge and sort the results by date
      const mergedItems = [...platformResponse.items, ...internalResponse.items].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return {
        data: mergedItems,
        hasMore: platformResponse.hasMore || internalResponse.hasMore,
        page: page,
        limit: limit,
      };
    },
    [params.id, searchQuery, sortBy, platformPage, internalPage, platformHasMore, internalHasMore]
  );

  const searchSessions = useCallback(
    async (query: string, page: number, limit: number) => {
      setSearchLoading(true);

      // When searching, we only search in platform sessions (external API)
      // Internal chats don't have user search capability
      const response = await getAssistantChats(params.id as string, {
        user: query,
        page,
        limit,
        orderBy: sortBy,
      });

      setSearchLoading(false);

      // Reset pagination state when searching
      setPlatformPage(response.page);
      setInternalPage(1);
      setPlatformHasMore(response.hasMore);
      setInternalHasMore(false); // Don't load internal on search

      return {
        data: response.items,
        hasMore: response.hasMore,
        page: response.page,
        limit: response.limit,
      };
    },
    [params.id, sortBy]
  );

  const {
    data: sessions,
    pagination,
    loadMore,
    search,
    reset: resetPagination,
    setData,
  } = usePagination<AssistantChat>({
    initialData: initialData?.items ?? [],
    initialResponse: {
      data: initialData.items,
      hasMore: initialData.hasMore,
      page: initialData.page,
      limit: initialData.limit,
    },
    onLoadMore: loadMoreSessions,
    onSearch: searchSessions,
  });

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      search(query);
    }, 300),
    [search]
  );

  useEffect(() => {
    if (searchQuery !== '') {
      debouncedSearch(searchQuery);
    } else {
      // Reset pagination state when search is cleared
      setPlatformPage(initialPlatformData.page);
      setInternalPage(initialInternalData.page);
      setPlatformHasMore(initialPlatformData.hasMore);
      setInternalHasMore(initialInternalData.hasMore);
    }
  }, [searchQuery, debouncedSearch, search, initialPlatformData, initialInternalData]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    search(searchQuery);
  }, [sortBy]);

  useEffect(() => {
    const sessionId = searchParams.get('sessionId');

    !!sessionId && setActiveSession(sessions.find(({ id }) => sessionId === id) || null);
  }, [searchParams]);

  // Reset pagination state when initial data changes (e.g., after upload)
  useEffect(() => {
    setPlatformPage(initialPlatformData.page);
    setInternalPage(initialInternalData.page);
    setPlatformHasMore(initialPlatformData.hasMore);
    setInternalHasMore(initialInternalData.hasMore);
  }, [initialPlatformData, initialInternalData]);

  return (
    <div className={`flex gap-3.5 rounded-xl p-3.5 ${className}`}>
      <ComingSoon textKey="CoachDetails.Conversations.whatsappNotAvailableText" className="py-0" onlyLabel={true} />
      <ListSearchBar
        dropdownLabel="Sort By"
        sortOptions={sortOptions}
        onSearch={(value) => {
          if (value.target.value === '') {
            resetPagination();
          }
          setSearchQuery(value.target.value);
        }}
        onSortChanged={(value) => {
          setSortBy(value.value);
        }}
        isLoading={searchLoading}
      />
      <SidebarList
        data={sessions}
        emptyDescriptionKey="CoachDetails.Conversations.emptyList.description"
        emptyTitleKey="CoachDetails.Conversations.emptyList.title"
        hasMore={pagination.hasMore}
        isLoading={pagination.isLoading}
        onLoadMore={loadMore}
        showSkeleton={searchLoading && sessions.length === 0}
        skeletonComponent={<SessionListSkeleton count={5} />}
        actionBar={
          isTranscriptUploadEnabled ? (
            <TranscriptUpload
              assistantId={assistantId}
              onLoadMore={loadMore}
              data={sessions}
              hasMore={pagination.hasMore}
              isLoading={pagination.isLoading}
              onUploadSuccess={async () => {
                // Fetch fresh data from both sources
                const [platformResponse, internalResponse] = await Promise.all([
                  getAssistantChats(params.id as string, {
                    page: 1,
                    limit: 20,
                    orderBy: sortBy,
                  }),
                  getChats(1, 20),
                ]);

                // Merge and sort the fresh data
                const freshData = [...platformResponse.items, ...internalResponse.items].sort(
                  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );

                // Update the component state with fresh data
                setData(freshData);

                // Reset pagination state
                setPlatformPage(1);
                setInternalPage(1);
                setPlatformHasMore(platformResponse.hasMore);
                setInternalHasMore(internalResponse.hasMore);

                // Clear search query
                setSearchQuery('');

                // Also refresh the page to update server state
                router.refresh();
              }}
              onUploadError={(message) => {
                console.error('Transcript upload failed:', message);
              }}
            />
          ) : undefined
        }
      >
        {(item, index) => (
          <li
            key={`session-${index}`}
            className={twMerge(
              'group flex cursor-pointer items-center justify-between divide-x divide-storm-gray rounded-xl border border-transparent px-2.5 py-1.5 hover:border-background-border/[16%] hover:bg-white-opacity',
              item.id === activeSession?.id && 'divide-dark-aquamarine border-dark-aquamarine bg-white-opacity'
            )}
            onClick={() => {
              router.push(`${PrivateRoutes.coach}/${params.id}${CoachRoutes.conversations}?sessionId=${item.id}`);
            }}
          >
            <div className="flex w-1/4 shrink-0 flex-col justify-center gap-1 ps-1">
              <span className="text-xs text-light-gray">{getDayLabel(item.created_at)}</span>
              <span className="text-sm text-main">{getDateDay(item.created_at)}</span>
            </div>
            <div className="flex flex-grow items-center justify-between gap-8 ps-5">
              <div className="flex flex-grow flex-col justify-start gap-y-1 overflow-hidden ps-1">
                <span
                  className={`text-nowrap break-words text-sm font-bold uppercase ${item.id === activeSession?.id ? 'text-dark-aquamarine' : 'text-main'}`}
                >
                  {item.userName}
                </span>
                <span className="break-words text-xs text-light-gray">{item.userEmail}</span>
              </div>
              <span
                className={`text-nowrap break-words text-sm font-bold uppercase ${item.id === activeSession?.id ? 'text-dark-aquamarine' : 'text-main'}`}
              >
                {item.sessionSummary?.type === 'transcript_upload' ? (
                  <Image src="/images/chatFileTypeIcon.svg" alt={''} width={25} height={25} />
                ) : (
                  ''
                )}
              </span>
              <div className="flex gap-x-5">
                <div className="flex flex-grow items-center gap-1 text-sm">
                  <span className="font-medium text-main">{item.messages?.length}</span>
                  <span className="text-light-gray">{t('CoachDetails.Users.SessionsList.messagesLabel')}</span>
                </div>

                <div className="flex justify-end gap-x-3">
                  <ExportSessionsButton
                    sessions={[item]}
                    name={item.name?.replaceAll(' ', '_') || ''}
                    className={`p-0 text-storm-gray hover:!text-main group-hover:text-light-gray ${item.id === activeSession?.id && 'text-light-gray'}`}
                  />
                </div>
              </div>
            </div>
          </li>
        )}
      </SidebarList>
      {/* Download Section */}
      <div className="flex flex-col gap-y-2 rounded-xl bg-graphic/[14%] p-3.5">
        <h5 className="text-main">{t('CoachDetails.Users.SessionsList.downloadSessionsTitle')}</h5>
        <div>
          <div className="flex flex-grow gap-3">
            <SessionsByEmail
              assistantId={assistantId}
              sessions={sessions}
              onEmailSelect={(email: string) => {
                setEmail(email);
                setTranscriptSessions(
                  email ? sessions.filter(({ userEmail }) => !!userEmail && email === userEmail) : null
                );
              }}
            />
            <ExportSessionsButton
              sessions={transcriptSessions || []}
              name={email}
              buttonText={t('CoachDetails.Users.SessionsList.downloadSessionsButton')}
              variant="solid"
              color="dark"
            />
          </div>

          {email && transcriptSessions && !transcriptSessions.length && (
            <p className="mt-3 w-full text-sm text-salmon">
              {t('CoachDetails.Users.SessionsList.downloadAllSessionsError')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
