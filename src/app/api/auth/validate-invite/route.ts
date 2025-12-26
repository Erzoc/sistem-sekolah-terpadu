import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/client';
import { invitesTable } from '@/schemas/invites';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteCode } = body;

    if (!inviteCode) {
      return NextResponse.json({
        valid: false,
        message: 'Kode undangan wajib diisi',
      });
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
      return NextResponse.json({
        valid: false,
        message: 'Kode undangan tidak ditemukan atau tidak aktif',
      });
    }

    // Check expired
    if (invite.expiresAt && new Date() > new Date(invite.expiresAt)) {
      return NextResponse.json({
        valid: false,
        message: 'Kode undangan sudah kadaluarsa',
      });
    }

    // Check max uses
    const usedCount = invite.usedCount ?? 0;
    const maxUses = invite.maxUses ?? 1;
    
    if (usedCount >= maxUses) {
      return NextResponse.json({
        valid: false,
        message: 'Kode undangan sudah mencapai batas penggunaan',
      });
    }

    return NextResponse.json({
      valid: true,
      message: 'Kode undangan valid',
      role: invite.role,
    });
  } catch (error: any) {
    console.error('❌ Validate invite error:', error);
    return NextResponse.json({
      valid: false,
      message: 'Terjadi kesalahan sistem',
    });
  }
}
