import { ReactNode } from 'react';

import TopNavigation from '@/shared/layout/TopNavigation';

const navigationOptions = [
  { label: 'Instructions.topNavigationOptions.0', href: '/instructions' },
  { label: 'Instructions.topNavigationOptions.1', href: '/instructions/stages' },
  { label: 'Instructions.topNavigationOptions.2', href: '/instructions/tone-of-voice', hidden: true },
];

export default async function InstructionLauoyt({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-0 flex-grow flex-col rounded-xl bg-white/[8%]">
      <div className="flex w-full flex-col gap-y-3 rounded-t-xl border-b border-main bg-white/[10%] px-7 py-3.5">
        <TopNavigation
          strictEqual={true}
          navigationOptions={navigationOptions}
          variant="secondary"
          className="max-w-80 lg:max-w-[65%]"
          optionClassName="max-w-40 lg:max-w-80 lg:min-w-0"
        />
      </div>
      <div className="flex min-h-0 flex-grow flex-col gap-y-2.5 overflow-y-auto p-3.5">{children}</div>
    </section>
  );
}
