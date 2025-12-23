import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, rppRecords } from '@/schemas';
import { eq, desc } from 'drizzle-orm';
import { OpenAIClient } from '@/lib/openai-client';
import { nanoid } from 'nanoid';

// HAPUS inisialisasi di sini!
// const aiClient = new OpenAIClient(); <-- JANGAN DI SINI
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rpp = await db
      .select()
      .from(rppRecords)
      .where(eq(rppRecords.tenantId, session.user.id))
      .orderBy(desc(rppRecords.createdAt));

    return NextResponse.json(rpp);
  } catch (error) {
    console.error('GET /api/guru/rpp error:', error);
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
    const { prosemRecordId, protaRecordId, simpleCalendarId, mapelCode, mapelName, kelasLevel, kelasDivision, academicYear, semester, pertemuanList, totalPertemuan, useAI } = body;

    if (!prosemRecordId || !protaRecordId || !simpleCalendarId || !mapelName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let rppData: any = {
      id: nanoid(),
      tenantId: session.user.id,
      prosemRecordId,
      protaRecordId,
      simpleCalendarId,
      mapelCode: mapelCode || '',
      mapelName,
      kelasLevel: kelasLevel || '',
      kelasDivision: kelasDivision || null,
      academicYear,
      semester: parseInt(semester),
      pertemuanListJson: JSON.stringify(pertemuanList || []),
      totalPertemuan: totalPertemuan || 1,
    };

    // AI Enhancement (Optional)
    if (useAI) {
      try {
        // PINDAHKAN INISIALISASI KE SINI
        const aiClient = new OpenAIClient(); 
        const aiResult = await aiClient.enhanceRpp({
          cpCode: '', // Tambahkan default
          cpName: '', // Tambahkan default
          mapelName,
          kelasLevel: kelasLevel || '',
          pertemuanKe: 1, // Default pertemuan ke-1
        });
        rppData = { ...rppData, ...aiResult };
      } catch (aiError) {
        console.warn('AI enhancement failed:', aiError);
      }
    }

    const [rpp] = await db
      .insert(rppRecords)
      .values(rppData)
      .returning();

    return NextResponse.json(rpp, { status: 201 });
  } catch (error) {
    console.error('POST /api/guru/rpp error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
