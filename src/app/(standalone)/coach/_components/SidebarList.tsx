'use client';

import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { useInfiniteScroll } from '../../../../hooks/useInfiniteScroll';
import { Spinner } from '../../../../shared/Loaders';

interface SidebarListProps<T> {
  data: T[];
  className?: string;
  emptyTitleKey?: string;
  emptyDescriptionKey: string;
  children: (item: T, index: number) => React.ReactNode;
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  skeletonComponent?: React.ReactNode;
  showSkeleton?: boolean;
  actionBar?: React.ReactNode;
}

export default function SidebarList<T>({
  data,
  className,
  emptyTitleKey,
  emptyDescriptionKey,
  children,
  hasMore,
  isLoading,
  onLoadMore,
  skeletonComponent,
  showSkeleton = false,
  actionBar,
}: SidebarListProps<T>) {
  const t = useTranslations();

  const { ref: loadMoreRef } = useInfiniteScroll(onLoadMore ?? (() => {}), {
    enabled: !!hasMore,
  });

  return (
    <div
      className={twMerge('flex min-h-0 max-w-full flex-grow flex-col rounded-xl bg-graphic/[14%] px-2 py-3', className)}
    >
      {showSkeleton ? (
        <div className="overflow-y-auto overflow-x-hidden">{skeletonComponent}</div>
      ) : !data.length ? (
        <>
          {emptyTitleKey && <h5 className="text-sm font-bold uppercase text-light-gray">{t(emptyTitleKey)}</h5>}
          <p className="text-sm text-main">{t(emptyDescriptionKey)}</p>
        </>
      ) : (
        <div className="overflow-y-auto overflow-x-hidden">
          <ul className="flex flex-grow flex-col gap-y-1">{data.map((item: T, id: number) => children(item, id))}</ul>
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              {isLoading ? <Spinner withText={true} text="Loading more users..." /> : <div className="h-4" />}
            </div>
          )}
        </div>
      )}
      {!!actionBar && <div className="w-full">{actionBar}</div>}
    </div>
  );
}
