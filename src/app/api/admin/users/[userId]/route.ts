import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/database/client';
import { usersTable } from '@/schemas/users';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

type UserRole = 'super_admin' | 'admin_sekolah' | 'guru' | 'siswa' | 'ortu';
type UserStatus = 'active' | 'inactive' | 'pending';

// GET - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userTenantId = (session.user as any)?.tenantId;
    const { userId } = params;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.userId, userId),
          eq(usersTable.tenantId, userTenantId)
        )
      )
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('❌ Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const { userId } = params;
    const body = await request.json();
    const { email, fullName, role, phone, nip, nisn, status, password } = body;

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.userId, userId),
          eq(usersTable.tenantId, userTenantId)
        )
      )
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Validate role if provided
    if (role) {
      const validRoles: UserRole[] = ['super_admin', 'admin_sekolah', 'guru', 'siswa', 'ortu'];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses: UserStatus[] = ['active', 'inactive', 'pending'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = {
      email: email || existingUser.email,
      fullName: fullName || existingUser.fullName,
      role: (role as UserRole) || existingUser.role,
      phone: phone !== undefined ? phone : existingUser.phone,
      nip: nip !== undefined ? nip : existingUser.nip,
      nisn: nisn !== undefined ? nisn : existingUser.nisn,
      status: (status as UserStatus) || existingUser.status,
      updatedAt: new Date(),
    };

    // Update password if provided
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    // Update user
    const [updatedUser] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.userId, userId))
      .returning();

    console.log('✅ User updated:', updatedUser.email);

    return NextResponse.json({
      success: true,
      message: 'User berhasil diupdate',
      user: {
        userId: updatedUser.userId,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    console.error('❌ Update user error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    const userTenantId = (session.user as any)?.tenantId;
    const currentUserId = (session.user as any)?.id;

    const allowedRoles = ['admin_sekolah', 'super_admin', 'superadmin'];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;

    // Prevent self-deletion
    if (userId === currentUserId) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus akun sendiri' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.userId, userId),
          eq(usersTable.tenantId, userTenantId)
        )
      )
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Delete user
    await db
      .delete(usersTable)
      .where(eq(usersTable.userId, userId));

    console.log('✅ User deleted:', existingUser.email);

    return NextResponse.json({
      success: true,
      message: 'User berhasil dihapus',
    });
  } catch (error: any) {
    console.error('❌ Delete user error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
