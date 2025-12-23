import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/client';
import { prosemRecords, rppRecords } from '@/schemas';
import { eq } from 'drizzle-orm';
import { RppGenerator } from '@/lib/generators/rpp-generator';
import { OpenAIClient } from '@/lib/ai/openai-client';

function generateId(prefix: string = 'rpp'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prosemId, kelasLevel, kelasDivision, templateType, generationMethod } = body;

    if (!prosemId || !kelasLevel) {
      return NextResponse.json(
        { success: false, error: 'Prosem ID dan kelas level wajib diisi' },
        { status: 400 }
      );
    }

    // Load Prosem
    const prosem = await db
      .select()
      .from(prosemRecords)
      .where(eq(prosemRecords.id, prosemId))
      .limit(1);

    if (!prosem || prosem.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prosem tidak ditemukan' },
        { status: 404 }
      );
    }

    const prosemData = prosem[0];
    const weeklySchedule = JSON.parse(prosemData.weeklyScheduleJson);

    const generator = new RppGenerator({
      prosemId,
      mapelCode: prosemData.mapelCode,
      mapelName: prosemData.mapelName,
      kelasLevel,
      kelasDivision,
      weeklySchedule,
      templateType: templateType || 'merdeka',
      generationMethod: generationMethod || 'template',
    });

    let result;

    // Choose generation method
    if (generationMethod === 'ai') {
      console.log('[RPP Generate] Using AI enhancement...');
      const aiClient = new OpenAIClient();
      result = await generator.generateWithAI(aiClient);
    } else {
      console.log('[RPP Generate] Using template method...');
      result = generator.generate();
    }

    // Save to database
    const rppId = generateId('rpp');

    await db.insert(rppRecords).values({
      id: rppId,
      tenantId: prosemData.tenantId,
      prosemRecordId: prosemId,
      protaRecordId: prosemData.protaRecordId,
      simpleCalendarId: prosemData.simpleCalendarId,
      mapelCode: prosemData.mapelCode,
      mapelName: prosemData.mapelName,
      kelasLevel,
      kelasDivision,
      academicYear: prosemData.academicYear,
      semester: prosemData.semester,
      pertemuanListJson: JSON.stringify(result.pertemuanList),
      templateType: templateType || 'merdeka',
      generationMethod: generationMethod || 'template',
      aiProvider: generationMethod === 'ai' ? 'openai' : null,
      totalPertemuan: result.totalPertemuan,
      totalJamPelajaran: result.totalJamPelajaran,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      rppId,
      message: `RPP berhasil dibuat ${generationMethod === 'ai' ? 'dengan AI enhancement' : ''}`,
      data: {
        id: rppId,
        mapelName: prosemData.mapelName,
        kelasLevel,
        kelasDivision,
        pertemuanList: result.pertemuanList,
        totalPertemuan: result.totalPertemuan,
        totalJamPelajaran: result.totalJamPelajaran,
        generationMethod,
      },
    });
  } catch (error) {
    console.error('[RPP Generate] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat RPP',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
