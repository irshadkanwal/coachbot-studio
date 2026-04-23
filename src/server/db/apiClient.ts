import { CoachingPayload, CoachingResponse } from '@/lib/models/api.models';

export enum ApiPath {
  coaching = '/coaching',
}

export enum ResponseContentType {
  text = 'text/plain',
  json = 'application/json',
}

export class ApiClient {
  private readonly config: any;

  constructor() {
    this.config = {
      baseUrl: process.env.AI_API_BASE_URL || '',
    };
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
        headers: { 'Content-Type': 'application/json', 'X-API-Key': process.env.AI_API_KEY || '' },
        body: JSON.stringify(data),
        next: { tags: [tag || endpoint] },
      });

      if (!response.ok) {
        const error = await response.json();

        console.error(error);
        throw new Error(
          `[apiClient] ${method} Request failed with status ${response.status}, error: ${JSON.stringify(error)}`
        );
      }

      return response.headers.get('content-type') === ResponseContentType.json ? response.json() : response.text();
    } catch (error) {
      console.error(`[aiApiClient] ${endpoint} error:`, error);

      throw new Error(`[aiApi] Failed to make ${method} request to ${endpoint}`);
    }
  }

  public async sendMessage(payload: CoachingPayload): Promise<CoachingResponse> {
    return this.makePostRequest(
      ApiPath.coaching,
      {
        ...payload,
        messages: payload.history.map(({ created_at, ...message }) => message),
        newMessage: { ...payload.newMessage, created_at: undefined },
      },
      'chat_coaching'
    );
  }
}

export const apiClient = new ApiClient();
