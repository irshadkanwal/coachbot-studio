import { twMerge } from 'tailwind-merge';

export function ListSkeleton({
  className,
  liClassName,
  length,
  heights,
}: {
  className?: string;
  liClassName?: string;
  length?: number;
  heights?: string[];
}) {
  const mockChatsHeight = heights || ['h-28', 'h-24', 'h-32', 'h-28', 'h-24', 'h-24', 'h-36', 'h-38', 'h-24', 'h-16'];

  return (
    <ul role="list" className={twMerge('flex flex-grow flex-col gap-y-2 overflow-y-auto', className)}>
      {mockChatsHeight.slice(0, length ?? mockChatsHeight.length).map((height: string, key: number) => (
        <li key={key} className="flex cursor-pointer items-center justify-between text-light-gray">
          <span
            className={twMerge(
              `${height} bg-white/[16%]) w-full animate-pulse rounded-lg border-transparent`,
              liClassName
            )}
          ></span>
        </li>
      ))}
    </ul>
  );
}
