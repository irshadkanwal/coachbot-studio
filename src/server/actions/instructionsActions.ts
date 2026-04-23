'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { AssistantState } from '@/app/(main)/instructions/_components/SystemInstructions';
import { State } from '@/lib/models/common.models';
import { Stage, Style } from '@/lib/models/instruction.models';
import {
  defaultStyleData,
  instructionSchema,
  mapStyleData,
  nameSchema,
  stageSchema,
  styleSchema,
} from '@/lib/utils/db.utils';
import {
  createAssistantStage,
  createAssistantStyle,
  deleteAssistantStage,
  deleteAssistantStyle,
  getAssistantFirstStage,
  getAssistantStages,
  getAssistantStyles,
  updateAssistantStage,
  updateAssistantStagesOrder,
  updateAssistantStyle,
  updateConfigurationInstructions,
} from '../db/configurationClient';
import { getAssistantConfiguration, getCurrentAssistant } from './assistantActions';

async function validateAndUpdateItem<S, T extends { id: S }>(
  data: T,
  schema: z.ZodSchema<Partial<T>>,
  updateFunction: (assistantId: string, id: S, data: Partial<T>) => Promise<any>,
  successMessage: string,
  tag?: string
): Promise<State<T>> {
  let assistantId;
  try {
    assistantId = await getCurrentAssistant();

    if (!assistantId) {
      console.warn('Assistant not found or user not authenticated');
      return { error: 'General.errors.noAssistantExist', value: null };
    }

    const parsedData = schema.safeParse(data);

    if (!parsedData.success) {
      return { errors: parsedData.error.errors.map(({ message, path }) => ({ name: path.join('.'), message })) };
    }

    const value = await updateFunction(assistantId, data.id, parsedData.data);

    tag && revalidateTag(tag);
    return { successMessage, value };
  } catch (error) {
    console.error(`[instructionsActions] Error during updating '${data.id}' ${tag} item : `, error);
    return { error: 'Instructions.systemInstruction.errors.saveFailed', value: data };
  }
}

async function createItem<T>(
  data: T,
  createFunction: (assistantId: string, data: T) => Promise<T>,
  successMessage: string,
  tags: string[] = []
): Promise<State<T>> {
  let assistantConfigId;
  try {
    const assistantConfig = await getAssistantConfiguration();
    assistantConfigId = assistantConfig?.id;

    if (!assistantConfigId) {
      console.warn('Assistant not found or user not authenticated');
      return { error: 'General.errors.noAssistantExist', value: null };
    }

    const createdItem: any = await createFunction(assistantConfigId, data as T);
    tags.forEach(revalidateTag);

    return { successMessage, value: createdItem };
  } catch (error) {
    console.error(`[instructionsActions] Error during creating ${tags?.[0]} item`, error);
    return { error: 'Instructions.systemInstruction.errors.saveFailed' };
  }
}

async function getItems<T>(getFunction: (assistantId: string) => Promise<T>, tag?: string, id?: string): Promise<T> {
  let assistantId;
  try {
    assistantId = id || (await getCurrentAssistant());

    if (!assistantId) {
      console.warn('Assistant not found or user not authenticated');
      return [] as T;
    }

    return getFunction(assistantId);
  } catch (error) {
    console.error(`[instructionsActions] Error during getting assistant '${assistantId}'  ${tag} data`, error);
    return [] as T;
  }
}

async function deleteItem<T>(
  id: T,
  deleteFunction: (id: T) => Promise<any>,
  successMessage: string,
  tags: string[] = []
): Promise<State<null>> {
  try {
    await deleteFunction(id);
    tags.forEach(revalidateTag);

    return { successMessage, value: null };
  } catch (error) {
    console.error(`[instructionsActions] Error during deleting '${id}'  ${tags[0]} data.`, error);
    return { error: 'Instructions.systemInstruction.errors.saveFailed' };
  }
}

