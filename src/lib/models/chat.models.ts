import { AnalyzeStageData } from './api.models';
import { Style } from './instruction.models';

export interface Chat {
  id: string;
  name: string;
  userId: string;
  created_at: Date | string;
  currentStage?: string | null;
  ChatLifeAreas?: JSON;
  Summary?: JSON;
  Messages?: Message[];
  stageAnalysis?: AnalyzeStageData;
}

export interface Message {
  id: string;
  content: string;
  originalContent?: string | null;
  star?: boolean | null;
  role: MessageRole | string;
  chatId?: string;
  created_at: Date | string;
  type?: string | null;
  stage?: string | null;
  status?: MessageStatus;
  isLoading?: boolean;
  error?: boolean;
  recurring?: boolean;
}

export enum MessageStatus {
  generating = 'generating',
  complete = 'complete',
}

export enum MessageRole {
  user = 'user',
  assistant = 'assistant',
}

export enum ChatMode {
  new = 'new',
  recurring = 'recurring',
}

export interface ChatInfo {
  stage: string;
  style: Style | null;
  mode: ChatMode;
}
