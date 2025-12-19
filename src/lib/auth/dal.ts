// lib/auth/dal.ts
import 'server-only';
import { cookies } from 'next/headers';
import { decrypt } from './session';
import { cache } from 'react';

import { db } from '@/database/client';
import { usersTable } from '@/schemas/users';

import { eq } from 'drizzle-orm';

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  const session = await decrypt(token);

  if (!session?.userId) {
    return null;
  }

  // ✅ session.userId sudah string dari JWT
  const [user] = await db
    .select({
      userId: usersTable.userId,
      fullName: usersTable.fullName,
      email: usersTable.email,
      role: usersTable.role,
      tenantId: usersTable.tenantId,
    })
    .from(usersTable)
    .where(eq(usersTable.userId, session.userId))  // String ke string
    .limit(1);

  if (!user) {
    return null;
  }

  return {
    isAuth: true,
    user: {
      userId: user.userId,
      name: user.fullName,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    },
  };
});

export async function verifyRole(allowedRoles: string[]) {
  const session = await verifySession();
  
  if (!session) {
    return { authorized: false, session: null };
  }

  if (!allowedRoles.includes(session.user.role)) {
    return { authorized: false, session };
  }

  return { authorized: true, session };
}
