import { Assistant } from './assistant.models';
import { Subscription } from './checkout.models';
import { Stage, Style } from './instruction.models';

export interface ModelConfig {
  id: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  created_at: Date | null;
  assistantId?: string | null;
}

export interface Template {
  id: string;
  name: string;
  instructions: string;
  onboarding: string;
  onboardingAnalyzer: string;
  modelConfigs: ModelConfig[];
  stages: Stage[];
  styles?: Style[];
}

export enum Period {
  allTime = 'all time',
  last7Days = '7',
  last30Days = '30',
}

export enum FileStatus {
  error = 'error',
  processing = 'processing',
  complete = 'complete',
}

export enum FileType {
  knowledge = 'knowledge',
  reference = 'reference',
}

export interface KnowledgeFile {
  id: string;
  name: string;
  location: string | null;
  status: FileStatus | string;
  uploaded_at: Date;
  user_id: string;
  file?: any;
  checked?: boolean;
  fileType: FileType | string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  pictureUrl?: string;
  emailVerified: boolean | null;
  accessAllowed?: boolean | null;
  onboardingPassed?: boolean | null;
  Chat?: any[];
  assistants?: Assistant[];
  KnowledgeFile?: KnowledgeFile[];
  subscription?: Subscription;
  consentAccepted?: boolean;
  consentAcceptedAt?: Date;
}

export enum Level {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export type UpdateResult = {
  success: boolean;
  error?: string;
};

export interface State<T> {
  value?: T | null;
  error?: string | null;
  errors?: { name: string | number; message: string }[];
  successMessage?: string | null;
  errorParams?: Record<string, any>;
}

export interface SessionDetails {
  details?: SessionDetailsTab[];
  context?: SessionDetailsTab[];
  progress?: SessionDetailsTab[];
}

export interface SessionDetailsTab {
  name: string;
  descriptions: ({ type: 'text'; value: string; title?: string } | { type: 'list'; value: string[]; title?: string })[];
}

export interface PaginatedData<T> {
  items: T[];
  page: number;
  limit: number;
  count: number;
  hasMore: boolean;
  total: number;
}
