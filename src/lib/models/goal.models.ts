export enum GoalFrequency {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
}

export enum GoalCompletionType {
  never = 'never',
  date = 'date',
  after = 'after',
}

export enum GoalMonthlyRepeat {
  everySecondDay = '2nd',
  monday = 'monday',
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  assistantId?: string | null;
  isDefault?: boolean | null;
}

export interface GoalCompletionRule {
  type: GoalCompletionType | string;
  date?: Date | null;
  times?: number | null;
}

export interface NewGoal {
  title: string;
  category: Category;
  frequency: GoalFrequency;
  repeatEvery: number;
  monthlyRepeat?: GoalMonthlyRepeat | null;
  weeklyRepeat?: string[] | null;
  completionRule: GoalCompletionRule;
}

export interface Goal extends NewGoal {
  id: string;
  completed?: boolean | null;
  created_at?: string | Date;
  updated_at?: string | Date;
  assistantId?: string;
  categoryId: string;
}
