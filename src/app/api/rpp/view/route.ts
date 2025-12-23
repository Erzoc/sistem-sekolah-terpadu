import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/client';
import { rppRecords } from '@/schemas';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    console.log('[RPP View] Request ID:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'RPP ID required' },
        { status: 400 }
      );
    }

    const rpp = await db
      .select()
      .from(rppRecords)
      .where(eq(rppRecords.id, id))
      .limit(1);

    console.log('[RPP View] Found records:', rpp?.length || 0);

    if (!rpp || rpp.length === 0) {
      return NextResponse.json(
        { success: false, error: 'RPP not found' },
        { status: 404 }
      );
    }

    const rppData = rpp[0];
    console.log('[RPP View] Returning data for:', rppData.mapelName);

    return NextResponse.json({
      success: true,
      data: rppData,
    });
  } catch (error) {
    console.error('[RPP View] Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load RPP',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
