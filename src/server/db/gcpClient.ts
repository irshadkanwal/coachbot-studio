'use server';

import { SignedPostPolicyV4Output, Storage } from '@google-cloud/storage';

/**
 * Processes a private key from environment variable, handling various encoding scenarios.
 * Handles escaped newlines, quoted strings, and multiple escaping levels.
 */
function processPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;

  let processed = key.trim();

  // Remove surrounding quotes if present (single or double) - check for matching quotes
  if (
    (processed.startsWith('"') && processed.endsWith('"')) ||
    (processed.startsWith("'") && processed.endsWith("'"))
  ) {
    processed = processed.slice(1, -1);
  }

  // Handle escaped newlines - replace \n (literal backslash+n) with actual newlines
  // This handles escaped newlines that appear as the literal string "\n" in env vars
  processed = processed.replace(/\\n/g, '\n');

  return processed;
}

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: processPrivateKey(process.env.GCP_PRIVATE_KEY),
  },
});

const getGcpBucket = (bucketName: string) => storage.bucket(bucketName);

const checkFileExists = async (bucketName: string, filename: string): Promise<boolean> => {
  const bucket = getGcpBucket(bucketName || '');
  const file = bucket.file(filename);

  const [exists] = await file.exists();

  if (!exists) {
    console.warn(`[getGcpStorageSignedUrl] File not found: ${filename}`);
    return false;
  }
  return true;
};

export async function getGcpStorageSignedUrl(
  filename: string,
  bucketName: string,
  displayName?: string,
  expiresMins = 5
): Promise<string> {
  const isExists = await checkFileExists(bucketName, filename);
  if (!isExists) return '';

  const options = {
    version: 'v4' as const,
    action: 'read' as const,
    expires: Date.now() + expiresMins * 60 * 1000,
    responseDisposition: 'attachment; filename="' + displayName || filename + '"',
  };
  const bucket = getGcpBucket(bucketName || '');
  const [url] = await bucket.file(filename).getSignedUrl(options);

  return url;
}

export async function getSignedUrlForUpload(
  fileName: string,
  contentType: string,
  bucketName: string
): Promise<SignedPostPolicyV4Output> {
  const bucket = getGcpBucket(bucketName || '');
  const buckteFile = bucket.file(fileName);
  const options = {
    expires: Date.now() + 10 * 60 * 1000, //  10 minute,
    fields: {
      'Content-Type': contentType,
      'x-goog-meta-source': 'cbs-project',
    },
  };

  const [response] = await buckteFile.generateSignedPostPolicyV4(options);
  return response;
}

export const deleteGcpStorageFile = async (bucketName: string, filename: string): Promise<void> => {
  const bucket = getGcpBucket(bucketName || '');
  await bucket.file(filename).delete();
};
