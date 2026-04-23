'use server';

import { revalidateTag } from 'next/cache';
import { Coach } from '@prisma/client';

import { createCoach, deleteCoachByID, getCoachByID, updateCoach } from '@/server/db/coachClient';
import { getSessionUser } from './sessionActions';

const PROFILE_DATA_KEY = 'coachbot-profile';

const DEFAULT_COACH_NAME = 'Unnamed Coach';
const DEFAULT_COACH_DESCRIPTION = 'No Description';

export async function upsertCoachAction(rawAnswers: Record<string, any>, coachID?: string) {
  try {
    const coachProfile = rawAnswers?.[PROFILE_DATA_KEY];
    const nameStep = coachProfile?.name;
    const descriptionStep = coachProfile?.description;

    const name = nameStep?.trim() || DEFAULT_COACH_NAME;
    const description = descriptionStep?.trim() || DEFAULT_COACH_DESCRIPTION;

    const userId = await getSessionUser();
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    const baseCoachData = {
      user_id: userId,
      name,
      description,
      knowledge: [],
      assessment: rawAnswers,
    };

    let coach: Coach;

    if (coachID) {
      coach = await updateCoach({
        id: coachID,
        ...baseCoachData,
      });
    } else {
      coach = await createCoach(baseCoachData);
    }

    revalidateTag('assistants');

    return coach as Coach;
  } catch (error) {
    console.error('[coachActions] Error upserting coach:', error);
    throw error;
  }
}

export async function getCoachAction(coachID: string) {
  try {
    if (!coachID) {
      throw new Error('Coach ID is not provided');
    }

    const coach = await getCoachByID(coachID);

    if (!coach) {
      throw new Error('Coach not found');
    }

    return coach as Coach;
  } catch (error) {
    console.error('[coachActions] Error getting coach:', error);
    throw error;
  }
}

export async function deleteCoachAction(coachID: string) {
  try {
    await deleteCoachByID(coachID);
    revalidateTag('assistants');
  } catch (error) {
    console.error('[coachActions] Error deleting coach:', error);
    throw error;
  }
}
