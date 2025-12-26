import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/database/client';
import { invitesTable } from '@/schemas/invites';
import crypto from 'crypto';

type UserRole = 'super_admin' | 'admin_sekolah' | 'guru' | 'siswa' | 'ortu';
type InviteRole = 'guru' | 'siswa' | 'ortu' | 'admin_sekolah';

export async function POST(request: NextRequest) {
  console.log('🔵 POST /api/admin/invites/generate - START');
  
  try {
    const session = await getServerSession(authOptions);

    console.log('🔐 Session:', session?.user);

    if (!session?.user) {
      console.log('❌ No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Type assertion
    const userRole = (session.user as any)?.role as UserRole;
    const userTenantId = (session.user as any)?.tenantId as string | undefined;
    const userId = (session.user as any)?.id as string;

    console.log('👤 User:', { role: userRole, tenantId: userTenantId });

    // Check role
    const allowedRoles = ['admin_sekolah', 'super_admin', 'superadmin']; // ← FIX INI
    if (!allowedRoles.includes(userRole)) {
      console.log('❌ Unauthorized role:', userRole);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!userTenantId) {
      console.log('❌ No tenantId');
      return NextResponse.json({ error: 'User tidak terkait dengan sekolah' }, { status: 400 });
    }

    const body = await request.json();
    console.log('📦 Request body:', body);

    const { role, maxUses = 1, expiresInDays } = body;

    // Validasi role
    const validRoles: InviteRole[] = ['guru', 'siswa', 'ortu', 'admin_sekolah'];
    if (!role || !validRoles.includes(role)) {
      console.log('❌ Invalid role:', role);
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }

    // Generate unique invite code
    const inviteCode = generateInviteCode(userTenantId);
    console.log('🎟️ Generated code:', inviteCode);

    // Calculate expiry
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const [invite] = await db
      .insert(invitesTable)
      .values({
        tenantId: userTenantId,
        inviteCode,
        role: role as InviteRole,
        maxUses: maxUses,
        usedCount: 0,
        isActive: true,
        expiresAt,
        createdBy: userId,
      })
      .returning();

    console.log('✅ Invite created:', invite);

    return NextResponse.json({
      success: true,
      invite: {
        code: invite.inviteCode,
        role: invite.role,
        expiresAt: invite.expiresAt,
        maxUses: invite.maxUses,
      },
    });
  } catch (error: any) {
    console.error('❌ Generate invite error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

function generateInviteCode(tenantId: string): string {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  const shortTenantId = tenantId.substring(0, 6).toUpperCase();
  return `${shortTenantId}-${year}-${random}`;
}
