import { ChatInfo, Message } from './chat.models';

export interface CoachingPayload {
  user_id: string;
  assistant_id: string;
  chat_id: string;
  history: Message[];
  newMessage: Message;
  current_stage: string;
  app: string;
}

export interface CoachingResponse {
  chat_id: string;
  response: string;
}

interface Criteria {
  text: string;
  action: string;
  priority: string;
}

export interface AnalyzeStageData {
  transition_required: boolean;
  current_stage: string;
  next_stage: string;
  confidence: number;
  reasoning: string;
  criteria_missing: (Criteria | string)[];
}

export interface MessageSendPayload {
  userId: string;
  assistantId: string;
  newMessage: Message;
  prevMessages: Message[];
  chat_id: string;
  chatInfo: ChatInfo;
}
