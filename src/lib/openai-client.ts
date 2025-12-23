// OpenRouter API Client with TypeScript
// Free model: meta-llama/llama-2-70b-chat

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
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private model = 'meta-llama/llama-2-70b-chat'; // FREE model

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
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
          'HTTP-Referer': 'https://gurupintar.site',
          'X-Title': 'Guru Pintar - Teacher Toolbox',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Kamu adalah guru profesional Indonesia ahli membuat RPP (Rencana Pelaksanaan Pembelajaran) berkualitas tinggi sesuai Kurikulum Merdeka. SELALU output JSON valid, TANPA teks tambahan.',
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
    return `Buatkan RPP DETAIL dan SPESIFIK untuk:

**Mata Pelajaran:** ${input.mapelName}
**Kelas:** ${input.kelasLevel}
**CP/KD:** ${input.cpCode} - ${input.cpName}
**Pertemuan ke-${input.pertemuanKe}**

OUTPUT hanya JSON format di bawah (TANPA markdown, TANPA penjelasan):

\`\`\`json
{
  "tujuanPembelajaran": [
    "Peserta didik mampu [OPERASIONAL] [OBJEK] dengan [KRITERIA]",
    "Peserta didik dapat [ANALISIS/EVALUASI/KREASI spesifik]",
    "Peserta didik terampil [KETERAMPILAN KONKRET]"
  ],
  "materiPokok": [
    "1. [Sub-materi] - meliputi: [detail a, b, c]",
    "2. [Konsep kunci] - penjelasan: [konteks real-world]",
    "3. [Aplikasi praktis] - contoh: [kasus nyata]",
    "4. [Latihan penerapan] - studi kasus: [problem solving]"
  ],
  "kegiatanPembelajaran": {
    "pendahuluan": [
      "Guru menampilkan [VIDEO/KASUS NYATA] untuk menarik perhatian",
      "Guru mengajukan pertanyaan pemantik: '[PERTANYAAN KONKRET]'",
      "Guru menyampaikan tujuan pembelajaran"
    ],
    "inti": [
      "Guru mendemonstrasikan [PROSEDUR/KONSEP] menggunakan [ALAT]",
      "Peserta didik mengamati dan mencatat [DATA]",
      "Peserta didik diskusi kelompok [TUGAS ANALISIS]",
      "Presentasi hasil analisis dengan feedback"
    ],
    "penutup": [
      "Peserta didik menyimpulkan pembelajaran",
      "Refleksi: [PERTANYAAN REFLEKTIF]",
      "Exit ticket: [SOAL SINGKAT]",
      "Preview materi berikutnya"
    ]
  },
  "asesmen": [
    "Formatif: Observasi diskusi kelompok + kuis interaktif",
    "Sumatif: Tes tertulis mencakup C2, C3, C4",
    "Autentik: Proyek pembuatan [PRODUK KONKRET]"
  ],
  "mediaAlat": [
    "Laptop & proyektor",
    "LKPD terstruktur",
    "Platform digital: [APLIKASI SPESIFIK]",
    "Sumber belajar: [BUKU/VIDEO]"
  ]
}
\`\`\``;
  }

  private parseResponse(text: string): OpenAIEnhanceOutput {
    try {
      let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
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
