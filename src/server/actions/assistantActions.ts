'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import { PriceConfiguration } from '@prisma/client';

import {
  Assistant,
  AssistantChat,
  AssistantConfiguration,
  AssistantEditable,
  AssistantMeta,
  AssistantSubscription,
  AssistantUserChat,
  AssistantUsersResponse,
  SubscriptionSearchQuery,
} from '@/lib/models/assistant.models';
import { PaginatedData, State, Template } from '@/lib/models/common.models';
import { buildQueryParams, getPublishingLimit, isAssistantPublishingAllowed } from '@/lib/utils/common.utils';
import {
  assistantPriceSchema,
  assistantSchema,
  assistantSchemaWithTemplate,
  mapRelationConfig,
} from '@/lib/utils/db.utils';
import { getAssistantPayload } from '@/lib/utils/mapper.utils';
import {
  createUserAssistant,
  deleteUserAssistant,
  duplicateAssistant,
  getAllTemplates,
  getAssistantData,
  getUserAssitants,
  updateAssistantMeta,
  updateUserAssistant,
  upsertAssistantPrice,
} from '../db/assistantClient';
import { coachBotClient } from '../db/coachBotClient';
import { getFullConfiguration } from '../db/configurationClient';
import { notifyAssistantDeletion } from '../webhooks/coachbotWebhook';
import { getSessionUser, verifySession } from './sessionActions';
import { getUser, getUserPictureSignedUrl } from './userActions';

export async function getAssistantWithPicturePayload(assistant: Assistant) {
  const EXPIRATION_IN_MINUTES_ONE_WEEK = 1440 * 7;

  try {
    const pictureUrl = assistant.user?.pictureUrl
      ? await getUserPictureSignedUrl(assistant.user, EXPIRATION_IN_MINUTES_ONE_WEEK)
      : null;

    return await getAssistantPayload(assistant, pictureUrl);
  } catch (error) {
    console.error(`[assistantClient] Error getting assistant ${assistant.id} payload with picture:`, error);
  }
}

export async function updateCoachBotAssistant(id: string) {
  try {
    const assistantData = await getAssistantData(id, {
      meta: { include: { price: true } },
      configuration: { include: { stages: { orderBy: { order: 'asc' } } } },
      user: true,
    });

    const assistant = await getAssistantWithPicturePayload(assistantData as Assistant);

    assistant && coachBotClient.updateAssistant(assistant);
  } catch (error) {
    console.error(`[assistantClient] Error update CoachBot assistant ${id}:`, error);
  }
}

const syncAssistant = (assistantId: string) => {
  updateCoachBotAssistant(assistantId);
  revalidateTag('assistants');
};

export async function getCurrentAssistant(): Promise<string> {
  try {
    const { assistantId } = (await verifySession()) || {};

    return assistantId || '';
  } catch (error) {
    console.error(`[authActions] Error fetching current assistant`, error);

    return '';
  }
}

export async function getTemplates(): Promise<Template[]> {
  try {
    const templates: any[] = await getAllTemplates();

    return templates.map(mapRelationConfig);
  } catch (e) {
    console.error(`[assistantClient] Error fetching templates:`, e);
    return [];
  }
}

export async function getAssistants(include?: any): Promise<Assistant[]> {
  let userId;
  try {
    userId = await getSessionUser();

    if (!userId) return [];

    const assistants = await getUserAssitants(userId, include);

    return assistants as Assistant[];
  } catch (e) {
    console.error(`[assistantClient] Error fetching assistants for user ${userId}:`, e);
    return [];
  }
}

export async function createCoachAssistant(
  assistantData: AssistantEditable,
  id?: string
): Promise<State<Assistant | null>> {
  let userId;
  try {
    userId = await getSessionUser();

    if (!userId) return { value: null };

    const parsedData = assistantSchema.safeParse(assistantData);

    if (!parsedData.success) {
      return { errors: parsedData.error.errors.map(({ message, path }) => ({ name: path.join('.'), message })) };
    }

    const assistant = await createUserAssistant(userId, { ...assistantData, id } as AssistantEditable);

    revalidateTag('assistants');

    return { value: assistant as Assistant };
  } catch (e) {
    console.error(`[assistantClient] Error ${!!id ? 'updating' : 'creating'} assistant for user ${userId}:`, e);
    return { value: null, error: '' };
  }
}

