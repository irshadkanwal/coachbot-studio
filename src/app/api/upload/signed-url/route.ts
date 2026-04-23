import { NextRequest } from 'next/server';

import { getSessionUser } from '@/server/actions/sessionActions';
import { getSignedUrlForUpload } from '@/server/db/gcpClient';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUser();

    if (!userId) {
      return Response.json({ success: false, message: 'User not authenticated' }, { status: 401 });
    }

    const { fileName, contentType, bucketName } = await request.json();

    if (!fileName || !contentType) {
      return Response.json(
        {
          success: false,
          message: 'fileName and contentType are required',
        },
        { status: 400 }
      );
    }

    const bucket = bucketName || process.env.GCP_KB_BUCKET_NAME || '';
    const signedUrlData = await getSignedUrlForUpload(fileName, contentType, bucket);

    return Response.json(
      {
        success: true,
        url: signedUrlData.url,
        fields: signedUrlData.fields,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[signedUrlApi] Error generating signed URL:', error);
    return Response.json({ success: false, message: 'Failed to generate signed URL' }, { status: 500 });
  }
}
