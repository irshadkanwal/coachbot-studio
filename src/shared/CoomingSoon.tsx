import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

const ComingSoon = memo(function ComingSoon({
  className,
  onlyLabel,
  textKey,
}: {
  className?: string;
  onlyLabel?: boolean;
  textKey?: string;
}) {
  const t = useTranslations();

  return (
    <p className={twMerge('inline-flex items-center gap-x-1 py-2 text-sm font-bold text-light-gray', className)}>
      {!onlyLabel && t('General.inDevelopmentLabel')}
      <span className="rounded-full bg-grape px-2 uppercase leading-4 text-main">
        {t(textKey || 'General.comingSoon')}
      </span>
    </p>
  );
});

export default ComingSoon;
