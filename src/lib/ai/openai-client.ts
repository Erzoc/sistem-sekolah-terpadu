interface OpenAIEnhanceInput {
  cpCode: string;
  cpName: string;
  mapelName: string;
  kelasLevel: string;
  pertemuanKe: number;
}

interface OpenAIEnhanceOutput {
  tujuanPembelajaran: string[];
  materiPokok: string[];
  kegiatanPembelajaran: {
    pendahuluan: string[];
    inti: string[];
    penutup: string[];
  };
  asesmen: string[];
  mediaAlat: string[];
}

export class OpenAIClient {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';
  private model = 'gpt-3.5-turbo';
 // Free model

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }
  }

  async enhanceRpp(input: OpenAIEnhanceInput): Promise<OpenAIEnhanceOutput> {
    const prompt = this.buildPrompt(input);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Kamu adalah guru profesional Indonesia yang ahli membuat RPP (Rencana Pelaksanaan Pembelajaran) berkualitas tinggi sesuai Kurikulum Merdeka.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices[0].message.content;

      return this.parseResponse(text);
    } catch (error) {
      console.error('[OpenAI] Error:', error);
      throw error;
    }
  }

  private buildPrompt(input: OpenAIEnhanceInput): string {
  return `
Anda adalah guru profesional Indonesia yang SANGAT AHLI dalam membuat RPP (Rencana Pelaksanaan Pembelajaran) berkualitas tinggi sesuai Kurikulum Merdeka.

TUGAS: Buatkan RPP yang DETAIL, SPESIFIK, dan APLIKATIF untuk:

**INFORMASI PEMBELAJARAN:**
- Mata Pelajaran: ${input.mapelName}
- Kelas: ${input.kelasLevel}
- CP/KD: ${input.cpCode} - ${input.cpName}
- Pertemuan ke-${input.pertemuanKe}

**INSTRUKSI PENTING:**
1. Tujuan pembelajaran harus SPESIFIK dan TERUKUR (gunakan kata kerja operasional: menganalisis, mengevaluasi, membuat, dsb)
2. Materi pokok harus DETAIL dengan sub-topik yang jelas
3. Kegiatan pembelajaran harus KONKRET dan APLIKATIF (hindari kata generik seperti "guru menjelaskan")
4. Asesmen harus VARIATIF (formatif, sumatif, autentik)
5. Media harus RELEVAN dengan materi ${input.cpName}

**FORMAT OUTPUT (JSON):**
\`\`\`json
{
  "tujuanPembelajaran": [
    "Peserta didik mampu [KATA KERJA OPERASIONAL] [OBJEK SPESIFIK] dengan [KRITERIA] setelah [KONDISI]",
    "Peserta didik dapat [ANALISIS/EVALUASI/KREASI yang spesifik untuk ${input.cpName}]",
    "Peserta didik terampil [KETERAMPILAN KONKRET terkait ${input.cpName}]"
  ],
  "materiPokok": [
    "1. [Sub-materi utama dari ${input.cpName}] - meliputi: [detail a, b, c]",
    "2. [Konsep kunci] - penjelasan: [konteks real-world]",
    "3. [Aplikasi praktis] - contoh: [kasus nyata di kehidupan]",
    "4. [Latihan penerapan] - studi kasus: [problem solving konkret]"
  ],
  "kegiatanPembelajaran": {
    "pendahuluan": [
      "Guru menampilkan [VIDEO/GAMBAR/KASUS NYATA spesifik] terkait ${input.cpName} untuk menarik perhatian",
      "Guru mengajukan pertanyaan pemantik: '[PERTANYAAN KONKRET tentang ${input.cpName}]'",
      "Guru menyampaikan tujuan: 'Hari ini kita akan [AKTIVITAS SPESIFIK]'",
      "Guru menghubungkan dengan materi sebelumnya: '[KONEKSI JELAS]'"
    ],
    "inti": [
      "Guru mendemonstrasikan [PROSEDUR/KONSEP SPESIFIK] menggunakan [ALAT/MEDIA KONKRET]",
      "Peserta didik mengamati [FENOMENA/CONTOH REAL] dan mencatat [DATA/INFORMASI TERSTRUKTUR]",
      "Peserta didik berdiskusi kelompok untuk [TUGAS ANALISIS KONKRET tentang ${input.cpName}]",
      "Setiap kelompok mempresentasikan hasil analisis [ASPEK SPESIFIK] dengan [FORMAT TERTENTU]",
      "Guru memfasilitasi diskusi kelas: '[PERTANYAAN KRITIS tentang ${input.cpName}]'",
      "Peserta didik mengerjakan [LATIHAN APLIKATIF]: [DESKRIPSI SOAL/TUGAS]",
      "Guru memberikan feedback spesifik: '[CONTOH FEEDBACK untuk kesalahan umum]'"
    ],
    "penutup": [
      "Peserta didik menyimpulkan: '[KESIMPULAN KUNCI tentang ${input.cpName}]'",
      "Guru memberikan refleksi: '[PERTANYAAN REFLEKTIF konkret]'",
      "Peserta didik mengerjakan exit ticket: '[SOAL SINGKAT untuk cek pemahaman]'",
      "Guru memberikan tugas: '[TUGAS SPESIFIK yang melibatkan aplikasi ${input.cpName}]'",
      "Preview materi berikutnya: '[KONEKSI ke pertemuan ${input.pertemuanKe + 1}]'"
    ]
  },
  "asesmen": [
    "Asesmen Formatif: Observasi saat diskusi kelompok menggunakan rubrik [ASPEK: kerja sama, komunikasi, pemahaman konsep]",
    "Asesmen Formatif: Kuis digital interaktif (Kahoot/Quizizz) tentang [TOPIK SPESIFIK dari ${input.cpName}] - 5 soal pilihan ganda + 2 soal uraian",
    "Asesmen Sumatif: Tes tertulis mencakup [C2: pemahaman, C3: aplikasi, C4: analisis] dengan bobot [40-30-30]",
    "Asesmen Autentik: Proyek pembuatan [PRODUK/KARYA konkret terkait ${input.cpName}] dengan kriteria [RUBRIK 4 aspek]"
  ],
  "mediaAlat": [
    "Laptop dan proyektor untuk menampilkan [KONTEN SPESIFIK: simulasi/video edukatif]",
    "Lembar Kerja Peserta Didik (LKPD) berisi [AKTIVITAS GUIDED INQUIRY tentang ${input.cpName}]",
    "Media manipulatif: [ALAT/BAHAN KONKRET untuk hands-on activity]",
    "Platform digital: [APLIKASI/SOFTWARE spesifik, misal: GeoGebra untuk Matematika]",
    "Sumber belajar: [BUKU/ARTIKEL/VIDEO spesifik] sebagai referensi tambahan"
  ]
}
\`\`\`

**ATURAN KETAT:**
- Output HANYA JSON, TANPA teks penjelasan di luar JSON
- Hindari placeholder generik seperti "Guru menjelaskan materi" - harus KONKRET
- Semua contoh harus RELEVAN dengan ${input.mapelName} kelas ${input.kelasLevel}
- Gunakan bahasa yang tepat untuk level kelas ${input.kelasLevel}
- Fokus pada pembelajaran aktif dan student-centered

HASILKAN JSON SEKARANG:
`;
}


  private parseResponse(text: string): OpenAIEnhanceOutput {
    try {
      // Remove markdown code blocks
      let jsonText = text.replace(/``````\n?/g, '').trim();
      
      // Find JSON object in text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      return JSON.parse(jsonText);
    } catch (error) {
      console.error('[OpenAI] Parse error:', error);
      console.error('[OpenAI] Raw text:', text);
      throw new Error('Failed to parse OpenAI response');
    }
  }
}
