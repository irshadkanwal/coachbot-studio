import { NextRequest } from 'next/server';

import { AnalyzeStageData } from '@/lib/models/api.models';
import { handleStageAnalysis } from '@/server/actions/chatActions';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      throw new Error('Chat id is not provided!');
    }
    const stageAnalysis: AnalyzeStageData = await request.json();
    await handleStageAnalysis(id, stageAnalysis);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.warn('[stage-analyzer debugger]', JSON.stringify(error));
    console.error('[chatApi] Error handling chat stage-analysis POST request:', error);

    return Response.json({ success: false, message: 'Error occured!' }, { status: 404 });
  }
}
