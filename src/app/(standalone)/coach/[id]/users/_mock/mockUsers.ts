import { User } from '@/lib/models/common.models';

function generateMessages(chatIndex: number, min: number, max: number) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const baseTime = new Date(2025, 4, 1 + chatIndex, 10, 0, 0).getTime();
  return Array.from({ length: count }).map((_, i) => {
    const sender = i % 2 === 0 ? 'user' : 'assistant';
    return {
      id: `m${i + 1}`,
      created_at: new Date(baseTime + i * 60000).toISOString(),
      content: `${sender === 'user' ? 'User' : 'Assistant'} message ${i + 1}`,
      sender,
    };
  });
}

function generateChats(userIndex: number, chatCount: number) {
  const now = Date.now();
  return Array.from({ length: chatCount }).map((_, chatIdx) => {
    // Random offset within the last 30 days (in ms)
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    const chatCreatedAt = new Date(now - randomDaysAgo * 24 * 60 * 60 * 1000);
    chatCreatedAt.setHours(randomHour, randomMinute, 0, 0);
    return {
      id: `chat-${userIndex + 1}-${chatIdx + 1}`,
      created_at: chatCreatedAt.toISOString(),
      Messages: generateMessages(chatIdx, 8, 100),
    };
  });
}

let cachedMockUsers: User[] | null = null;

export const getMockUsers = async (): Promise<User[]> => {
  if (cachedMockUsers) return cachedMockUsers;

  cachedMockUsers = Array.from({ length: 10 }).map((_, userIdx) => ({
    id: `${userIdx + 1}`,
    name: `User ${userIdx + 1}`,
    email: `user_${userIdx + 1}@example.com`,
    emailVerified: true,
    createdAt: new Date(2024, 0, 10 + userIdx).toISOString(),
    Chat: generateChats(userIdx, 10 + (userIdx % 5)), // deterministic
  }));

  return cachedMockUsers;
};
