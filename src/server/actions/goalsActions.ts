'use server';

import { revalidateTag } from 'next/cache';

import { State } from '@/lib/models/common.models';
import { Category, Goal, GoalCompletionRule, NewGoal } from '@/lib/models/goal.models';
import { categoriesCountSchema, goalCreateSchema } from '@/lib/utils/db.utils';
import { getRemovedCategoriesIds, mapCategories } from '@/lib/utils/mapper.utils';
import {
  createAssistantDefaultCategories,
  createGoal,
  deleteGoal,
  getAllCategories,
  getAllGoals,
  getDefaultCategories,
  removeCategories,
  updateGoal,
  upsertCategories,
} from '../db/goalsClient';

async function getAssistantCategory(assistantId: string, data: NewGoal): Promise<Category | null> {
  try {
    if (!data.category.isDefault) return data.category;

    const categories = await createAssistantDefaultCategories(assistantId);

    if (!categories.length) throw new Error('Assistant does not have any categories!');
    revalidateTag('assistantCategories');

    return categories.find((c) => c.name === data.category.name && c.description === data.category.description) || null;
  } catch (error) {
    console.error(`[goalsActions] error during get assistant ${assistantId} category`, error);

    return null;
  }
}

export async function createNewGoal(assistantId: string, data: NewGoal) {
  try {
    const goalCategory = await getAssistantCategory(assistantId, data);
    const parsedData = goalCreateSchema.safeParse({ ...data, categoryId: goalCategory?.id });

    if (!parsedData.success) {
      return { errors: parsedData.error.errors.map(({ message, path }) => ({ name: path.join('.'), message })) };
    }

    const value = await createGoal(assistantId, {
      ...parsedData.data,
      assistantId,
      weeklyRepeat: parsedData.data.weeklyRepeat || [],
    });
    revalidateTag('assistantGoals');

    return { value, successMessage: 'CoachDetails.Config.GoalTrackPage.addGoalForm.successmessage' };
  } catch (error) {
    console.error(`[goalsActions] error during creating new goal for assistant ${assistantId}`, error);

    return { error: 'General.errors.unexpectedError' };
  }
}

export async function getGoals(assistantId: string): Promise<Goal[]> {
  try {
    const goals = await getAllGoals(assistantId);

    return goals.map(
      (goal) => ({ ...goal, completionRule: goal.completionRule as unknown as GoalCompletionRule }) as Goal
    );
  } catch (error) {
    console.error(`[goalsActions] Error fetching goals for assistant ${assistantId}:`, error);
    return [];
  }
}

export async function updateExistingGoal(id: string, data: NewGoal) {
  try {
    const parsedData = goalCreateSchema.safeParse({ ...data, categoryId: data.category.id });

    if (!parsedData.success) {
      return { errors: parsedData.error.errors.map(({ message, path }) => ({ name: path.join('.'), message })) };
    }

    const value = await updateGoal(id, {
      ...parsedData.data,
      weeklyRepeat: parsedData.data.weeklyRepeat || [],
    });
    revalidateTag('assistantGoals');

    return { value, successMessage: 'CoachDetails.Config.GoalTrackPage.addGoalForm.successmessage' };
  } catch (error) {
    console.error(`[goalsActions] Error deleting goal  ${id}:`, error);
    return { error: 'General.errors.unexpectedError' };
  }
}

export async function removeGoal(id: string): Promise<Goal | null> {
  try {
    const deletedGoal = await deleteGoal(id);
    revalidateTag('assistantGoals');

    return deletedGoal as unknown as Goal;
  } catch (error) {
    console.error(`[goalsActions] Error deleting goal  ${id}:`, error);
    return null;
  }
}

export async function getCategories(assistantId: string): Promise<Category[]> {
  try {
    const [assistantCategories, defaultCategories] = await Promise.all([
      getAllCategories(assistantId),
      getDefaultCategories(),
    ]);

    return !!assistantCategories.length ? assistantCategories : defaultCategories;
  } catch (error) {
    console.error(`[goalsActions] Error fetching categories for assistant ${assistantId}:`, error);

    return [];
  }
}

export async function saveCategories(
  assistantId: string,
  newCategories: Category[],
  prevCategories: Category[]
): Promise<State<Category[]>> {
  try {
    const parsedData = categoriesCountSchema.safeParse(newCategories);

    if (!parsedData.success) {
      return { errors: parsedData.error?.errors.map(({ message, path }) => ({ name: path.join('.'), message })) };
    }

    const mappedCategories = mapCategories(parsedData.data);
    const removedCategoryIds = getRemovedCategoriesIds(prevCategories, newCategories);

    const [categories] = await Promise.all([
      upsertCategories(assistantId, mappedCategories),
      removeCategories(assistantId, removedCategoryIds),
    ]);

    ['assistantCategories', 'assistantGoals'].forEach(revalidateTag);

    return { successMessage: 'General.successMessages.dataSaved', value: categories };
  } catch (error) {
    console.error(`[goalsActions] Error saving categories for assistant ${assistantId}:`, error);

    return { error: 'General.errors.unexpectedError', value: null };
  }
}
