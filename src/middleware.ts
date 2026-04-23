import { NextRequest, NextResponse } from 'next/server';

import { verifySession } from '@/server/actions/sessionActions';
import { SIGNUP_MODE_COOKIE_NAME } from './lib/constants';
import { getRedirectPath } from './lib/utils/common.utils';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const { userId, accessAllowed } = (await verifySession()) || {};
  const url = new URL(req.url);
  const mode = url.searchParams.get(SIGNUP_MODE_COOKIE_NAME);

  const redirectTo = getRedirectPath(path, userId, accessAllowed, req.nextUrl.search);
  const response = redirectTo ? NextResponse.redirect(new URL(redirectTo, req.nextUrl)) : NextResponse.next();

  if (mode) {
    response.cookies.set(SIGNUP_MODE_COOKIE_NAME, mode, { path: '/', maxAge: 600 });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|videos|checkout|$).*)'],
};
