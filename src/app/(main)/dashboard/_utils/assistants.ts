import { Assistant, AssistantStatus } from '@/lib/models/assistant.models';

export const groupAssistantsByStatus = (assistants: Assistant[]) => {
  return assistants.reduce(
    (acc, assistant) => {
      if (assistant.status && Object.values(AssistantStatus).includes(assistant.status as AssistantStatus)) {
        const statusKey = assistant.status as AssistantStatus;
        if (!acc[statusKey]) {
          acc[statusKey] = [];
        }
        acc[statusKey].push(assistant);
      }
      return acc;
    },
    {} as Record<AssistantStatus, Assistant[]>
  );
};

export const findFirstNonEmptyStatus = (
  groupedAssistants: Record<AssistantStatus, Assistant[]>
): { assistants: Assistant[]; status: AssistantStatus } | null => {
  for (const assistantStatus of Object.values(AssistantStatus)) {
    if (groupedAssistants[assistantStatus]?.length > 0) {
      return {
        assistants: groupedAssistants[assistantStatus] || [],
        status: assistantStatus,
      };
    }
  }
  return null;
};