export async function upsertAssistantWithTemplate(
  { template, ...assistantData }: AssistantEditable & { template?: Template },
  id?: string
): Promise<State<Assistant | null>> {
  let userId;
  try {
    userId = await getSessionUser();

    if (!userId) return { value: null };

    const parsedData = !!template
      ? assistantSchemaWithTemplate.safeParse({ template, ...assistantData })
      : assistantSchema.safeParse(assistantData);

    if (!parsedData.success) {
      return { errors: parsedData.error.errors.map(({ message, path }) => ({ name: path.join('.'), message })) };
    }

    const assistant = !!id
      ? await updateUserAssistant(userId, id, assistantData)
      : await createUserAssistant(userId, assistantData, template as any);

    revalidateTag('assistants');

    return { value: assistant as Assistant };
  } catch (e) {
    console.error(`[assistantClient] Error ${!!id ? 'updating' : 'creating'} assistant for user ${userId}:`, e);
    return { value: null, error: '' };
  }
}

export async function updateAssistant(
  id: string,
  assistantData: Partial<AssistantEditable>
): Promise<State<Assistant | null>> {
  let userId;
  try {
    userId = await getSessionUser();
    if (!userId) return { value: null };

    // Check if user is trying to publish an assistant
    if (assistantData.status === 'published') {
      const user = await getUser();
      const assistants = await getAssistants();

      if (!isAssistantPublishingAllowed(user, assistants)) {
        const limit = getPublishingLimit(user);
        return {
          value: null,
          error: 'General.errors.publishingLimitReached',
          errorParams: { limit },
        };
      }
    }

    const assistant = await updateUserAssistant(userId, id, assistantData);

    revalidateTag('assistants');

    return { value: assistant as Assistant };
  } catch (e) {
    console.error(`[assistantClient] Error updating assistant for user ${userId}:`, e);
    return { value: null, error: '' };
  }
}

export async function getAssistantConfiguration(
  id?: string,
  full: boolean = true
): Promise<AssistantConfiguration | null> {
  let assistantId;
  try {
    assistantId = id || (await getCurrentAssistant());

    if (!assistantId) {
      console.warn('Assistant not found or user not authenticated');
      return null;
    }

    return (await getFullConfiguration(assistantId || '', full)) as any;
  } catch (error) {
    console.error(`[instructionsClient] Error getting assistant ${assistantId} data:`, error);

    return null;
  }
}

export async function createCopyAssistant(assistant: Assistant): Promise<Assistant | null> {
  try {
    const userId = await getSessionUser();

    if (!assistant || !userId) {
      console.warn('Assistant not passed or user not authenticated!');
      return null;
    }

    const copy = await duplicateAssistant(userId, assistant);
    revalidateTag('assistants');

    return copy as Assistant;
  } catch (error) {
    console.error(`[instructionsClient] Error creating copy of assistant ${assistant.id}:`, error);

    return null;
  }
}

export async function updateAssistantMetaData(id: string, data: Partial<AssistantMeta>): Promise<AssistantMeta | null> {
  let assistantId;
  try {
    assistantId = id || (await getCurrentAssistant());

    if (!assistantId) {
      console.warn('Assistant not found or user not authenticated');
      return null;
    }

    const updatedMeta = await updateAssistantMeta(assistantId, data as any);

    syncAssistant(assistantId);

    return updatedMeta as AssistantMeta;
  } catch (error) {
    console.error(`[instructionsClient] Error getting assistant ${assistantId} data:`, error);

    return null;
  }
}

export async function updateAssistantMetaPrice(
  assistant: Assistant,
  price: Partial<PriceConfiguration>
): Promise<State<PriceConfiguration | null>> {
  let assistantId;
  try {
    assistantId = assistant.id || (await getCurrentAssistant());

    if (!assistantId) {
      console.warn('Assistant not found or user not authenticated');
      return { error: 'General.errors.unexpectedError', value: null };
    }

    const validatedData = assistantPriceSchema.parse(price);

    if (validatedData instanceof Error) {
      return { error: validatedData.message };
    }

    const updatedPrice = await upsertAssistantPrice(assistant.meta?.id || '', {
      ...validatedData,
      trialDays: !!validatedData.trialDays ? 14 : null,
    } as any);

    syncAssistant(assistantId);

    return { successMessage: 'General.successMessages.dataSaved', value: updatedPrice };
  } catch (error) {
    console.error(`[instructionsClient] Error updating assistant ${assistantId} meta price data:`, error);

    return { error: 'General.errors.unexpectedError', value: null };
  }
}

