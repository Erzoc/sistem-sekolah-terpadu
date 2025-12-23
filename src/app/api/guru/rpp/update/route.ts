import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, rppRecords } from '@/schemas';
import { eq, and, sql } from 'drizzle-orm';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'RPP ID is required' }, { status: 400 });
    }

    const result = await db
      .update(rppRecords)
      .set({
        ...updateData,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
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

    return NextResponse.json({ 
      success: true, 
      data: result[0],
      message: 'RPP updated successfully' 
    });
  } catch (error) {
    console.error('Error updating RPP:', error);
    return NextResponse.json({ error: 'Failed to update RPP' }, { status: 500 });
  }
}
