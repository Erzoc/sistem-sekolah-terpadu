import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/client';
import { simpleCalendars, protaRecords } from '@/schemas';
import { eq } from 'drizzle-orm';
import { ProtaGenerator } from '@/lib/generators/prota-generator';

function generateId(prefix: string = 'prota'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request
    const body = await request.json();
    const { simpleCalendarId, mapelCode, mapelName, cpList, strategy } = body;

    // 2. Validation
    if (!simpleCalendarId || !mapelCode || !mapelName || !cpList || !strategy) {
      return NextResponse.json(
        { success: false, error: 'Field wajib tidak lengkap' },
        { status: 400 }
      );
    }

    if (!Array.isArray(cpList) || cpList.length === 0) {
      return NextResponse.json(
        { success: false, error: 'CP/KD list tidak boleh kosong' },
        { status: 400 }
      );
    }

    // 3. Load SimpleCalendar
    const calendar = await db
      .select()
      .from(simpleCalendars)
      .where(eq(simpleCalendars.id, simpleCalendarId))
      .limit(1);

    if (!calendar || calendar.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Kalender tidak ditemukan' },
        { status: 404 }
      );
    }

    const cal = calendar[0];

    // 4. Generate Prota
    const generator = new ProtaGenerator(
      { simpleCalendarId, mapelCode, mapelName, cpList, strategy },
      cal.effectiveWeeks
    );

    const result = generator.generate();

    // 5. Save to database
    const protaId = generateId('prota');

    await db.insert(protaRecords).values({
      id: protaId,
      tenantId: cal.tenantId,
      simpleCalendarId,
      mapelCode,
      mapelName,
      academicYear: cal.academicYear,
      semester: cal.semester,
      competenciesJson: JSON.stringify(result.competencies),
      strategy,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 6. Return success
    return NextResponse.json({
      success: true,
      protaId,
      message: 'Prota berhasil dibuat',
      data: {
        id: protaId,
        mapelCode,
        mapelName,
        competencies: result.competencies,
        totalWeeks: result.totalWeeks,
        strategy: result.strategy,
      },
    });
  } catch (error) {
    console.error('[Prota Generate] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat Prota',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
