'use server';

import { unstable_cache } from 'next/cache';
import { Category, Goal, Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export const getAllGoals = unstable_cache(
  async (assistantId: string): Promise<Goal[]> => {
    try {
      return prisma.goal.findMany({
        where: { assistantId },
        include: { category: true },
        orderBy: { created_at: 'desc' },
      });
    } catch (error) {
      console.error(`[goalsClient] Error fetching goals for assistant ${assistantId}:`, error);

      return [];
    }
  },
  ['goals'],
  { tags: ['assistantGoals'], revalidate: 3600 }
);

export async function createGoal(assistantId: string, goalData: Prisma.GoalUncheckedCreateInput): Promise<Goal | null> {
  try {
    return await prisma.goal.create({ data: { ...goalData, assistantId } });
  } catch (error) {
    console.error(`[goalsClient] Error during creating goal ${goalData.title} for assistant ${assistantId}:`, error);
    return null;
  }
}

export async function updateGoal(id: string, data: Prisma.GoalUpdateInput): Promise<Goal | null> {
  try {
    return prisma.goal.update({ where: { id }, data });
  } catch (error) {
    console.error(`[goalsClient] Error during updating goal ${id}:`, error);

    return null;
  }
}

export async function deleteGoal(id: string) {
  try {
    const goal = await prisma.goal.delete({ where: { id } });

    return goal;
  } catch (error) {
    console.error(`[goalsClient] Error during deleting goal ${id}:`, error);

    return null;
  }
}

export const getDefaultCategories = async (): Promise<Category[]> => {
  try {
    return await prisma.category.findMany({ where: { isDefault: true } });
  } catch (error) {
    console.error(`[goalsClient] Error fetching default categories:`, error);

    return [];
  }
};

export const getAllCategories = unstable_cache(
  async (assistantId: string): Promise<Category[]> => {
    try {
      return await prisma.category.findMany({ where: { assistantId } });
    } catch (error) {
      console.error(`[goalsClient] Error fetching categories for assistant ${assistantId}:`, error);

      return [];
    }
  },
  ['categories'],
  { tags: ['assistantCategories'], revalidate: 3600 }
);

export const createAssistantDefaultCategories = async (assistantId: string): Promise<Category[]> => {
  try {
    const defaults = await getDefaultCategories();
    if (!defaults.length) return [];

    await prisma.category.createMany({
      data: defaults.map(({ id, ...category }) => ({ ...category, isDefault: false, assistantId })),
      skipDuplicates: true,
    });

    return await prisma.category.findMany({ where: { assistantId } });
  } catch (error) {
    console.error(`[goalsClient] Error creating  default categories for assistant ${assistantId}:`, error);

    return [];
  }
};

export async function upsertCategories(
  assistantId: string,
  categories: Omit<Prisma.CategoryCreateInput, 'assistant'>[]
) {
  try {
    const savedCategories = await prisma.$transaction((tx) =>
      Promise.all(
        categories.map((category) =>
          tx.category.upsert({
            where: category.id
              ? { assistantId, id: category.id }
              : { name_assistantId: { name: category.name, assistantId } },
            update: { ...category },
            create: {
              ...category,
              assistant: {
                connect: { id: assistantId },
              },
            },
          })
        )
      )
    );

    return savedCategories;
  } catch (error) {
    console.error(`[goalsClient] Error during upsert categories for assistant ${assistantId}:`, error);

    return [];
  }
}

export async function removeCategories(assistantId: string, categoriesIds: string[]) {
  try {
    return await prisma.category.deleteMany({ where: { assistantId, id: { in: categoriesIds } } });
  } catch (error) {
    console.error(`[goalsClient] Error during deleting categories of  ${assistantId}:`, error);

    return [];
  }
}
