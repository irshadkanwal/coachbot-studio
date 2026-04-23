import { twMerge } from 'tailwind-merge';

import { ControlPanel } from '@/app/(main)/chat/_components';

export async function MessagesSkeleton() {
  const messagesHeights = ['h-14', 'h-20', 'h-14', 'h-20', 'h-14', 'h-20', 'h-14', 'h-20', 'h-14', 'h-20'];

  return (
    <div className="flex size-full flex-col">
      <div
        className={twMerge(
          'flex h-full w-full max-w-[73%] flex-grow flex-col items-center justify-end gap-7 self-end overflow-y-auto px-4 pb-5 sm:mt-16 lg:mt-0'
        )}
      >
        <div className="flex w-full max-w-[44rem] flex-col items-center gap-y-7">
          {messagesHeights.map((height: string, index: number) => (
            <div
              key={`message-${index}`}
              className={twMerge(
                'flex w-full animate-pulse items-start gap-x-4 self-start rounded-2xl bg-white/[8%] px-5 py-4 text-main',
                height,
                index % 2 === 0 && 'w-4/5 self-end bg-dark-aquamarine/[11%]'
              )}
            >
              <span className={twMerge('shrink-0 animate-pulse text-xl', index % 2 === 0 ? 'cbi-send' : 'cbi-cpu')} />
            </div>
          ))}
        </div>
      </div>
      <div className="z-10 w-full min-w-0">
        <ControlPanel />
      </div>
    </div>
  );
}
