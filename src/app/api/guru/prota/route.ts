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

    const prota = await prisma.prota.findMany({
      where: { guruId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(prota);
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
    const { kaldikId, subjectId, className, cpList, totalWeeks } = body;

    if (!kaldikId || !subjectId || !className) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prota = await prisma.prota.create({
      data: {
        guruId: session.user.id,
        kaldikId,
        subjectId,
        className,
        cpList: cpList || [],
        totalWeeks: totalWeeks || 36,
      },
    });

    return NextResponse.json(prota, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
