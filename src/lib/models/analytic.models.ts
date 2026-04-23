export interface HeapUser {
  email: string;
  username?: string;
  stripeId?: string;
  subscriptionId?: string;
  coachLimit?: string | null;
}

export interface HeapEventProperties {
  [key: string]: string | number | boolean;
}

export enum HeapTrackEvent {
  create_new_chat = 'create_new_chat',
  save_main_instruction = 'save_main_instruction',
  save_main_onboarding = 'save_main_onboarding',
  save_stage = 'save_stage',
  save_style = 'save_style',
}
