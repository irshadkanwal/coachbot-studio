import { NextRequest } from 'next/server';

import prisma from '@/lib/prisma';
import { getSessionUser } from '@/server/actions/sessionActions';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const userId = await getSessionUser();

    if (!userId) {
      return Response.json({ success: false, message: 'User not authenticated' }, { status: 401 });
    }

    // Get all user emails from the database
    const users = await prisma.user.findMany({
      select: {
        email: true,
      },
      where: {
        email: {
          not: null,
        },
      },
      orderBy: {
        email: 'asc',
      },
    });

    const emails = users.map((user) => user.email).filter(Boolean);

    return Response.json(emails, { status: 200 });
  } catch (error) {
    console.error('[usersEmailsApi] Error fetching user emails:', error);
    return Response.json({ success: false, message: 'Failed to fetch emails' }, { status: 500 });
  }
}
