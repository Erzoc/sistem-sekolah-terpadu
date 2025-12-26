import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/schemas';
import { schoolProfilesTable } from '@/schemas/school_profiles';
import { eq } from 'drizzle-orm';

// GET: Fetch school profile berdasarkan tenantId dari session
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('🔍 GET /api/superadmin/school-profile - Session:', {
      hasSession: !!session,
      user: session?.user,
      role: session?.user?.role,
      tenantId: session?.user?.tenantId
    });

    if (!session?.user) {
      console.log('❌ No session found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    // ✅ Ambil tenantId dari session (bukan dari query)
    const tenantId = session.user.tenantId;

    if (!tenantId) {
      console.log('❌ No tenantId in session');
      return NextResponse.json({ error: 'No tenant assigned' }, { status: 400 });
    }

    // Ambil profil sekolah berdasarkan tenantId
    const [profile] = await db
      .select()
      .from(schoolProfilesTable)
      .where(eq(schoolProfilesTable.tenantId, tenantId))
      .limit(1);

    console.log('✅ Profile found:', !!profile);

    return NextResponse.json({ 
      profile: profile || null
    });
  } catch (error) {
    console.error('❌ GET /api/superadmin/school-profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create atau Update school profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('🔍 POST /api/superadmin/school-profile - Session:', {
      hasSession: !!session,
      user: session?.user,
      role: session?.user?.role,
      tenantId: session?.user?.tenantId
    });

    if (!session?.user) {
      console.log('❌ No session found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    // ✅ Gunakan tenantId dari session (AUTO dari login user)
    const tenantId = session.user.tenantId;

    if (!tenantId) {
      console.log('❌ No tenantId in session');
      return NextResponse.json({ error: 'No tenant assigned' }, { status: 400 });
    }

    const body = await request.json();
    console.log('📝 Body received:', body);

    if (!body.schoolName) {
      return NextResponse.json(
        { error: 'schoolName harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah profile untuk tenant ini sudah ada
    const existing = await db
      .select()
      .from(schoolProfilesTable)
      .where(eq(schoolProfilesTable.tenantId, tenantId))
      .limit(1);

    let result;

    if (existing.length > 0) {
      // UPDATE existing profile
      console.log('🔄 Updating existing profile:', existing[0].profileId);
      const updated = await db
        .update(schoolProfilesTable)
        .set({
          ...body,
          tenantId, // ← Pastikan tenantId dari session
          updatedAt: new Date(),
        })
        .where(eq(schoolProfilesTable.profileId, existing[0].profileId))
        .returning();

      result = updated[0];
    } else {
      // INSERT new profile
      console.log('➕ Creating new profile for tenant:', tenantId);
      const inserted = await db
        .insert(schoolProfilesTable)
        .values({
          ...body,
          tenantId, // ← Gunakan tenantId dari session
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      result = inserted[0];
    }

    console.log('✅ Profile saved successfully');

    return NextResponse.json({
      success: true,
      profile: result,
      message: existing.length > 0
        ? 'Profil sekolah berhasil diperbarui'
        : 'Profil sekolah berhasil dibuat',
    });
  } catch (error) {
    console.error('❌ POST /api/superadmin/school-profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
