import { JWTPayload, jwtVerify, SignJWT } from 'jose';

import 'server-only';

export async function encrypt<T extends JWTPayload>(
  payload: T,
  secretKey?: string,
  expirationTime: string = '7d'
): Promise<string | null> {
  if (!payload || !secretKey) return null;

  const encodedKey = new TextEncoder().encode(secretKey);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(encodedKey);
}

export async function decrypt<T>(encryptedData: string | undefined = '', secretKey?: string): Promise<T | null> {
  try {
    if (!encryptedData || !secretKey) return null;

    const encodedKey = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(encryptedData, encodedKey, { algorithms: ['HS256'] });

    return payload as T;
  } catch (error: any) {
    console.error('[encryptionUtils] Failed to decrypt data:', error);
    return null;
  }
}
