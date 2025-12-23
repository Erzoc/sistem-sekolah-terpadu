import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OpenAIClient } from '@/lib/openai-client';

const aiClient = new OpenAIClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rpp = await prisma.rpp.findMany({
      where: { guruId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(rpp);
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
    const { prosemId, cpCode, cpName, mapelName, kelasLevel, pertemuanKe, useAI } = body;

    if (!prosemId || !cpCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let rppData: any = {
      guruId: session.user.id,
      prosemId,
      cpCode,
      cpName,
      mapelName,
      kelasLevel,
      pertemuanKe: pertemuanKe || 1,
    };

    // AI Enhancement (Optional)
    if (useAI) {
      try {
        const aiResult = await aiClient.enhanceRpp({
          cpCode,
          cpName,
          mapelName,
          kelasLevel,
          pertemuanKe: pertemuanKe || 1,
        });
        rppData = { ...rppData, ...aiResult };
      } catch (aiError) {
        console.warn('AI enhancement failed, using template:', aiError);
        // Continue with template
      }
    }

    const rpp = await prisma.rpp.create({
      data: rppData,
    });

    return NextResponse.json(rpp, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
