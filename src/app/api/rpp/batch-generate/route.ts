// src/app/api/rpp/batch-generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rppPertemuan, batchJobs, batchFailedItems } from '@/lib/db/schema';
import { generateRPPWithAI } from '@/lib/services/openai-client';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, guruId, rppId, prosemId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Create batch job
    const batchId = `batch_${Date.now()}`;
    const now = new Date().toISOString();

    await db.insert(batchJobs).values({
      id: batchId,
      guruId: guruId || 'anonymous',
      rppId: rppId || nanoid(),
      totalRpp: items.length,
      completed: 0,
      failed: 0,
      status: 'pending',
      batchInput: JSON.stringify(body),
      rppPertemuanIds: JSON.stringify([]),
      createdAt: now,
      startedAt: null,
      completedAt: null,
    });

    console.log(`📦 Batch job created: ${batchId} (${items.length} items)`);

    // Process in background
    processQueueInBackground(batchId, items, guruId, rppId, prosemId);

    return NextResponse.json({
      success: true,
      message: 'Batch job created',
      data: {
        batchId,
        totalItems: items.length,
        status: 'pending',
      },
    });

  } catch (error: any) {
    console.error('❌ Batch Generate Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Background processing
async function processQueueInBackground(
  batchId: string,
  items: any[],
  guruId: string,
  rppId: string,
  prosemId: string
) {
  // Update status to in_progress
  await db.update(batchJobs)
    .set({ 
      status: 'in_progress',
      startedAt: new Date().toISOString()
    })
    .where(eq(batchJobs.id, batchId)); // ✅ FIXED

  const generatedIds: string[] = [];
  let completed = 0;
  let failed = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    try {
      console.log(`🔄 Processing ${i + 1}/${items.length}: ${item.topik}`);

      const aiResult = await generateRPPWithAI({
        jenjang: item.jenjang,
        kelas: item.kelas,
        semester: item.semester,
        mataPelajaran: item.mataPelajaran,
        topik: item.topik,
        subTopik: item.subTopik,
        jp: item.jp,
        tahunAjaran: item.tahunAjaran,
        metodePembelajaran: item.metodePembelajaran || [],
        mediaPembelajaran: item.mediaPembelajaran || [],
        sumberBelajar: item.sumberBelajar || [],
        jenisPenilaian: item.jenisPenilaian || [],
      });

      const pertemuanId = nanoid();
      const now = new Date().toISOString();

      await db.insert(rppPertemuan).values({
        id: pertemuanId,
        rppId,
        guruId,
        prosemId: prosemId || '',
        nomorPertemuan: i + 1,
        topik: item.topik,
        subTopik: item.subTopik || null,
        jp: item.jp,
        metodePembelajaran: JSON.stringify(item.metodePembelajaran || []),
        mediaPembelajaran: JSON.stringify(item.mediaPembelajaran || []),
        sumberBelajar: JSON.stringify(item.sumberBelajar || []),
        jenisPenilaian: JSON.stringify(item.jenisPenilaian || []),
        kompetensiInti: JSON.stringify(aiResult.kompetensiInti),
        capaianPembelajaran: JSON.stringify(aiResult.capaianPembelajaran),
        tujuanPembelajaran: JSON.stringify(aiResult.tujuanPembelajaran),
        materi: JSON.stringify(aiResult.materi),
        kegiatanPendahuluan: JSON.stringify(aiResult.kegiatanPendahuluan),
        kegiatanInti: JSON.stringify(aiResult.kegiatanInti),
        kegiatanPenutup: JSON.stringify(aiResult.kegiatanPenutup),
        asesmen: JSON.stringify(aiResult.asesmen),
        status: 'completed',
        errorMessage: null,
        isEdited: 0,
        retryCount: 0,
        createdAt: now,
        updatedAt: now,
      });

      generatedIds.push(pertemuanId);
      completed++;

      // Update batch progress
      await db.update(batchJobs)
        .set({ 
          completed,
          rppPertemuanIds: JSON.stringify(generatedIds)
        })
        .where(eq(batchJobs.id, batchId)); // ✅ FIXED

      console.log(`✅ Completed ${completed}/${items.length}`);

    } catch (error: any) {
      console.error(`❌ Failed ${i + 1}: ${item.topik}`, error.message);
      
      failed++;
      
      // Log failed item
      await db.insert(batchFailedItems).values({
        id: nanoid(),
        batchId,
        itemNumber: i + 1,
        topik: item.topik,
        errorMessage: error.message,
        retryCount: 0,
        failedAt: new Date().toISOString(),
      });

      // Update batch progress
      await db.update(batchJobs)
        .set({ failed })
        .where(eq(batchJobs.id, batchId)); // ✅ FIXED
    }
  }

  // Mark batch as completed
  await db.update(batchJobs)
    .set({ 
      status: 'completed',
      completedAt: new Date().toISOString()
    })
    .where(eq(batchJobs.id, batchId)); // ✅ FIXED

  console.log(`🎉 Batch completed: ${completed} success, ${failed} failed`);
}
