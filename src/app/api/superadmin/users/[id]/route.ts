import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/database/client';
import { usersTable } from '@/schemas/users';
import { tenantsTable } from '@/schemas/tenants';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

type UserRole = 'super_admin' | 'admin_sekolah' | 'guru' | 'siswa' | 'ortu';
type UserStatus = 'active' | 'inactive' | 'pending';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 GET /api/superadmin/users/[id] - id:', params.id);

    const results = await db
      .select({
        userId: usersTable.userId,
        email: usersTable.email,
        fullName: usersTable.fullName,
        role: usersTable.role,
        status: usersTable.status,
        tenantId: usersTable.tenantId,
        nip: usersTable.nip,
        nisn: usersTable.nisn,
        phone: usersTable.phone,
        lastLogin: usersTable.lastLogin,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
        tenantName: tenantsTable.schoolName,
      })
      .from(usersTable)
      .leftJoin(tenantsTable, eq(usersTable.tenantId, tenantsTable.tenantId))
      .where(eq(usersTable.userId, params.id))
      .limit(1);

    if (results.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ User found');

    return NextResponse.json({ user: results[0] });
  } catch (error) {
    console.error('❌ GET /api/superadmin/users/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, email, role, status, nip, phone, password, tenantId } = body;

    console.log('📝 PUT /api/superadmin/users/[id] - Updating:', params.id);

    if (role) {
      const validRoles: UserRole[] = ['super_admin', 'admin_sekolah', 'guru', 'siswa', 'ortu'];
      if (!validRoles.includes(role as UserRole)) {
        return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
      }
    }

    if (status) {
      const validStatuses: UserStatus[] = ['active', 'inactive', 'pending'];
      if (!validStatuses.includes(status as UserStatus)) {
        return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
      }
    }

    const updateData: any = { updatedAt: new Date() };

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (role) updateData.role = role as UserRole;
    if (status) updateData.status = status as UserStatus;
    if (tenantId) updateData.tenantId = tenantId;
    if (nip !== undefined) updateData.nip = nip || null;
    if (phone !== undefined) updateData.phone = phone || null;

    if (password && password.trim() !== '') {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const [updatedUser] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.userId, params.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ User updated successfully');

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User berhasil diupdate',
    });
  } catch (error) {
    console.error('❌ PUT /api/superadmin/users/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🗑️ DELETE /api/superadmin/users/[id] - id:', params.id);

    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus akun sendiri' },
        { status: 400 }
      );
    }

    const [deletedUser] = await db
      .delete(usersTable)
      .where(eq(usersTable.userId, params.id))
      .returning();

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ User deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    console.error('❌ DELETE /api/superadmin/users/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
