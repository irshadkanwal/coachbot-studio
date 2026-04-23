'use server';

import { revalidatePath } from 'next/cache';

import { MessageSendPayload } from '@/lib/models/api.models';
import { Message, MessageRole } from '@/lib/models/chat.models';
import { getMessage } from '@/lib/utils/chat.utils';
import { apiClient } from '../db/apiClient';
import { createChatMessage, updateMessage } from '../db/chatClient';

export async function createChatMessages(userId: string, messages: Message[], chatId?: string): Promise<string> {
  try {
    await Promise.all(
      messages.map(
        async (message: Message) => await createChatMessage(chatId || '', { ...message, recurring: undefined })
      )
    );

    return chatId || '';
  } catch (error) {
    console.error(`[messagesActions] Error during updating chat ${chatId} with messages for user ${userId} :`, error);

    return '';
  }
}

export async function sendMessage({
  userId,
  assistantId,
  newMessage,
  prevMessages,
  chat_id,
  chatInfo,
}: MessageSendPayload): Promise<string> {
  try {
    const payload = {
      assistant_id: assistantId,
      user_id: userId,
      chat_id,
      current_stage: chatInfo.stage,
      history: [...prevMessages.reverse()],
      newMessage,
      app: 'studio',
    };

    const { response } = await apiClient.sendMessage(payload);
    const assistantMessage = {
      ...getMessage(response, MessageRole.assistant, chatInfo),
      created_at: new Date().toISOString(),
    };

    const chatId = await createChatMessages(userId, [newMessage, assistantMessage], chat_id);

    revalidatePath(`/chat/${chatId}`);

    return chatId;
  } catch (error) {
    console.error(`[messagesActions] Error sending user ${userId} message: `, error);
    return '';
  }
}

export async function editMessage(id: string, message: Partial<Message>): Promise<Message | null> {
  try {
    return await updateMessage(id, message as any);
  } catch (error: any) {
    console.error(`[messagesActions] Error updating message ${id} data: `, error);
    return null;
  }
}
