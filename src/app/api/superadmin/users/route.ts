import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/database/client';
import { usersTable } from '@/schemas/users';
import { desc, like, or, eq } from 'drizzle-orm';

// GET all users with search & pagination
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check superadmin permission
    if ((session?.user as any)?.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    console.log('[SUPERADMIN] 📋 Fetching users:', { search, page, limit });

    // Build query
    let query = db.select().from(usersTable);

    // Search filter
    if (search) {
      query = query.where(
        or(
          like(usersTable.fullName, `%${search}%`),
          like(usersTable.email, `%${search}%`),
          like(usersTable.nip, `%${search}%`)
        )
      ) as any;
    }

    // Get users with pagination
    const users = await query
      .orderBy(desc(usersTable.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalUsers = await db.select().from(usersTable);
    const total = totalUsers.length;

    console.log('[SUPERADMIN] ✅ Found', users.length, 'users');

    return NextResponse.json({
      users: users.map(user => ({
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
        status: user.status,
        phone: user.phone,
        nip: user.nip,
        nisn: user.nisn,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error('[SUPERADMIN] 💥 Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if ((session?.user as any)?.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, fullName, password, role, tenantId } = body;

    console.log('[SUPERADMIN] 📝 Creating user:', email);

    // Validation
    if (!email || !fullName || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check duplicate
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(usersTable).values({
      email,
      fullName,
      passwordHash,
      role: role as any,
      tenantId: tenantId || 'default_tenant',
      status: 'active',
    });

    console.log('[SUPERADMIN] ✅ User created:', email);

    return NextResponse.json(
      { success: true, message: 'User created successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('[SUPERADMIN] 💥 Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
