import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/database/client';
import { usersTable } from '@/schemas/users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// GET single user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if ((session?.user as any)?.role !== 'superadmin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.userId, params.id))
      .limit(1);

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    
    return NextResponse.json({
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
    });

  } catch (error) {
    console.error('[SUPERADMIN] Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT update user
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if ((session?.user as any)?.role !== 'superadmin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { email, fullName, role, status, phone, nip, password } = body;

    console.log('[SUPERADMIN] 📝 Updating user:', params.id);

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (email) updateData.email = email;
    if (fullName) updateData.fullName = fullName;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (phone !== undefined) updateData.phone = phone;
    if (nip !== undefined) updateData.nip = nip;
    
    // Update password if provided
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.userId, params.id));

    console.log('[SUPERADMIN] ✅ User updated:', params.id);

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('[SUPERADMIN] Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if ((session?.user as any)?.role !== 'superadmin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('[SUPERADMIN] 🗑️  Deleting user:', params.id);

    // Prevent deleting self
    if (session && (session.user as any).id === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await db.delete(usersTable).where(eq(usersTable.userId, params.id));

    console.log('[SUPERADMIN] ✅ User deleted:', params.id);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('[SUPERADMIN] Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
