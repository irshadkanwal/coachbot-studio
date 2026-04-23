import { Message } from './chat.models';
import { PriceCurrency, SubscriptionStatus } from './checkout.models';
import { ModelConfig, Template, User } from './common.models';
import { Stage, Style } from './instruction.models';

export enum AssistantAccessMode {
  fullAccess = 'full_access',
  highLevel = 'high_level',
  confidential = 'confidential',
}

export enum AssistantStatus {
  published = 'published',
  draft = 'draft',
  archived = 'archived',
  inProgress = 'in_progress',
}

export enum Visibility {
  public = 'public',
  private = 'private',
}

export enum AccessLevel {
  free = 'free',
  premium = 'premium',
}

export enum AssistantUsageType {
  general = 'general',
  unique = 'unique',
}

export enum CommunicationMode {
  text_to_text = 'text_to_text',
  speech_to_text = 'speech_to_text',
  voice_to_voice = 'voice_to_voice',
  video_avatar = 'video_avatar',
}

export interface PriceConfiguration {
  id: string;
  assistantMeta?: AssistantMeta;
  assistantMetaId?: string;
  amount: number | null;
  monthly: number;
  yearly?: number | null;
  currency: PriceCurrency | string;
  trialDays: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface StripePriceConfiguration {
  stripeProductId: string;
  monthlyPriceId: string;
  yearlyPriceId?: string | null;
  error?: string;
}

export type AssistantPrice = PriceConfiguration & StripePriceConfiguration;

export interface AssistantFeedback {
  id: string;
  assistantMeta?: AssistantMeta;
  assistantMetaId?: string;
  rating: number;
  title: string;
  description: string;
  userId?: string | null;
  userName?: string | null;
}

export interface AssistantConfiguration {
  id: string;
  assistant?: Assistant;
  templateId?: string;
  template?: Template;
  modelConfigs?: ModelConfig[];
  stages?: Stage[];
  styles?: Style[];
  instructions?: string;
  onboarding?: string;
}

export interface AssistantMeta {
  id?: string;
  assistant?: Assistant;
  visibility?: Visibility | string;
  accessLevel?: AccessLevel | string;
  price?: AssistantPrice;
  created_at?: Date | null;
  updated_at?: Date | null;
  users?: number;
  conversations?: number;
  whatsapp?: boolean | null;
  sms?: boolean | null;
  revenueEnabled?: boolean | null;
  goalTrack?: boolean | null;
  goalVision?: boolean | null;
  tokensLimit?: number | null;
  usageType: AssistantUsageType | null;
  communicationModes?: CommunicationMode[];
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  user?: User;
  userId?: string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  accessMode?: AssistantAccessMode;
  status?: AssistantStatus | string;
  meta?: AssistantMeta;
  configuration?: AssistantConfiguration;
  feedbacks?: AssistantFeedback[];
}

export interface AssistantEditable {
  id?: string;
  name: string;
  description: string;
  accessMode?: AssistantAccessMode;
  status?: string | AssistantStatus;
}

export interface AssistantUser {
  id: string;
  name: string;
  email: string;
  session: {
    firstDate: Date | string | null;
    lastDate: Date | string | null;
    total: number;
  };
}

export interface AssistantUsersResponse {
  users: AssistantUser[];
  count?: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

export interface AssistantUserData {
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
}

export type SessionSummary = {
  fileId: string;
  fileName: string;
  type: string;
  uploadedAt: string;
};
export interface AssistantUserChat {
  id: string | null;
  name: string | null;
  userId: string | null;
  assistantId: string | null;
  archived?: boolean | null;
  created_at: Date | string;
  updated_at: Date | string;
  stage: string;
  messages?: Message[] | null;
  sessionSummary: SessionSummary;
}

export interface AssistantUserChatsResponse {
  chats: AssistantUserChat[];
  total: number;
}

export type AssistantChat = AssistantUserChat & AssistantUserData;

export interface AssistantSubscription extends AssistantUserData {
  created_at: Date | string;
  canceled_at?: Date | string | null;
  interval: 'month' | 'year';
  status: SubscriptionStatus;
}
export interface SubscriptionSearchQuery {
  sort?: string;
  interval?: string;
  period?: string;
  from?: string | null;
}

export interface AssistantPayload {
  id: string;
  name: string;
  description: string;
  price?: AssistantPrice;
  authorData?: { id?: string; name?: string | null; email?: string; pictureUrl: string | null };
  meta?: {
    visibility?: Visibility | string;
    accessLevel?: AccessLevel | string;
    revenueEnabled?: boolean | null;
    sms?: boolean | null;
    whatsapp?: boolean | null;
  };
  configuration: {
    mode?: AssistantAccessMode;
    instructions?: string;
    tokensLimit?: number | null;
    usageType?: AssistantUsageType | null;
    communicationModes?: CommunicationMode[];
    firstStage?: string;
  };
}
