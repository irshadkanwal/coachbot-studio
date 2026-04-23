import { NextRequest } from 'next/server';

import { TwilioCredentialsResponse } from '@/lib/models/twilio.models';
import { validateBearerToken, validateUUID } from '@/lib/utils/api-auth.utils';
import { getTwilioCredentialsByAssistantId } from '@/server/db/twilioCredentialsClient';

export async function GET(request: NextRequest, { params }: { params: Promise<{ assistant_id: string }> }) {
  try {
    const { assistant_id } = await params;

    // Authenticate webhook service request using shared API key
    // WEBHOOK_SERVICE_API_KEY is used for internal service-to-service authentication
    // between our webhook service (handling WhatsApp/SMS) and this API
    const authResult = validateBearerToken(request, process.env.WEBHOOK_SERVICE_API_KEY);

    if (!authResult.isValid) {
      return Response.json(
        {
          error: authResult.error,
          assistant_id,
        },
        { status: 401 }
      );
    }

    const assistantId = assistant_id;

    // Validate assistant_id format
    if (!validateUUID(assistantId)) {
      return Response.json(
        {
          error: 'Invalid assistant ID format',
          assistant_id: assistantId,
        },
        { status: 400 }
      );
    }

    const credentials = await getTwilioCredentialsByAssistantId(assistantId);

    if (!credentials) {
      return Response.json(
        {
          error: 'No Twilio credentials found for assistant',
          assistant_id: assistantId,
        },
        { status: 404 }
      );
    }

    const response: TwilioCredentialsResponse = {
      account_sid: credentials.accountSid,
      auth_token: credentials.authToken,
      sms_number: credentials.smsNumber,
      whatsapp_number: credentials.whatsappNumber,
      is_active: credentials.isActive,
      created_at: credentials.created_at.toString(),
      updated_at: credentials.updated_at.toString(),
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error('[twilioCredentialsApi] Error handling GET request:', error);

    return Response.json(
      {
        error: 'Internal server error',
        message: 'Database connection failed',
      },
      { status: 500 }
    );
  }
}
