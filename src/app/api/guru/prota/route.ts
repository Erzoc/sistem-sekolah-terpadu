import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, protaRecords } from '@/schemas';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prota = await db
      .select()
      .from(protaRecords)
      .where(eq(protaRecords.tenantId, session.user.id))
      .orderBy(desc(protaRecords.createdAt));

    return NextResponse.json(prota);
  } catch (error) {
    console.error('GET /api/guru/prota error:', error);
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
    const { simpleCalendarId, mapelCode, mapelName, academicYear, semester, competencies } = body;

    if (!simpleCalendarId || !mapelCode || !mapelName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [prota] = await db
      .insert(protaRecords)
      .values({
        id: nanoid(),
        tenantId: session.user.id,
        simpleCalendarId,
        mapelCode,
        mapelName,
        academicYear,
        semester: parseInt(semester),
        competenciesJson: JSON.stringify(competencies || []),
      })
      .returning();

    return NextResponse.json(prota, { status: 201 });
  } catch (error) {
    console.error('POST /api/guru/prota error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
