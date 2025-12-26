import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/database/client';
import { tenantsTable } from '@/schemas/tenants';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log('🔐 GET /api/superadmin/tenants - Session:', {
      hasSession: !!session,
      role: session?.user?.role,
    });

    if (!session?.user || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenants = await db
      .select()
      .from(tenantsTable)
      .orderBy(desc(tenantsTable.createdAt));

    console.log(`✅ Found ${tenants.length} tenants`);

    return NextResponse.json({ tenants });
  } catch (error) {
    console.error('❌ GET /api/superadmin/tenants error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
