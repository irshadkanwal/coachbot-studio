import { memo } from 'react';

const AnalyticsCardSkeleton = memo(function AnalyticsCardSkeleton() {
  return (
    <div className="flex h-full flex-1 shrink-0 animate-pulse flex-col items-center justify-between gap-y-1 rounded-lg bg-storm-gray/10 p-3.5">
      <div className="flex aspect-square items-center justify-center rounded-lg border border-storm-gray/20 p-0.5">
        <div className="h-8 w-8 rounded bg-storm-gray/20"></div>
      </div>
      <div className="mb-1 h-4 w-20 rounded bg-storm-gray/20"></div>
      <div className="h-8 w-12 rounded bg-storm-gray/30"></div>
    </div>
  );
});

export default function UserSessionsAnalyticsSkeleton() {
  return (
    <div className="flex items-center justify-between gap-x-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <AnalyticsCardSkeleton key={`skeleton-analytics-${index}`} />
      ))}
    </div>
  );
}
