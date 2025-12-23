import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth'; // ← Ubah dari @/lib/auth

export const runtime = 'nodejs';
export const maxDuration = 60;

function getAIModel() {
  const provider = process.env.AI_PROVIDER || 'gemini';
  
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    return openai('gpt-4o-mini');
  }
  
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not configured');
  }
  
  return google('gemini-2.0-flash-exp');
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const {
      subject,
      grade,
      topic,
      duration,
      learningObjectives,
      materials,
      assessmentType
    } = body;

    // 3. Validation
    if (!subject || !grade || !topic) {
      return NextResponse.json(
        { error: 'Subject, grade, and topic are required fields' },
        { status: 400 }
      );
    }

    // 4. Construct detailed prompt
    const prompt = `Anda adalah asisten guru profesional yang ahli dalam membuat Rencana Pelaksanaan Pembelajaran (RPP) sesuai Kurikulum Merdeka Indonesia.

INFORMASI PEMBELAJARAN:
- Mata Pelajaran: ${subject}
- Kelas: ${grade}
- Topik/Materi: ${topic}
- Durasi: ${duration || '2 x 45 menit'}
- Tujuan Pembelajaran: ${learningObjectives || 'Sesuai Capaian Pembelajaran'}
- Materi/Alat: ${materials || 'Buku teks, papan tulis, multimedia'}
- Jenis Asesmen: ${assessmentType || 'Formatif dan Sumatif'}

TUGAS:
Buatkan RPP lengkap dengan struktur berikut:

1. IDENTITAS
   - Nama Sekolah: [Nama Sekolah]
   - Mata Pelajaran: ${subject}
   - Kelas/Semester: ${grade}
   - Alokasi Waktu: ${duration || '2 x 45 menit'}

2. CAPAIAN PEMBELAJARAN (CP)
   - Sesuai dengan fase dan elemen CP Kurikulum Merdeka untuk kelas ${grade}

3. TUJUAN PEMBELAJARAN
   - Gunakan kata kerja operasional yang measurable
   - Minimal 3 tujuan spesifik

4. PROFIL PELAJAR PANCASILA
   - Dimensi yang dikembangkan (min. 2)

5. KEGIATAN PEMBELAJARAN
   A. Pendahuluan (10 menit)
   B. Kegiatan Inti (60 menit) - gunakan model pembelajaran aktif
   C. Penutup (20 menit)

6. ASESMEN
   - Asesmen Diagnostik
   - Asesmen Formatif
   - Asesmen Sumatif

7. PENGAYAAN DAN REMEDIAL
   - Strategi untuk siswa advanced
   - Strategi untuk siswa yang perlu dukungan tambahan

8. REFLEKSI GURU
   - Template refleksi

Format: Gunakan struktur yang jelas dengan numbering dan bullets. Buat konten yang praktis dan siap digunakan guru.`;

    // 5. Generate AI response with streaming
    const model = getAIModel();
    
    const result = streamText({
      model,
      prompt,
      temperature: 0.7,
      maxOutputTokens: 4000, // ← Ubah dari maxTokens ke maxOutputTokens
    });

    // 6. Return streaming response
    return result.toTextStreamResponse(); // ← Ubah dari toDataStreamResponse ke toTextStreamResponse

  } catch (error: any) {
    console.error('RPP Generation Error:', error);
    
    if (error.message?.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'AI service not configured properly. Contact administrator.' },
        { status: 500 }
      );
    }
    
    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'AI service quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate RPP. Please try again.' },
      { status: 500 }
    );
  }
}
