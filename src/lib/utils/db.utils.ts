import { ModelConfig as PrismaModelConfig, Style as PrismaStyle } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { z } from 'zod';

import { DEFAULT_PRICE_TRIAL_PERIOD } from '../constants';
import { Message } from '../models/chat.models';
import { PriceCurrency } from '../models/checkout.models';
import { Level, ModelConfig } from '../models/common.models';
import { GoalCompletionType, GoalFrequency, GoalMonthlyRepeat } from '../models/goal.models';
import { Style, Tone } from '../models/instruction.models';

export const defaultStyleData = {
  title: '',
  tone: Tone.friendly,
  emoji_frequency: Level.low,
  language_complexity: Level.low,
  greeting_templates: '',
  response_patterns: '',
  closing_templates: '',
  custom: true,
  assistantId: '',
};

const levelEnum = z.enum([Level.low, Level.medium, Level.high]);
const toneEnum = z.enum([Tone.professional, Tone.energetic, Tone.friendly, Tone.supportive]);

export const instructionSchema = z.object({
  instructions: z
    .string()
    .min(10, { message: 'General.errors.minLength10' })
    .max(15000, { message: 'General.errors.maxLength15000' }),
});

export const stageSchema = z.object({
  instructions: z
    .string()
    .min(10, { message: 'General.errors.minLength10' })
    .max(10000, { message: 'General.errors.maxLength10000' }),
  analyzer: z
    .string()
    .min(10, { message: 'General.errors.minLength10' })
    .max(10000, { message: 'General.errors.maxLength10000' })
    .optional(),
});

export const orderSchema = z.object({ order: z.number().min(0, { message: 'General.errors.emptyFiled' }) });
export const nameSchema = z.object({ name: z.string().min(1, { message: 'General.errors.emptyFiled' }) });

export const userAccountSchema = z.object({
  name: z.string().min(1, { message: 'Account.accountForm.errors.emptyName' }),
  email: z
    .string()
    .min(1, { message: 'Account.accountForm.errors.emptyEmail' })
    .email({ message: 'Account.accountForm.errors.invalidEmail' }),
});

export const styleSchema = z.object({
  emoji_frequency: levelEnum,
  language_complexity: levelEnum,
  tone: toneEnum,
  greeting_templates: z
    .string()
    .min(50, { message: 'General.errors.minLength50' })
    .max(10000, { message: 'General.errors.maxLength10000' }),
  response_patterns: z
    .string()
    .min(50, { message: 'General.errors.minLength50' })
    .max(10000, { message: 'General.errors.maxLength10000' }),
  closing_templates: z
    .string()
    .min(50, { message: 'General.errors.minLength50' })
    .max(10000, { message: 'General.errors.maxLength10000' }),
});

export const assistantSchemaWithTemplate = z.object({
  template: z.object({}).refine((val) => val !== null && val !== undefined, {
    message: 'General.errors.templateSelection',
  }),
  name: z
    .string()
    .min(1, { message: 'General.errors.emptyFiled' })
    .max(200, { message: 'General.errors.maxLength200' }),
  description: z
    .string()
    .min(1, { message: 'General.errors.emptyFiled' })
    .max(2000, { message: 'General.errors.maxLength2000' }),
});

export const assistantSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'General.errors.emptyFiled' })
    .max(200, { message: 'General.errors.maxLength200' }),
  description: z
    .string()
    .min(1, { message: 'General.errors.emptyFiled' })
    .max(2000, { message: 'General.errors.maxLength2000' }),
});

export const stripePriceSchema = z.object({
  currency: z.enum(Object.values(PriceCurrency) as [string, ...string[]]),
  monthly: z.coerce.number().min(1, { message: 'General.errors.emptyFiled' }),
  yearly: z.coerce.number().optional(),
});

export const assistantPriceSchema = z.object({
  currency: z.enum(Object.values(PriceCurrency) as [string, ...string[]]),
  monthly: z.coerce.number().min(1, { message: 'General.errors.emptyFiled' }),
  yearly: z.coerce.number().optional(),
  trialDays: z.coerce.number().optional().default(DEFAULT_PRICE_TRIAL_PERIOD),
  stripeProductId: z.string().min(5),
  monthlyPriceId: z.string().min(5),
  yearlyPriceId: z.string().optional().nullable(),
});

