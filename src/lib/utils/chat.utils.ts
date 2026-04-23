import { AnalyzeStageData } from '../models/api.models';
import { ChatInfo, ChatMode, Message, MessageRole } from '../models/chat.models';
import { SessionDetailsTab } from '../models/common.models';
import { Locale } from '../models/locale.models';

/**
 * Generates a formatted chat session name with the current day and time
 * Format: "Session - Day [HH:MM]" (e.g., "Session - Mon [14:30]")
 * @returns {string} Formatted session name
 */
export const generateSessionName = (locale: Locale | string = 'en-US'): string => {
  const now = new Date();

  // Get day abbreviation (Mon, Tue, etc.)
  const day = now.toLocaleDateString(locale, { weekday: 'short' });

  // Get hours and minutes with padding
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return `Session - ${day} [${hours}:${minutes}]`;
};

/**
 * Generates a UUID v4 string with fallback for environments without crypto.randomUUID
 * @returns {string} UUID v4 string
 */
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getMessage = (content: string, role: MessageRole, { stage, mode }: ChatInfo): Message => ({
  id: generateUUID(),
  content,
  stage,
  role,
  created_at: new Date().toISOString(),
  recurring: mode === ChatMode.recurring,
});

export const mapSessionStageAnalysis = (data?: AnalyzeStageData): SessionDetailsTab[] | undefined => {
  if (!data?.reasoning || !data?.criteria_missing) {
    return [{ name: 'Details', descriptions: [] }];
  }

  return [
    {
      name: 'Details',
      descriptions: [
        { type: 'text', value: data.reasoning },
        {
          type: 'list',
          value: data.criteria_missing.map((item) => {
            if (typeof item === 'string') {
              return `▪︎ ${item}`;
            }
            return `▪︎ ${item.text} - [${item.priority.replace('_', ' ')}]`;
          }),
          title: data.criteria_missing.length ? 'Missing Criterias' : '',
        },
      ],
    },
  ];
};
