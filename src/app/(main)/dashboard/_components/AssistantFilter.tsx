'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Assistant, AssistantStatus } from '@/lib/models/assistant.models';
import { RadioGroup } from '@/shared/RadioGroup';

export const statusOptions = [
  { id: 0, value: AssistantStatus.published, labelKey: 'Dashboard.assistantStatusOptions.0' },
  { id: 1, value: AssistantStatus.draft, labelKey: 'Dashboard.assistantStatusOptions.1' },
  { id: 2, value: AssistantStatus.inProgress, labelKey: 'Dashboard.assistantStatusOptions.2' },
  { id: 3, value: AssistantStatus.archived, labelKey: 'Dashboard.assistantStatusOptions.3' },
];

export default function AssistantFilter({
  assistants,
  selected,
}: {
  assistants: Assistant[];
  selected: AssistantStatus;
}) {
  const [selectedStatus, setSelectedStatus] = useState(selected || AssistantStatus.published);
  const pathname = usePathname();
  const router = useRouter();

  const options = useMemo(() => {
    return statusOptions.map((option) => {
      const count = assistants.reduce((count, assistant) => (assistant.status === option.value ? ++count : count), 0);

      return {
        ...option,
        displayValue: count,
        disabled: !count,
      };
    });
  }, [assistants]);

  const handleFilterSelected = useCallback((value: AssistantStatus) => {
    setSelectedStatus(value);
    router.push(`${pathname}?status=${value}`);
  }, []);

  useEffect(() => {
    const currentOption = options.find(({ value }) => value === selectedStatus);

    if (!currentOption?.displayValue) {
      const targetOption = options.find(({ displayValue }) => displayValue > 0);
      targetOption?.value && handleFilterSelected(targetOption?.value);
    }
  }, [options]);

  return (
    <RadioGroup
      options={options}
      selected={selectedStatus}
      setSelected={handleFilterSelected}
      optionClassName="p-3 text-sm"
      className="flex max-w-xl flex-grow gap-x-1"
      variant="graphic"
    />
  );
}
