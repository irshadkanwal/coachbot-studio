import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

import eventEmitter from '@/lib/eventEmitter';
import { AssistantStatus } from '@/lib/models/assistant.models';
import { updateUserAssistant } from '@/server/db/assistantClient';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { user_id, coach_id } = await request.json();

    if (!user_id) {
      throw new Error('UserID is not provided');
    }

    eventEmitter.emit(`message:${user_id}`, {
      user_id,
      event: 'coachCreated',
      data: coach_id,
    });

    await updateUserAssistant(user_id, coach_id, { status: AssistantStatus.draft });
    revalidateTag('assistants');

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[coachCreatedApi] Error handling POST request:', error);

    return Response.json({ success: false, error }, { status: 500 });
  }
}
