import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, rppRecords } from '@/schemas';
import { eq, and } from 'drizzle-orm';

export async function DELETE(req: NextRequest) {
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

    const result = await db
      .delete(rppRecords)
      .where(
        and(
          eq(rppRecords.id, id),
          eq(rppRecords.tenantId, session.user.tenantId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'RPP not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'RPP deleted successfully' });
  } catch (error) {
    console.error('Error deleting RPP:', error);
    return NextResponse.json({ error: 'Failed to delete RPP' }, { status: 500 });
  }
}
