import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, simpleCalendars } from '@/schemas';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const calendars = await db
      .select()
      .from(simpleCalendars)
      .where(eq(simpleCalendars.tenantId, session.user.id))
      .orderBy(desc(simpleCalendars.createdAt));

    return NextResponse.json(calendars);
  } catch (error) {
    console.error('GET /api/guru/kaldik error:', error);
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
    const { academicYear, semester, startDate, endDate, effectiveWeeks, holidays } = body;

    if (!academicYear || !semester || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [kaldik] = await db
      .insert(simpleCalendars)
      .values({
        id: nanoid(),
        tenantId: session.user.id,
        academicYear,
        semester: parseInt(semester),
        startDate,
        endDate,
        effectiveWeeks: effectiveWeeks || 0,
        holidaysJson: JSON.stringify(holidays || []),
      })
      .returning();

    return NextResponse.json(kaldik, { status: 201 });
  } catch (error) {
    console.error('POST /api/guru/kaldik error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
