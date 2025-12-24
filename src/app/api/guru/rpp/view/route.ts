import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, rppRecords } from '@/schemas';
import { eq, and } from 'drizzle-orm';
// ✅ FORCE DYNAMIC untuk menghindari static generation
export const dynamic = 'force-dynamic';

// ✅ TAMBAH: Suppress revalidate (optional)
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'RPP ID is required' }, { status: 400 });
    }

    const [rppData] = await db
      .select()
      .from(rppRecords)
      .where(
        and(
          eq(rppRecords.id, id),
          eq(rppRecords.tenantId, session.user.tenantId)
        )
      );

    if (!rppData) {
      return NextResponse.json({ error: 'RPP not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rppData });
  } catch (error) {
    console.error('Error fetching RPP:', error);
    return NextResponse.json({ error: 'Failed to fetch RPP' }, { status: 500 });
  }
}
