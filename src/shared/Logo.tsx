import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const Logo = memo(function Logo({ className }: { className?: string }) {
  return (
    <Link prefetch={false} className={`relative z-10 flex h-6 items-center sm:h-7 xl:h-8 ${className}`} href="/">
      <Image
        src={'/images/StudioAiCoachLogo.svg'}
        alt="CoachBot logo"
        className={'h-full w-auto'}
        priority={true}
        width={100}
        height={20}
      />
    </Link>
  );
});
