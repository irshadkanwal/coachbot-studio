import { AssistantUser, AssistantUserChat } from '../models/assistant.models';
import { Message } from '../models/chat.models';
import { getFormatedDate } from './date.utils';

const filterChatsByDateRange = (chats: AssistantUserChat[], from: Date, to: Date) =>
  chats.filter((chat) => {
    return new Date(chat.created_at) >= from && new Date(chat.created_at) <= to;
  });

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }

  return `${secs}s`;
}

export const sortByCreatedAt = <T extends { created_at: Date | string }>(data: T[]) =>
  [...data].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));

export const sortByCreatedAtDesc = <T extends { created_at: Date | string }>(data: T[]) =>
  [...data].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));

export const getWeeklyInteractions = (chats: AssistantUserChat[] = []) => {
  if (!chats.length) return 0;

  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return filterChatsByDateRange(chats, oneWeekAgo, now).length;
};

export const getMonthlyInteractions = (chats: AssistantUserChat[] = []) => {
  if (!chats.length) return 0;

  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return filterChatsByDateRange(chats, oneMonthAgo, now).length;
};

export const calculateChatDurationSeconds = (messages: Message[] | null = []): number => {
  if (!messages || messages.length < 2) return 0;

  const sortedMessages = sortByCreatedAt(messages);
  const firstMessage = new Date(sortedMessages[0].created_at);
  const lastMessage = new Date(sortedMessages[sortedMessages.length - 1].created_at);

  return Math.round((lastMessage.getTime() - firstMessage.getTime()) / 1000);
};

export const getAverageSessionLength = (chats: AssistantUserChat[] = []) => {
  if (!chats.length) return '0s';
  const totalSeconds = chats.reduce((acc, chat) => {
    return acc + (chat.messages?.length ? calculateChatDurationSeconds(chat.messages) : 0);
  }, 0);
  const avgSeconds = totalSeconds / chats.length;

  return formatDuration(avgSeconds);
};

export const getSessionDate = ({ session }: AssistantUser, last: boolean) => {
  const date = last ? session.lastDate : session.firstDate;
  const dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

  return !!date ? getFormatedDate(date, 'en-US', dateFormat) : '-';
};

export const isInactiveUser = ({ session }: AssistantUser): boolean => {
  if (!session.lastDate) return true;

  const daysSinceLastChat = (Date.now() - new Date(session.lastDate).getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceLastChat > 7;
};

export const isSessionInTimeFrame = (session: AssistantUser['session'], timeFrame: number) => {
  const now = new Date();
  const lastDate = new Date(session.lastDate || '');

  return now.getTime() - lastDate.getTime() <= timeFrame * 24 * 60 * 60 * 1000;
};

export enum UserFilter {
  allTime = 'allTime',
  days30 = 30,
  days7 = 7,
  inactive = 'inactive',
}

export const filterUsersBySessionTimeFrame = (users: AssistantUser[], timeFilter: UserFilter): AssistantUser[] => {
  return users.filter((user) => {
    switch (timeFilter) {
      case UserFilter.allTime:
        return true;
      case UserFilter.days7:
        return isSessionInTimeFrame(user.session, 7);
      case UserFilter.days30:
        return isSessionInTimeFrame(user.session, 30);
      case UserFilter.inactive:
        return isInactiveUser(user);
      default:
        return true;
    }
  });
};
