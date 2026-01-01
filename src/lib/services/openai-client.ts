// src/lib/services/openai-client.ts
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RPPGenerateInput {
  jenjang: 'SMA' | 'MA' | 'SMK';
  kelas: 10 | 11 | 12;
  semester: 1 | 2;
  mataPelajaran: string;
  topik: string;
  subTopik?: string;
  jp: number;
  tahunAjaran: string;
  
  // Manual inputs (from form)
  metodePembelajaran: string[];
  mediaPembelajaran: string[];
  sumberBelajar: string[];
  jenisPenilaian: string[];
}

export interface RPPGenerateOutput {
  kompetensiInti: {
    ki1: string;
    ki2: string;
    ki3: string;
    ki4: string;
  };
  capaianPembelajaran: {
    kode: string;
    deskripsi: string;
  };
  tujuanPembelajaran: string[];
  materi: {
    konsep: string[];
    prosedural: string[];
    metakognitif?: string[];
  };
  kegiatanPendahuluan: {
    durasi: number;
    langkah: string[];
  };
  kegiatanInti: {
    durasi: number;
    fase: Array<{
      nama: string;
      deskripsi: string;
      langkah: string[];
    }>;
  };
  kegiatanPenutup: {
    durasi: number;
    langkah: string[];
  };
  asesmen: {
    formatif: string[];
    sumatif: string[];
    rubrik?: string;
  };
}

export async function generateRPPWithAI(
  input: RPPGenerateInput
): Promise<RPPGenerateOutput> {
  const subTopikLine = input.subTopik ? `- Sub Topik: ${input.subTopik}` : '';
  
  const prompt = `Anda adalah ahli kurikulum Indonesia. Generate RPP lengkap untuk:

INFORMASI DASAR:
- Jenjang: ${input.jenjang}
- Kelas: ${input.kelas}
- Semester: ${input.semester}
- Mata Pelajaran: ${input.mataPelajaran}
- Topik: ${input.topik}
${subTopikLine}
- Jumlah Pertemuan: ${input.jp} JP (1 JP = 45 menit)
- Tahun Ajaran: ${input.tahunAjaran}

METODE & MEDIA (dari guru):
- Metode: ${input.metodePembelajaran.join(', ')}
- Media: ${input.mediaPembelajaran.join(', ')}
- Sumber: ${input.sumberBelajar.join(', ')}
- Penilaian: ${input.jenisPenilaian.join(', ')}

INSTRUKSI:
1. Generate Kompetensi Inti (KI 1-4) sesuai jenjang
2. Capaian Pembelajaran dengan kode CP yang relevan
3. Tujuan Pembelajaran (3-5 tujuan, gunakan kata kerja operasional Bloom)
4. Materi Pembelajaran (konsep, prosedural, metakognitif)
5. Kegiatan Pembelajaran:
   - Pendahuluan (10-15% dari total waktu)
   - Inti (70-80% dari total waktu, gunakan model pembelajaran yang sesuai)
   - Penutup (10-15% dari total waktu)
6. Asesmen (formatif & sumatif)

PENTING:
- Sesuaikan dengan Kurikulum Merdeka
- Gunakan bahasa yang jelas dan operasional
- Durasi sesuai JP yang diminta (${input.jp * 45} menit total)
- Integrasikan metode dan media yang dipilih guru

Response dalam format JSON sesuai struktur TypeScript RPPGenerateOutput.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Anda adalah ahli kurikulum Indonesia yang menghasilkan RPP berkualitas tinggi sesuai Kurikulum Merdeka. Output harus dalam format JSON yang valid.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const result = JSON.parse(content);
    return result as RPPGenerateOutput;
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    throw new Error(`Failed to generate RPP: ${error.message}`);
  }
}