export async function deleteAssistant(id: string) {
  let userId;
  try {
    userId = await getSessionUser();

    if (!userId) return;

    await deleteUserAssistant(userId, id);

    // Notify CoachBot about the deletion
    await notifyAssistantDeletion(id);

    revalidateTag('assistants');
  } catch (error) {
    console.error(`[assistantClient] Error removing user ${userId} assistant ${id}:`, error);
  }
}

interface AssistantUsersParams {
  needle?: string;
  page?: number;
  limit?: number;
}

export async function getAssistantClientUsers(
  id: string,
  params?: AssistantUsersParams
): Promise<AssistantUsersResponse> {
  try {
    const queryString = params ? buildQueryParams(params as Record<string, string>) : '';

    const response = await coachBotClient.getAssistantUsers(id, queryString);

    return response as AssistantUsersResponse;
  } catch (error) {
    console.error(`[assistantClient] Error getting users for assistant ${id}:`, error);

    return {
      users: [],
      count: 0,
      hasMore: false,
      page: 1,
      limit: 20,
    };
  }
}

export async function getAssistantUserChats(id: string, userId: string): Promise<AssistantUserChat[]> {
  try {
    const result = await coachBotClient.getAssistantUserChats(id, userId);
    const chats = result?.chats || [];
    return chats;
  } catch (error) {
    console.error(`[assistantActions] Error getting chats for user ${userId} with assistant ${id}:`, error);
    console.error(`[assistantActions] Error details:`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      assistantId: id,
      userId: userId,
    });

    return [];
  }
}

interface AssistantChatsParams {
  user?: string;
  page?: number;
  orderBy?: string;
  limit?: number;
}

export async function getAssistantChats(
  id: string,
  params?: AssistantChatsParams
): Promise<PaginatedData<AssistantChat>> {
  try {
    const queryString = params ? buildQueryParams(params as Record<string, string>) : '';

    const response = await coachBotClient.getAssistantChats(id, queryString);
    const sortedItems = response.items.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      ...response,
      items: sortedItems,
    };
  } catch (error) {
    console.error(`[assistantClient] Error getting chats for assistant ${id}:`, error);

    return {
      items: [],
      page: 1,
      limit: 20,
      count: 0,
      total: 0,
      hasMore: false,
    };
  }
}

// Cached version of getAssistantChats with cache tags
export const getCachedAssistantChats = unstable_cache(
  async (id: string, params?: AssistantChatsParams) => {
    return await getAssistantChats(id, params);
  },
  ['assistant-chats'],
  {
    tags: ['assistant-chats'],
    revalidate: 60, // Cache for 60 seconds
  }
);

export async function getAssistantChatById(id: string, sessionId: string): Promise<AssistantChat | null> {
  try {
    const response = await coachBotClient.getAssistantChats(id, '?limit=1000');

    if (response.items) {
      const session = response.items.find((chat) => chat.id === sessionId);
      if (session) {
        return session;
      }
    }
    let page = 1;
    const limit = 100;

    while (page <= 10) {
      const paginatedResponse = await coachBotClient.getAssistantChats(id, `?page=${page}&limit=${limit}`);
      if (paginatedResponse.items) {
        const session = paginatedResponse.items.find((chat) => chat.id === sessionId);
        if (session) {
          return session;
        }
      }

      if (!paginatedResponse.hasMore) {
        break;
      }

      page++;
    }

    return null;
  } catch (error) {
    console.error(`[assistantClient] Error getting specific chat ${sessionId} for assistant ${id}:`, error);
    return null;
  }
}

export async function getDashboardAssistants(include?: any): Promise<Assistant[]> {
  try {
    const assistants = await getAssistants(include);

    return await Promise.all(
      assistants.map(async (assistant: Assistant) => {
        const [usersResponse, chats] = await Promise.all([
          getAssistantClientUsers(assistant.id),
          getAssistantChats(assistant.id),
        ]);

        const userCount = usersResponse.count ?? usersResponse.users.length;

        return {
          ...assistant,
          meta: {
            ...assistant.meta,
            users: userCount,
            conversations: chats.total,
          } as AssistantMeta,
        };
      })
    );
  } catch (e) {
    console.error(`[assistantClient] Error fetching dashboard assistants:`, e);
    return [];
  }
}

export async function getAssistantSubscriptions(
  id: string,
  searchQuery?: SubscriptionSearchQuery
): Promise<AssistantSubscription[]> {
  try {
    const queryString = searchQuery ? buildQueryParams(searchQuery as Record<string, any>) : '';

    return await coachBotClient.getAssistantSubscriptions(id, queryString);
  } catch (error) {
    console.error(`[assistantClient] Error getting user subscriptions for assistant ${id}:`, error);

    return [];
  }
}
