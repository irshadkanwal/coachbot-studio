import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

import { uploadTranscript } from '@/server/actions/filesActions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const assistantId = formData.get('assistantId') as string;
    const userEmail = formData.get('userEmail') as string;
    const conversationDate = formData.get('conversationDate') as string;
    const userName = formData.get('userName') as string;

    if (!file) {
      return Response.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    if (!assistantId) {
      return Response.json({ success: false, message: 'Assistant ID is required' }, { status: 400 });
    }

    if (!userEmail) {
      return Response.json({ success: false, message: 'User email is required' }, { status: 400 });
    }

    const result = await uploadTranscript(file, assistantId, {
      userEmail,
      conversationDate: conversationDate || new Date().toISOString().split('T')[0],
      userName: userName || undefined,
    });

    if (result.success) {
      // Revalidate both cache tags to refresh the data
      revalidateTag('chats');
      revalidateTag('assistant-chats');

      return Response.json(result, { status: 200 });
    } else {
      return Response.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('[transcriptUploadApi] Error handling transcript upload:', error);
    return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
