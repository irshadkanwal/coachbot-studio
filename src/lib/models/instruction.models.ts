export interface Stage {
  id: string;
  name: string;
  user_id?: string | null;
  instructions: string | null;
  analyzer?: string | null;
  order: number;
  templateId?: string | null;
  assistantId?: string | null;
}

export interface Style {
  id: number;
  user_id: string;
  tone: string;
  emoji_frequency: string;
  language_complexity: string;
  greeting_templates: string;
  response_patterns: string;
  closing_templates: string;
  created_at: Date | null;
  title: string | null;
  custom: boolean | null;
}

export enum Tone {
  friendly = 'friendly',
  supportive = 'supportive',
  professional = 'professional',
  energetic = 'energetic',
}