// MAIN INSTRUCTIONS
export async function updateConfigInstructions(formData: any): Promise<State<AssistantState>> {
  let assistantId;
  try {
    assistantId = (await getCurrentAssistant()) || '';
    const formInstructions = formData?.get('instructions');
    const formOnboarding = formData?.get('onboarding');
    if (formInstructions) {
      const validatedData = instructionSchema.safeParse({ instructions: formInstructions });

      if (!validatedData.success) {
        const firstError = validatedData.error.errors[0];
        return { error: firstError?.message || 'Instructions.systemInstruction.errors.saveFailed' };
      }
    }

    const { instructions, onboarding } = await updateConfigurationInstructions(assistantId, {
      instructions: !!formInstructions ? formInstructions : undefined,
      onboarding: !!formOnboarding ? formOnboarding : undefined,
    });
    return { successMessage: 'Instructions.systemInstruction.successMessages', value: { instructions, onboarding } };
  } catch (error) {
    console.error(`[instructionsClient] Error updating assistant ${assistantId} instructions:`, error);

    return { error: 'Instructions.systemInstruction.errors.saveFailed' };
  }
}

// STYLES
export async function getStyles(): Promise<Style[]> {
  const styles = (await getItems(getAssistantStyles, 'styles')) || [];

  return styles.map(mapStyleData);
}

export async function updateStyle(style: Style): Promise<State<Style | null>> {
  const styleData = {
    ...style,
    greeting_templates: JSON.stringify(style.greeting_templates.split('\n')),
    response_patterns: JSON.stringify(style.response_patterns.split('\n')),
    closing_templates: JSON.stringify(style.closing_templates.split('\n')),
  };

  const result = await validateAndUpdateItem<number, Style>(
    styleData,
    styleSchema,
    updateAssistantStyle,
    'Instructions.Styles.successMessage',
    'styles'
  );

  return { ...result, value: result.value ? mapStyleData(result.value) : result.value };
}

export async function updateStyleTitle(id: number, title: string): Promise<State<Style | null>> {
  let assistantId;
  try {
    assistantId = (await getCurrentAssistant()) || '';
    const value: any = await updateAssistantStyle(assistantId || '', id, { ...defaultStyleData, title });

    return { successMessage: 'General.successMessages.dataSaved', value: mapStyleData(value) };
  } catch (error) {
    console.error(`[instructionsClient] Error updating style ${id} title:`, error);

    return { error: 'General.errors.unexpectedError', value: null };
  }
}

export async function createStyle(title: string): Promise<State<Style | null>> {
  return createItem<any>({ ...defaultStyleData, title }, createAssistantStyle, 'General.successMessages.dataSaved', [
    'styles',
  ]);
}

export async function deleteStyle(id: number): Promise<State<null>> {
  return deleteItem(id, deleteAssistantStyle, 'General.successMessages.dataDeleted', ['styles']);
}

// STAGES
export async function getStages(id?: string): Promise<Stage[]> {
  return getItems<Stage[]>(getAssistantStages, 'stages', id);
}

export async function getFirstStage(): Promise<Stage | null> {
  return getItems<Stage | null>(getAssistantFirstStage, 'first stage');
}

export async function updateStage(stage: Stage, onlyName?: boolean): Promise<State<Stage>> {
  return validateAndUpdateItem<string, Stage>(
    stage,
    onlyName ? nameSchema : stageSchema,
    updateAssistantStage,
    'Instructions.systemInstruction.successMessages',
    'stages'
  );
}
export async function updateStageOrder(targetStage: Stage, changedOrder: number, stages: Stage[]): Promise<Stage[]> {
  let assistantId;

  try {
    assistantId = await getCurrentAssistant();

    if (!assistantId) {
      console.warn('Assistant not found or user not authenticated');
      return [];
    }

    const newOrder = targetStage.order + changedOrder;

    const updatedStages = stages.map((stage: Stage) => {
      if (stage.id === targetStage.id) {
        return { ...targetStage, order: newOrder };
      }

      if (stage.order === newOrder) {
        return { ...stage, order: stage.order - changedOrder || stage.order + changedOrder };
      }

      return stage;
    });

    await updateAssistantStagesOrder(assistantId, updatedStages);
    ['stages', 'firstStage'].forEach(revalidateTag);

    return updatedStages.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error(`[instructionsClient] Error updating assistant ${assistantId} stages order:`, error);

    return [];
  }
}

export async function createStage(name: string): Promise<State<Stage | null>> {
  return createItem<Stage>({ name } as Stage, createAssistantStage, 'General.successMessages.dataSaved', [
    'stages',
    'firstStage',
  ]);
}

export async function deleteStage(id: string): Promise<State<null>> {
  return deleteItem(id, deleteAssistantStage, 'General.successMessages.dataDeleted', ['stages', 'firstStage']);
}
