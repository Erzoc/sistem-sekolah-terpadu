// src/app/api/rpp/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rppPertemuan } from '@/lib/db/schema';
import { generateRPPWithAI } from '@/lib/services/openai-client';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const {
      guruId,
      rppId,
      prosemId,
      nomorPertemuan,
      jenjang,
      kelas,
      semester,
      mataPelajaran,
      topik,
      subTopik,
      jp,
      tahunAjaran,
      metodePembelajaran,
      mediaPembelajaran,
      sumberBelajar,
      jenisPenilaian,
    } = body;

    if (!guruId || !topik || !jp) {
      return NextResponse.json(
        { error: 'Missing required fields: guruId, topik, jp' },
        { status: 400 }
      );
    }

    // Generate RPP with AI
    console.log('🤖 Generating RPP with AI...');
    const aiResult = await generateRPPWithAI({
      jenjang,
      kelas,
      semester,
      mataPelajaran,
      topik,
      subTopik,
      jp,
      tahunAjaran,
      metodePembelajaran: metodePembelajaran || [],
      mediaPembelajaran: mediaPembelajaran || [],
      sumberBelajar: sumberBelajar || [],
      jenisPenilaian: jenisPenilaian || [],
    });

    // Save to database
    const pertemuanId = nanoid();
    const now = new Date().toISOString();

    await db.insert(rppPertemuan).values({
      id: pertemuanId,
      rppId: rppId || nanoid(),
      guruId,
      prosemId: prosemId || '',
      nomorPertemuan: nomorPertemuan || 1,
      topik,
      subTopik: subTopik || null,
      jp,
      
      // Manual inputs
      metodePembelajaran: JSON.stringify(metodePembelajaran || []),
      mediaPembelajaran: JSON.stringify(mediaPembelajaran || []),
      sumberBelajar: JSON.stringify(sumberBelajar || []),
      jenisPenilaian: JSON.stringify(jenisPenilaian || []),
      
      // AI generated
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

    console.log('✅ RPP saved to database:', pertemuanId);

    return NextResponse.json({
      success: true,
      message: 'RPP generated successfully!',
      data: {
        id: pertemuanId,
        topik,
        status: 'completed',
        ...aiResult,
      },
    });

  } catch (error: any) {
    console.error('❌ Generate RPP Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate RPP',
      },
      { status: 500 }
    );
  }
}
