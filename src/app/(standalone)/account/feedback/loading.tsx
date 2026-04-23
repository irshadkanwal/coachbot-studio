import { twMerge } from 'tailwind-merge';

import { ListSkeleton } from '@/shared/skeletons/ListSkeleton';

export default function Loader({ className }: { className?: string }) {
  return (
    <div className={twMerge('w-full flex-col divide-y divide-white/[6%] self-center', className)}>
      <div className="flex-col gap-y-1 pb-2"></div>

      <div className="">
        <div className={'flex w-full animate-pulse flex-col rounded-lg bg-white text-white/[16%]'}>
          <input
            autoComplete="off"
            name="title"
            type="text"
            disabled
            readOnly
            className={'text-medium focus:no-outline w-full border-0 bg-transparent p-4'}
          />

          <div className="flex w-full flex-col gap-y-3 border-t border-storm-gray p-4">
            <label className="-ms-0.5"> </label>
            <textarea
              autoComplete="off"
              name="details"
              disabled
              readOnly
              className={'focus:no-outline w-full border-none bg-transparent p-0'}
            />
          </div>
        </div>
        <div className="flex justify-end gap-1.5 py-4">
          <div className="flex h-12 w-24 rounded-xl border border-white px-8 py-2 text-lg font-normal"></div>
          <div className="flex h-12 w-24 rounded-xl bg-white px-8 py-2 text-lg font-normal"></div>
        </div>
      </div>

      <ListSkeleton className="gap-y-0.5" liClassName="bg-white" length={5} />
    </div>
  );
}
