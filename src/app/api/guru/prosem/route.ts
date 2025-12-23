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

    const prosem = await prisma.prosem.findMany({
      where: { guruId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(prosem);
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
    const { protaId, weeklyBreakdown } = body;

    if (!protaId) {
      return NextResponse.json(
        { error: 'Missing protaId' },
        { status: 400 }
      );
    }

    const prosem = await prisma.prosem.create({
      data: {
        guruId: session.user.id,
        protaId,
        weeklyBreakdown: weeklyBreakdown || [],
      },
    });

    return NextResponse.json(prosem, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
