// src/app/api/rpp/batch-status/[batchId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { batchJobs, batchFailedItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const { batchId } = params;

    const [job] = await db.select().from(batchJobs).where(eq(batchJobs.id, batchId));

    if (!job) {
      return NextResponse.json(
        { error: 'Batch job not found' },
        { status: 404 }
      );
    }

    // Get failed items
    const failedItems = await db.select()
      .from(batchFailedItems)
      .where(eq(batchFailedItems.batchId, batchId));

    return NextResponse.json({
      success: true,
      data: {
        ...job,
        failedItems,
        progress: Math.round(((job.completed + job.failed) / job.totalRpp) * 100),
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
