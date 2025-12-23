import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const calendars = await prisma.kaldik.findMany({
      where: { guruId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(calendars);
  } catch (error) {
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

    const kaldik = await prisma.kaldik.create({
      data: {
        guruId: session.user.id,
        academicYear,
        semester: parseInt(semester),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        effectiveWeeks,
        holidays: holidays || [],
      },
    });

    return NextResponse.json(kaldik, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
