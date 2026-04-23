'use server';

import 'server-only';

import { revalidatePath, revalidateTag } from 'next/cache';
import { isDynamicServerError } from 'next/dist/client/components/hooks-server-context';
import { cookies } from 'next/headers';

import { SESSION_COOKIE_NAME } from '@/lib/constants';
import { SessionPayload } from '@/lib/models/auth.models';
import { deleteCookie, getCookie } from '@/lib/utils/cookie.utils';
import { encrypt } from '@/lib/utils/encryption.utils';

const secretKey = process.env.SESSION_JWT_KEY;

export async function createSession(userId: string, accessAllowed: boolean, assistantId: string) {
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = (await encrypt({ userId, expiresAt, accessAllowed, assistantId }, secretKey)) || '';
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });
  } catch (error) {
    console.error('[sessionActions] Error creating session:', error);

    throw new Error('[session] Session creation error');
  }
}

export async function verifySession(): Promise<SessionPayload | null> {
  try {
    const session = await getCookie<SessionPayload>(SESSION_COOKIE_NAME, true, secretKey);

    return session;
  } catch (error) {
    if (isDynamicServerError(error)) {
      return null;
    }
    console.error('[sessionActions] Error verifying session:', error);

    return null;
  }
}

export async function getSessionUser(): Promise<string | undefined> {
  try {
    const session = await verifySession();

    return session?.userId;
  } catch (error) {
    console.error('[sessionActions] Error getting session user:', error);

    return;
  }
}

export async function updateSession(
  newData?: Partial<SessionPayload>,
  tags?: string[],
  paths?: string[]
): Promise<void> {
  try {
    const payload = await verifySession();

    if (!payload) return;

    const cookieStore = await cookies();
    const session = (await encrypt({ ...payload, ...newData }, secretKey)) || '';

    cookieStore.set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    tags && tags.forEach(revalidateTag);
    paths && paths.forEach((path) => revalidatePath(path));
  } catch (error) {
    console.error('[sessionActions] Error updating session:', error);
  }
}

export async function deleteSession() {
  await deleteCookie(SESSION_COOKIE_NAME);
}
