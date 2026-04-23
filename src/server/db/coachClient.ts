import { Coach, Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

type NewCoachInput = {
  id?: string;
  user_id: string;
  name: string;
  description: string;
  knowledge: string[];
  assessment: Prisma.InputJsonValue;
};

export async function createCoach(data: NewCoachInput): Promise<Coach> {
  try {
    return await prisma.coach.create({ data });
  } catch (error) {
    console.error('[coachClient] Prisma error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function getCoachByID(id: string): Promise<Coach | null> {
  try {
    return await prisma.coach.findUnique({ where: { id } });
  } catch (error) {
    console.error('[coachClient] Prisma error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function updateCoach(data: NewCoachInput): Promise<Coach> {
  try {
    return await prisma.coach.update({ where: { id: data.id }, data });
  } catch (error) {
    console.error('[coachClient] Prisma error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function deleteCoachByID(id: string): Promise<Coach> {
  try {
    return await prisma.coach.delete({ where: { id } });
  } catch (error) {
    console.error('[coachClient] Prisma error:', error instanceof Error ? error.message : error);
    throw error;
  }
}
