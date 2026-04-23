import { NextRequest } from 'next/server';

import eventEmitter from '@/lib/eventEmitter';
import { editFile } from '@/server/actions/filesActions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { user_id, file_id, status } = await request.json();

    const editedFile = await editFile(file_id, { status }, user_id);
    eventEmitter.emit(`message:${user_id}`, { user_id, event: 'fileUpdated', data: editedFile });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[knowledgeBaseApi] Error handling POST request:', error);

    return Response.json({ success: false, error }, { status: 500 });
  }
}
