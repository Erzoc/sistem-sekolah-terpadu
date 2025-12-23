import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, prosemRecords } from '@/schemas';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prosem = await db
      .select()
      .from(prosemRecords)
      .where(eq(prosemRecords.tenantId, session.user.id))
      .orderBy(desc(prosemRecords.createdAt));

    return NextResponse.json(prosem);
  } catch (error) {
    console.error('GET /api/guru/prosem error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { protaRecordId, simpleCalendarId, mapelCode, mapelName, academicYear, semester, weeklySchedule, totalWeeks, effectiveWeeks } = body;

    if (!protaRecordId || !simpleCalendarId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [prosem] = await db
      .insert(prosemRecords)
      .values({
        id: nanoid(),
        tenantId: session.user.id,
        protaRecordId,
        simpleCalendarId,
        mapelCode,
        mapelName,
        academicYear,
        semester: parseInt(semester),
        weeklyScheduleJson: JSON.stringify(weeklySchedule || []),
        totalWeeks: totalWeeks || 0,
        effectiveWeeks: effectiveWeeks || 0,
      })
      .returning();

    return NextResponse.json(prosem, { status: 201 });
  } catch (error) {
    console.error('POST /api/guru/prosem error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