export const categorySchema = z.object({
  id: z.string().min(1, { message: 'Category.id.required' }),
  name: z.string().trim().min(1, { message: 'General.errors.categoriesNameRequired' }),
  description: z.string().trim().min(1, { message: 'General.errors.categoriesDescriptionRequired' }),
  isDefault: z.boolean().optional().nullable(),
});

export const categoriesCountSchema = z.array(categorySchema).min(3, { message: 'General.errors.categoriesMinLength' });

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const goalCompletionRuleSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(GoalCompletionType.never),
  }),
  z.object({
    type: z.literal(GoalCompletionType.date),
    date: z.coerce.date().min(tomorrow, {
      message: 'CoachDetails.Config.GoalTrackPage.addGoalForm.errors.futureCompletionDate',
    }),
  }),
  z.object({
    type: z.literal(GoalCompletionType.after),
    times: z.coerce.number().int().min(1, { message: 'General.errors.emptyFiled' }),
  }),
]);

export const goalCreateSchema = z
  .object({
    title: z.string().min(10, { message: 'General.errors.minLength10' }),
    categoryId: z.string().uuid({ message: 'General.errors.invalidId' }),
    frequency: z.nativeEnum(GoalFrequency),
    repeatEvery: z.coerce.number().int().min(1, { message: 'General.errors.emptyFiled' }),
    weeklyRepeat: z.array(z.string()).optional().nullable(),
    monthlyRepeat: z.nativeEnum(GoalMonthlyRepeat).optional().nullable(),
    completionRule: goalCompletionRuleSchema,
  })
  .superRefine((data, ctx) => {
    if (data.frequency === GoalFrequency.weekly && !data.weeklyRepeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weeklyRepeat'],
        message: 'CoachDetails.Config.GoalTrackPage.addGoalForm.errors.weekDaysSelection',
      });
    }

    if (data.frequency === GoalFrequency.monthly && !data.monthlyRepeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monthlyRepeat'],
        message: 'CoachDetails.Config.GoalTrackPage.addGoalForm.errors.montlyConditionSelection',
      });
    }

    if (data.frequency === GoalFrequency.daily) {
      if (data.weeklyRepeat) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['weeklyRepeat'],
          message: 'Week days should not be defined for daily goals',
        });
      }
      if (data.monthlyRepeat) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['monthlyRepeat'],
          message: 'Montly condition should not be defined for daily goals',
        });
      }
    }
  });

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateUniqueIds(count: number, min: number, max: number): number[] {
  const ids = new Set<number>();
  while (ids.size < count) {
    ids.add(getRandomInt(min, max));
  }
  return Array.from(ids);
}

export function mapConversationHistory(
  messages: Message[],
  stage_name: string,
  current_stage: boolean
): { content: string; role: string }[] {
  return messages
    .filter(({ stage }: Message) => (current_stage ? stage_name === stage : stage_name !== stage))
    .map(({ content, role }: Message) => ({ content, role }));
}

export function parseJsonField<T>(field: T | string | JsonValue | JSON): T {
  if (typeof field === 'string') {
    try {
      return (field.length > 0 ? JSON.parse(field) : field) as T;
    } catch (error) {
      console.error('Failed to parse field:', error);
      return field as T;
    }
  }

  return field as T;
}

export function parseArrayToString<T>(data: T, keys: string[]): Partial<T> {
  return keys.reduce((finalData: Partial<T>, key: string) => {
    const parsedField = parseJsonField<T[keyof T]>(data[key as keyof T]);

    return {
      ...finalData,
      [key]: Array.isArray(parsedField) ? parsedField.join('\n') : parsedField,
    };
  }, {});
}

export const mapStyleData = (style: PrismaStyle | Style): Style => {
  return {
    ...style,
    ...parseArrayToString(style, ['greeting_templates', 'response_patterns', 'closing_templates']),
  } as any;
};

export const mapPrismaModelConfig = (config: PrismaModelConfig): ModelConfig => {
  return {
    ...config,
    temperature: config.temperature?.toNumber(),
    presence_penalty: config.presence_penalty?.toNumber(),
    frequency_penalty: config.frequency_penalty?.toNumber(),
    top_p: config.top_p?.toNumber(),
  };
};

export const mapRelationConfig = <T>(data: T & { modelConfigs: PrismaModelConfig[] }): T => {
  return {
    ...data,
    modelConfigs: data.modelConfigs.length ? data.modelConfigs.map(mapPrismaModelConfig) : [],
  };
};
