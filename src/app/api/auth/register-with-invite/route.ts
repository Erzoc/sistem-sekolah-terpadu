import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/client';
import { usersTable } from '@/schemas/users';
import { invitesTable } from '@/schemas/invites';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

type UserRole = 'super_admin' | 'admin_sekolah' | 'guru' | 'siswa' | 'ortu';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteCode, email, fullName, password } = body;

    // Validasi input
    if (!inviteCode || !email || !fullName || !password) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    // Check invite code
    const [invite] = await db
      .select()
      .from(invitesTable)
      .where(
        and(
          eq(invitesTable.inviteCode, inviteCode),
          eq(invitesTable.isActive, true)
        )
      )
      .limit(1);

    if (!invite) {
      return NextResponse.json(
        { error: 'Kode undangan tidak valid' },
        { status: 400 }
      );
    }

    // Check expired
    if (invite.expiresAt && new Date() > new Date(invite.expiresAt)) {
      return NextResponse.json(
        { error: 'Kode undangan sudah kadaluarsa' },
        { status: 400 }
      );
    }

    // Check max uses - WITH NULL CHECK
    const usedCount = invite.usedCount ?? 0;
    const maxUses = invite.maxUses ?? 1;
    
    if (usedCount >= maxUses) {
      return NextResponse.json(
        { error: 'Kode undangan sudah mencapai batas penggunaan' },
        { status: 400 }
      );
    }

    // Check email sudah terdaftar
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

    // Create user dengan tenantId dari invite
    const [newUser] = await db
      .insert(usersTable)
      .values({
        email,
        fullName,
        passwordHash,
        role: invite.role as UserRole,
        tenantId: invite.tenantId,
        status: 'active',
        phone: null,
        nip: null,
        nisn: null,
        inviteToken: null,
        inviteExpiresAt: null,
        lastLogin: null,
      })
      .returning();

    // Update invite usage count - WITH NULL CHECK
    await db
      .update(invitesTable)
      .set({
        usedCount: usedCount + 1,
      })
      .where(eq(invitesTable.inviteId, invite.inviteId));

    console.log('✅ User registered via invite:', newUser.email);

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      user: {
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('❌ Register with invite error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem' },
      { status: 500 }
    );
  }
}
