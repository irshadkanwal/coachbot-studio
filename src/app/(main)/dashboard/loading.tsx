import { Spinner } from '@/shared/Loaders';
import { ListSkeleton } from '@/shared/skeletons/ListSkeleton';

export default function Loading() {
  return (
    <section className={'flex min-h-0 flex-grow flex-col rounded-xl bg-white/[8%]'}>
      <div
        className={
          'flex min-h-[4.7rem] w-full flex-col items-center justify-center gap-y-3 rounded-t-xl border-b border-main bg-white/[10%] px-4 py-3.5'
        }
      >
        <Spinner text="Loading..." />
      </div>
      <div className="flex min-h-0 flex-grow flex-col gap-y-2.5 overflow-y-auto p-3.5">
        <ListSkeleton className="gap-y-2.5" liClassName="bg-white-opacity min-h-[22rem] rounded-3xl" length={2} />
      </div>
    </section>
  );
}
