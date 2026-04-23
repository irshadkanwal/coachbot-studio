import { NextRequest } from 'next/server';

import eventEmitter from '@/lib/eventEmitter';
import { getSessionUser } from '@/server/actions/sessionActions';

export async function GET(req: NextRequest) {
  const userId = await getSessionUser();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const intervalId = setInterval(() => {
        controller.enqueue(encoder.encode(': keep-alive\n\n'));
      }, 30000);

      const sendEvent = ({ user_id, event, data }: { user_id: string; event: string; data: string }) => {
        if (user_id === userId) {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        }
      };

      eventEmitter.on(`message:${userId}`, sendEvent);

      req.signal.addEventListener('abort', () => {
        eventEmitter.off(`message:${userId}`, sendEvent);
        controller.close();
        clearInterval(intervalId);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      // 'Access-Control-Allow-Origin': '*',
    },
  });
}
