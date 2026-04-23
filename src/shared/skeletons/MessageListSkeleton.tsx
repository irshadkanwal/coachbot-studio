import { memo } from 'react';

const MessageItemSkeleton = memo(function MessageItemSkeleton({ isUser = false }: { isUser?: boolean }) {
  if (isUser) {
    return (
      <article className="relative flex w-4/5 animate-pulse items-center gap-x-5 self-end rounded-2xl bg-dark-aquamarine/[11%] p-5">
        <div className="h-5 w-5 shrink-0 self-start rounded bg-graphic/[20%]"></div>
        <div className="flex flex-1 flex-col gap-y-2">
          <div className="h-4 w-full rounded bg-graphic/[20%]"></div>
          <div className="h-4 w-3/4 rounded bg-graphic/[20%]"></div>
          <div className="h-4 w-1/2 rounded bg-graphic/[20%]"></div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex animate-pulse items-center gap-x-4">
      <div className="h-5 w-5 shrink-0 self-start rounded bg-graphic/[20%]"></div>
      <div className="flex w-full flex-col items-start gap-y-2 self-start p-5">
        <div className="h-4 w-full rounded bg-graphic/[20%]"></div>
        <div className="h-4 w-5/6 rounded bg-graphic/[20%]"></div>
        <div className="h-4 w-4/6 rounded bg-graphic/[20%]"></div>
        <div className="h-4 w-3/6 rounded bg-graphic/[20%]"></div>
      </div>
    </article>
  );
});

export default function MessageListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex w-full flex-grow flex-col-reverse gap-y-1 self-end overflow-y-auto overflow-x-hidden p-2 ps-0">
      {Array.from({ length: count }).map((_, index) => (
        <MessageItemSkeleton key={`skeleton-message-${index}`} isUser={index % 3 === 0} />
      ))}
    </div>
  );
}
