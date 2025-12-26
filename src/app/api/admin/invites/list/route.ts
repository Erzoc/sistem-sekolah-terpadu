import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/database/client';
import { invitesTable } from '@/schemas/invites';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const userTenantId = (session.user as any)?.tenantId;

    // Check role
    const allowedRoles = ['admin_sekolah', 'super_admin', 'superadmin'];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!userTenantId) {
      return NextResponse.json({ error: 'User tidak terkait dengan sekolah' }, { status: 400 });
    }

    // Get all invites for this tenant
    const invites = await db
      .select()
      .from(invitesTable)
      .where(eq(invitesTable.tenantId, userTenantId))
      .orderBy(desc(invitesTable.createdAt));

    return NextResponse.json({
      success: true,
      invites,
    });
  } catch (error: any) {
    console.error('❌ List invites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
