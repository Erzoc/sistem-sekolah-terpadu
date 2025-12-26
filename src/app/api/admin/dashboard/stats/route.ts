import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { usersTable, tenantsTable } from '@/lib/db/schema';
import { eq, and, gte, sql, count, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const userTenantId = (session.user as any)?.tenantId;

    // Only super_admin and admin_sekolah
    if (!['super_admin', 'superadmin', 'admin_sekolah'].includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Date calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Base condition (tenant filter)
    const baseCondition = userTenantId ? eq(usersTable.tenantId, userTenantId) : undefined;

    // 1. Total Users
    const totalUsersResult = await db
      .select({ count: count() })
      .from(usersTable)
      .where(baseCondition);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // 2. Active Users (last 30 days)
    const activeUsersResult = await db
      .select({ count: count() })
      .from(usersTable)
      .where(
        and(
          baseCondition,
          gte(usersTable.lastLogin, thirtyDaysAgo)
        )
      );
    const activeUsers = activeUsersResult[0]?.count || 0;

    // 3. Users by Role
    const usersByRole = await db
      .select({
        role: usersTable.role,
        count: count(),
      })
      .from(usersTable)
      .where(baseCondition)
      .groupBy(usersTable.role);

    // 4. Users by Status
    const usersByStatus = await db
      .select({
        status: usersTable.status,
        count: count(),
      })
      .from(usersTable)
      .where(baseCondition)
      .groupBy(usersTable.status);

    // 5. New Users (last 7 days)
    const newUsersResult = await db
      .select({ count: count() })
      .from(usersTable)
      .where(
        and(
          baseCondition,
          gte(usersTable.createdAt, sevenDaysAgo)
        )
      );
    const newUsers = newUsersResult[0]?.count || 0;

    // 6. Recent Users (last 10)
    const recentUsers = await db
      .select({
        userId: usersTable.userId,
        fullName: usersTable.fullName,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(baseCondition)
      .orderBy(desc(usersTable.createdAt))
      .limit(10);

    // 7. Total Schools (only for super_admin)
    let totalSchools = 0;
    if (['super_admin', 'superadmin'].includes(userRole)) {
      const schoolsResult = await db
        .select({ count: count() })
        .from(tenantsTable);
      totalSchools = schoolsResult[0]?.count || 0;
    }

    // 8. User Registration Trend (last 7 days)
    const registrationTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      
      const usersOnDate = await db
        .select({ count: count() })
        .from(usersTable)
        .where(
          and(
            baseCondition,
            gte(usersTable.createdAt, date),
            sql`${usersTable.createdAt} < ${nextDate}`
          )
        );

      registrationTrend.push({
        date: date.toISOString().split('T')[0],
        count: usersOnDate[0]?.count || 0,
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        newUsers,
        totalSchools,
        usersByRole,
        usersByStatus,
        registrationTrend,
        recentUsers,
      },
    });
  } catch (error: any) {
    console.error('❌ Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
