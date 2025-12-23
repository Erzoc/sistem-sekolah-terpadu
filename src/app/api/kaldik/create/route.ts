import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/database/client';
import { simpleCalendars } from '@/schemas';

// Generate unique ID
function generateId(prefix: string = 'cal'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication - TEMPORARY SKIP
    // const session = await getServerSession();
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { success: false, error: 'Anda harus login terlebih dahulu' },
    //     { status: 401 }
    //   );
    // }

    // TEMPORARY: Use test tenant ID
    const tenantId = 'test-user-123';

    // 2. Parse request body
    const body = await request.json();
    const { academicYear, semester, startDate, endDate, effectiveWeeks, holidays } = body;

    // 3. Validation
    const errors: string[] = [];

    if (!academicYear || typeof academicYear !== 'string') {
      errors.push('Tahun ajaran wajib diisi');
    }

    if (!semester || (semester !== 1 && semester !== 2)) {
      errors.push('Semester harus 1 atau 2');
    }

    if (!startDate || !endDate) {
      errors.push('Tanggal mulai dan berakhir wajib diisi');
    }

    if (new Date(startDate) >= new Date(endDate)) {
      errors.push('Tanggal berakhir harus setelah tanggal mulai');
    }

    if (!effectiveWeeks || effectiveWeeks < 1 || effectiveWeeks > 52) {
      errors.push('Minggu efektif harus antara 1-52');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: errors },
        { status: 400 }
      );
    }

    // 4. Generate ID
    const calendarId = generateId('cal');

    // 5. Insert to database
    await db.insert(simpleCalendars).values({
      id: calendarId,
      tenantId: tenantId,
      academicYear,
      semester,
      startDate,
      endDate,
      effectiveWeeks,
      holidaysJson: holidays && holidays.length > 0 ? JSON.stringify(holidays) : null,
      source: 'manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 6. Return success
    return NextResponse.json({
      success: true,
      calendarId,
      message: 'Kalender akademik berhasil disimpan',
      data: {
        id: calendarId,
        academicYear,
        semester,
        startDate,
        endDate,
        effectiveWeeks,
        holidayCount: holidays?.length || 0,
        source: 'manual',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Kaldik Create] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menyimpan kalender. Silakan coba lagi.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
