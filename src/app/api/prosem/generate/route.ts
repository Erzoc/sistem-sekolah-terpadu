import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/client';
import { protaRecords, simpleCalendars, prosemRecords } from '@/schemas';
import { eq } from 'drizzle-orm';
import { ProsemGenerator } from '@/lib/generators/prosem-generator';

function generateId(prefix: string = 'prosem'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { protaId } = body;

    if (!protaId) {
      return NextResponse.json(
        { success: false, error: 'Prota ID wajib diisi' },
        { status: 400 }
      );
    }

    // 1. Load ProtaRecord
    const prota = await db
      .select()
      .from(protaRecords)
      .where(eq(protaRecords.id, protaId))
      .limit(1);

    if (!prota || prota.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prota tidak ditemukan' },
        { status: 404 }
      );
    }

    const protaData = prota[0];

    // 2. Load SimpleCalendar
    const calendar = await db
      .select()
      .from(simpleCalendars)
      .where(eq(simpleCalendars.id, protaData.simpleCalendarId))
      .limit(1);

    if (!calendar || calendar.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Kalender tidak ditemukan' },
        { status: 404 }
      );
    }

    const cal = calendar[0];

    // 3. Parse competencies from Prota
    const competencies = JSON.parse(protaData.competenciesJson);

    // 4. Parse holidays from Calendar
    const holidays = cal.holidaysJson ? JSON.parse(cal.holidaysJson) : [];

    // 5. Generate Prosem
    const generator = new ProsemGenerator({
      protaId,
      simpleCalendarId: cal.id,
      competencies,
      startDate: cal.startDate,
      endDate: cal.endDate,
      holidays,
    });

    const result = generator.generate();

    // 6. Save to database
    const prosemId = generateId('prosem');

    await db.insert(prosemRecords).values({
      id: prosemId,
      tenantId: cal.tenantId,
      protaRecordId: protaId,
      simpleCalendarId: cal.id,
      mapelCode: protaData.mapelCode,
      mapelName: protaData.mapelName,
      academicYear: protaData.academicYear,
      semester: protaData.semester,
      weeklyScheduleJson: JSON.stringify(result.weeklySchedule),
      totalWeeks: result.totalWeeks,
      effectiveWeeks: result.effectiveWeeks,
      holidayWeeks: result.holidayWeeks,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      prosemId,
      message: 'Prosem berhasil dibuat',
      data: {
        id: prosemId,
        mapelCode: protaData.mapelCode,
        mapelName: protaData.mapelName,
        weeklySchedule: result.weeklySchedule,
        totalWeeks: result.totalWeeks,
        effectiveWeeks: result.effectiveWeeks,
        holidayWeeks: result.holidayWeeks,
      },
    });
  } catch (error) {
    console.error('[Prosem Generate] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat Prosem',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
