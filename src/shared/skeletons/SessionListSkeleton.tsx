import { memo } from 'react';

const SessionItemSkeleton = memo(function SessionItemSkeleton() {
  return (
    <li className="group flex animate-pulse items-center justify-between divide-x divide-storm-gray rounded-xl border border-transparent px-2.5 py-1.5">
      <div className="flex w-1/4 shrink-0 flex-col justify-center gap-1 ps-1">
        <div className="h-3 w-16 rounded bg-graphic/[20%]"></div>
        <div className="h-4 w-12 rounded bg-graphic/[20%]"></div>
      </div>

      <div className="flex flex-grow items-center gap-8 ps-5">
        <div className="flex flex-grow flex-col justify-start gap-y-1 overflow-hidden ps-1">
          <div className="mb-1 h-4 w-24 rounded bg-graphic/[20%]"></div>
          <div className="h-3 w-32 rounded bg-graphic/[20%]"></div>
        </div>

        <div className="flex flex-1 items-center gap-1">
          <div className="h-4 w-8 rounded bg-graphic/[20%]"></div>
          <div className="h-4 w-16 rounded bg-graphic/[20%]"></div>
        </div>

        <div className="flex flex-1 items-center gap-x-3">
          <div className="h-4 w-1 rounded bg-graphic/[20%]"></div>
          <div className="h-4 w-12 rounded bg-graphic/[20%]"></div>
        </div>

        <div className="flex flex-grow justify-end">
          <div className="h-8 w-20 rounded-lg bg-graphic/[20%]"></div>
        </div>
      </div>
    </li>
  );
});

export default function SessionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="flex w-full flex-grow flex-col gap-y-1 overflow-y-auto overflow-x-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <SessionItemSkeleton key={`skeleton-session-${index}`} />
      ))}
    </ul>
  );
}
