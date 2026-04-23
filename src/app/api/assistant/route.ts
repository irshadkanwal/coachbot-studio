import { NextRequest } from 'next/server';

import { Assistant } from '@/lib/models/assistant.models';
import { getAssistantWithPicturePayload } from '@/server/actions/assistantActions';
import { getAssistans } from '@/server/db/assistantClient';

export async function POST(request: NextRequest) {
  try {
    const ids = await request.json();

    const requestedAssistants = (await getAssistans(ids, {
      meta: { include: { price: true } },
      configuration: { include: { stages: { orderBy: { order: 'asc' } } } },
      user: true,
    })) as Assistant[];

    const assistants = await Promise.all(requestedAssistants.map(getAssistantWithPicturePayload));

    return Response.json({ success: true, assistants }, { status: 200 });
  } catch (error) {
    console.error('[assistantPostApi] Error handling assistant POST request:', error);

    return Response.json({ success: false, error }, { status: 500 });
  }
}
