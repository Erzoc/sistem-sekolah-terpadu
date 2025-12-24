import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, rppRecords } from '@/schemas';
import { desc, isNull } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rppList = await db
      .select()
      .from(rppRecords)
      .where(isNull(rppRecords.deletedAt))
      .orderBy(desc(rppRecords.createdAt));

    return NextResponse.json({ 
      success: true, 
      data: rppList 
    });
  } catch (error) {
    console.error('Error fetching RPP list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RPP list' }, 
      { status: 500 }
    );
  }
}
