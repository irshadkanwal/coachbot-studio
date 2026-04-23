import { twMerge } from 'tailwind-merge';

import { MAX_CATEGORIES_COUNT, MIN_CATEGORIES_COUNT } from '@/lib/constants';

export default function TopicCounter({ categories, t }: { categories: any[]; t: any }) {
  return (
    <div className="flex items-center justify-center gap-x-2 border-b border-storm-gray pb-2">
      <span className="text-sm text-dark-aquamarine">
        {t('CoachDetails.Config.GoalVisionPage.topicCounter.minLabel', { count: MIN_CATEGORIES_COUNT })}
      </span>
      <div className="relative flex items-center justify-center gap-x-1 rounded-full bg-graphic/[14%] px-1.5 py-2 ps-3">
        <span className="absolute bottom-1 left-1.5 top-1 flex w-[31.5%] rounded-full border border-dark-aquamarine content-['']"></span>

        {Array.from({ length: MAX_CATEGORIES_COUNT }, (_, i) => i + 1).map((value: number) => (
          <span
            key={`topic-counter-${value}`}
            className={twMerge(
              `size-2.5 rounded-full border border-main bg-transparent`,
              categories.length >= value && 'border-dark-aquamarine bg-dark-aquamarine',
              value === 3 && 'me-1.5'
            )}
          />
        ))}
      </div>
      <span className="text-sm text-light-gray">
        {t('CoachDetails.Config.GoalVisionPage.topicCounter.maxLabel', { count: MAX_CATEGORIES_COUNT })}
      </span>
    </div>
  );
}
