import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/database/client';
import { usersTable } from '@/schemas/users';
import { eq, desc, like, or, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

type UserRole = 'super_admin' | 'admin_sekolah' | 'guru' | 'siswa' | 'ortu';
type UserStatus = 'active' | 'inactive' | 'pending';

// GET - List all users
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

    // Get query params
const { searchParams } = new URL(request.url);
const search = searchParams.get('search');
const roleFilterRaw = searchParams.get('role');
const statusFilterRaw = searchParams.get('status');

// Build where conditions
const conditions = [eq(usersTable.tenantId, userTenantId)];

if (search) {
  conditions.push(
    or(
      like(usersTable.fullName, `%${search}%`),
      like(usersTable.email, `%${search}%`)
    )!
  );
}

// Add role filter if valid
if (roleFilterRaw && roleFilterRaw !== 'all') {
  const validRoles: UserRole[] = ['super_admin', 'admin_sekolah', 'guru', 'siswa', 'ortu'];
  if (validRoles.includes(roleFilterRaw as UserRole)) {
    conditions.push(eq(usersTable.role, roleFilterRaw as UserRole));
  }
}

// Add status filter if valid
if (statusFilterRaw && statusFilterRaw !== 'all') {
  const validStatuses: UserStatus[] = ['active', 'inactive', 'pending'];
  if (validStatuses.includes(statusFilterRaw as UserStatus)) {
    conditions.push(eq(usersTable.status, statusFilterRaw as UserStatus));
  }
}


    // Execute query
    const users = await db
      .select({
        userId: usersTable.userId,
        email: usersTable.email,
        fullName: usersTable.fullName,
        role: usersTable.role,
        status: usersTable.status,
        phone: usersTable.phone,
        nip: usersTable.nip,
        nisn: usersTable.nisn,
        lastLogin: usersTable.lastLogin,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(and(...conditions))
      .orderBy(desc(usersTable.createdAt));

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error: any) {
    console.error('❌ List users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const userTenantId = (session.user as any)?.tenantId;

    const allowedRoles = ['admin_sekolah', 'super_admin', 'superadmin'];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!userTenantId) {
      return NextResponse.json({ error: 'User tidak terkait dengan sekolah' }, { status: 400 });
    }

    const body = await request.json();
    const { email, fullName, role, password, phone, nip, nisn } = body;

    // Validation
    if (!email || !fullName || !role || !password) {
      return NextResponse.json(
        { error: 'Email, nama lengkap, role, dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ['super_admin', 'admin_sekolah', 'guru', 'siswa', 'ortu'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Role tidak valid' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(usersTable)
      .values({
        email,
        fullName,
        role: role as UserRole,
        passwordHash,
        tenantId: userTenantId,
        phone: phone || null,
        nip: nip || null,
        nisn: nisn || null,
        status: 'active',
        inviteToken: null,
        inviteExpiresAt: null,
        lastLogin: null,
      })
      .returning();

    console.log('✅ User created:', newUser.email);

    return NextResponse.json({
      success: true,
      message: 'User berhasil ditambahkan',
      user: {
        userId: newUser.userId,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('❌ Create user error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
