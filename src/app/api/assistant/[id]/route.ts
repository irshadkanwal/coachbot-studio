import { NextRequest } from 'next/server';
import { Preference, Stage, User } from '@prisma/client';

import { Assistant, AssistantConfiguration } from '@/lib/models/assistant.models';
import { getAssistantData } from '@/server/db/assistantClient';
import { getAssistantFirstStage } from '@/server/db/configurationClient';

type AssistantConfigDetailed = Assistant & { configuration: AssistantConfiguration & { stages?: Stage[] } };
type AssistantUserDetailed = Assistant & { user: User & { preferences: Preference } };

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      throw new Error('Assistant id is not provided!');
    }

    const [assistant, firstStage] = await Promise.all([
      getAssistantData(id, {
        meta: true,
        configuration: { include: { stages: true } },
        user: { include: { preferences: true } },
      }),
      getAssistantFirstStage(id),
    ]);

    if (!assistant) {
      throw new Error('Assistant not found!');
    }

    const { instructions, onboarding, stages } = (assistant as AssistantConfigDetailed)?.configuration || {};
    const { usageType, tokensLimit, communicationModes } = assistant?.meta || {};
    const { guidelines, toneOfVoice } = (assistant as AssistantUserDetailed)?.user?.preferences || {};

    return Response.json(
      {
        instructions,
        onboarding,
        stages,
        firstStage: firstStage?.name,
        success: true,
        usageType,
        tokensLimit,
        communicationModes,
        preferences: { guidelines, toneOfVoice },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[assistantApi] Error handling GET request:', error);

    return Response.json({ success: false, message: 'Assistant not found' }, { status: 404 });
  }
}
