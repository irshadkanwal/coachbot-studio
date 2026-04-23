'use client';

import { useRootContext } from '@/contexts/RootContextProvider';
import { ChatMode } from '@/lib/models/chat.models';
import { RadioGroup } from '@/shared/RadioGroup';

export const modeOptions = [
  {
    id: 0,
    value: ChatMode.new,
    icon: 'cbi-plant-growth',
    className: 'relative after:content-["or"] after:text-storm-gray after:absolute after:-right-7',
    titleKey: 'Chat.ChatMode.newUserTitle',
  },
  {
    id: 1,
    value: ChatMode.recurring,
    icon: 'cbi-refresh-empty',
    titleKey: 'Chat.ChatMode.recurringUserTitle',
  },
];

export default function ChatModeSwitcher() {
  const { chatInfo, setChatInfo } = useRootContext();

  return (
    <RadioGroup
      options={modeOptions}
      selected={chatInfo.mode}
      setSelected={(mode: ChatMode) => setChatInfo((prevInfo) => ({ ...prevInfo, mode }))}
      optionClassName="rounded-full w-max acpect-square p-3.5 h-full border border-white-opacity data-[checked]:bg-main data-[checked]:text-background"
      className="gap-x-10 rounded-full bg-graphic/[14%] p-1 backdrop-blur-sm"
      variant="white"
    />
  );
}
