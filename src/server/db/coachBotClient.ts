import {
  AssistantChat,
  AssistantPayload,
  AssistantSubscription,
  AssistantUserChatsResponse,
  AssistantUsersResponse,
} from '@/lib/models/assistant.models';
import { PaginatedData } from '../../lib/models/common.models';

enum ApiPath {
  assistant = '/assistant/[id]',
  assistantUsers = '/assistant/[id]/users',
  assistantUserChats = '/assistant/[id]/users/[userId]/chats',
  assistantChats = '/assistant/[id]/chats',
  assistantSubscriptions = '/assistant/[id]/subscriptions',
}

export class CoachBotClient {
  private readonly config: any;

  constructor() {
    this.config = {
      baseUrl: `${process.env.COACHBOT_BASE_URL || ''}/api`,
    };
  }

  private async makeGetRequest<T>(endpoint: string, tag?: string): Promise<T> {
    const fullUrl = `${this.config.baseUrl}${endpoint}`;

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { tags: [tag || endpoint] },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: `HTTP ${response.status}: ${response.statusText} Error: ${parseError}` };
        }

        console.error(`[coachbotClient] GET request failed:`, {
          url: fullUrl,
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });

        throw new Error(`GET Request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error(`[coachbotClient] ${endpoint} error:`, {
        url: fullUrl,
        error: error.message,
        stack: error.stack,
      });

      throw new Error(`Failed to make GET request to ${endpoint}: ${error.message}`);
    }
  }

  private async makePostRequest<T>(
    endpoint: string,
    data: T,
    tag?: string,
    method: 'POST' | 'PUT' = 'POST'
  ): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        next: { tags: [tag || endpoint] },
      });

      if (!response.ok) {
        const error = await response.json();

        console.error(error);
        throw new Error(
          `[coachbotClient] ${method} Request failed with status ${response.status}, error: ${JSON.stringify(error)}`
        );
      }

      return response.json();
    } catch (error) {
      console.error(`[coachbotClient] ${endpoint} error:`, error);

      throw new Error(`[coachbotClient] Failed to make ${method} request to ${endpoint}`);
    }
  }

  public async updateAssistant(assistant: AssistantPayload): Promise<void> {
    return this.makePostRequest(ApiPath.assistant.replace('[id]', assistant.id), assistant, 'assistant');
  }

  public async getAssistantUsers(id: string, params?: string): Promise<AssistantUsersResponse> {
    const endpoint = ApiPath.assistantUsers.replace('[id]', id);
    return this.makeGetRequest(params ? `${endpoint}${params}` : endpoint, 'assistant_users');
  }

  public async getAssistantChats(id: string, params?: string): Promise<PaginatedData<AssistantChat>> {
    return this.makeGetRequest(
      params ? `${ApiPath.assistantChats.replace('[id]', id)}${params}` : ApiPath.assistantChats.replace('[id]', id),
      'assistant_chats'
    );
  }

  public async getAssistantSubscriptions(id: string, searchParams?: string): Promise<AssistantSubscription[]> {
    const endpoint = ApiPath.assistantSubscriptions.replace('[id]', id);
    return this.makeGetRequest(`${endpoint}${searchParams}`, 'assistant_subscriptions');
  }

  public async getAssistantUserChats(id: string, userId: string): Promise<AssistantUserChatsResponse> {
    const endpoint = ApiPath.assistantUserChats.replace('[id]', id).replace('[userId]', userId);
    const fullUrl = `${this.config.baseUrl}${endpoint}`;

    try {
      const result = await this.makeGetRequest<AssistantUserChatsResponse>(endpoint, 'assistant_user_chats');
      return result;
    } catch (error) {
      console.error(`[coachBotClient] Failed to fetch user chats from ${fullUrl}:`, error);
      throw error;
    }
  }
}

export const coachBotClient = new CoachBotClient();
