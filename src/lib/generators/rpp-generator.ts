interface Pertemuan {
  pertemuanKe: number;
  weekNumber: number;
  cpCode: string;
  cpName: string;
  tujuanPembelajaran: string[];
  materiPokok: string[];
  kegiatanPembelajaran: {
    pendahuluan: string[];
    inti: string[];
    penutup: string[];
  };
  asesmen: string[];
  mediaAlat: string[];
  alokasi: number;  // JP (jam pelajaran)
}

interface WeeklySchedule {
  weekNumber: number;
  cpCode: string | null;
  cpName: string | null;
  materiPokok: string;
  isHoliday: boolean;
  allocatedHours?: number;
}

interface RppGeneratorInput {
  prosemId: string;
  mapelCode: string;
  mapelName: string;
  kelasLevel: string;
  kelasDivision?: string;
  weeklySchedule: WeeklySchedule[];
  templateType: 'merdeka' | 'k13' | 'custom';
  generationMethod: 'template' | 'ai' | 'manual';
}

interface RppGeneratorOutput {
  pertemuanList: Pertemuan[];
  totalPertemuan: number;
  totalJamPelajaran: number;
}

export class RppGenerator {
  private input: RppGeneratorInput;

  constructor(input: RppGeneratorInput) {
    this.input = input;
  }

  generate(): RppGeneratorOutput {
    const pertemuanList: Pertemuan[] = [];
    let pertemuanCounter = 1;
    let totalJP = 0;

    // Filter only effective weeks (non-holiday)
    const effectiveWeeks = this.input.weeklySchedule.filter((w) => !w.isHoliday);

    effectiveWeeks.forEach((week) => {
      if (!week.cpCode || !week.cpName) return;

      const pertemuan: Pertemuan = {
        pertemuanKe: pertemuanCounter,
        weekNumber: week.weekNumber,
        cpCode: week.cpCode,
        cpName: week.cpName,
        tujuanPembelajaran: this.generateTujuan(week.cpName, pertemuanCounter),
        materiPokok: this.generateMateri(week.cpName, pertemuanCounter),
        kegiatanPembelajaran: this.generateKegiatan(week.cpName, pertemuanCounter),
        asesmen: this.generateAsesmen(week.cpName),
        mediaAlat: this.generateMedia(this.input.mapelCode),
        alokasi: week.allocatedHours || 4,
      };

      pertemuanList.push(pertemuan);
      totalJP += pertemuan.alokasi;
      pertemuanCounter++;
    });

    return {
      pertemuanList,
      totalPertemuan: pertemuanList.length,
      totalJamPelajaran: totalJP,
    };
  }
  // Add this method after the generate() method
  async generateWithAI(aiClient: any): Promise<RppGeneratorOutput> {
    const pertemuanList: Pertemuan[] = [];
    const effectiveWeeks = this.input.weeklySchedule.filter((w) => !w.isHoliday);

    let pertemuanCounter = 1;
    let totalJP = 0;

    // Limit AI calls to first 5 pertemuan (to avoid rate limits)
    const maxAIPertemuan = 5;

    for (const week of effectiveWeeks) {
      if (!week.cpCode || !week.cpName) continue;

      let pertemuan: Pertemuan;

      // Use AI for first N pertemuan, template for rest
      if (pertemuanCounter <= maxAIPertemuan) {
        try {
          console.log(`[AI] Enhancing pertemuan ${pertemuanCounter}...`);

          const enhanced = await aiClient.enhanceRpp({
            cpCode: week.cpCode,
            cpName: week.cpName,
            mapelName: this.input.mapelName,
            kelasLevel: this.input.kelasLevel,
            pertemuanKe: pertemuanCounter,
          });

          pertemuan = {
            pertemuanKe: pertemuanCounter,
            weekNumber: week.weekNumber,
            cpCode: week.cpCode,
            cpName: week.cpName,
            tujuanPembelajaran: enhanced.tujuanPembelajaran,
            materiPokok: enhanced.materiPokok,
            kegiatanPembelajaran: enhanced.kegiatanPembelajaran,
            asesmen: enhanced.asesmen,
            mediaAlat: enhanced.mediaAlat,
            alokasi: week.allocatedHours || 4,
          };

          console.log(`[AI] Success for pertemuan ${pertemuanCounter}`);
        } catch (error) {
          console.error(`[AI] Failed for pertemuan ${pertemuanCounter}, using template`);

          // Fallback to template
          pertemuan = {
            pertemuanKe: pertemuanCounter,
            weekNumber: week.weekNumber,
            cpCode: week.cpCode,
            cpName: week.cpName,
            tujuanPembelajaran: this.generateTujuan(week.cpName, pertemuanCounter),
            materiPokok: this.generateMateri(week.cpName, pertemuanCounter),
            kegiatanPembelajaran: this.generateKegiatan(week.cpName, pertemuanCounter),
            asesmen: this.generateAsesmen(week.cpName),
            mediaAlat: this.generateMedia(this.input.mapelCode),
            alokasi: week.allocatedHours || 4,
          };
        }
      } else {
        // Use template for remaining pertemuan
        pertemuan = {
          pertemuanKe: pertemuanCounter,
          weekNumber: week.weekNumber,
          cpCode: week.cpCode,
          cpName: week.cpName,
          tujuanPembelajaran: this.generateTujuan(week.cpName, pertemuanCounter),
          materiPokok: this.generateMateri(week.cpName, pertemuanCounter),
          kegiatanPembelajaran: this.generateKegiatan(week.cpName, pertemuanCounter),
          asesmen: this.generateAsesmen(week.cpName),
          mediaAlat: this.generateMedia(this.input.mapelCode),
          alokasi: week.allocatedHours || 4,
        };
      }

      pertemuanList.push(pertemuan);
      totalJP += pertemuan.alokasi;
      pertemuanCounter++;
    }

    return {
      pertemuanList,
      totalPertemuan: pertemuanList.length,
      totalJamPelajaran: totalJP,
    };
  }

  private generateTujuan(cpName: string, pertemuan: number): string[] {
    return [
      `Peserta didik dapat memahami konsep dasar ${cpName}`,
      `Peserta didik dapat menerapkan ${cpName} dalam konteks nyata`,
      `Peserta didik dapat menganalisis permasalahan terkait ${cpName}`,
    ];
  }

  private generateMateri(cpName: string, pertemuan: number): string[] {
    return [
      `Pengenalan ${cpName}`,
      `Konsep dan teori ${cpName}`,
      `Aplikasi ${cpName}`,
      `Latihan soal ${cpName}`,
    ];
  }

  private generateKegiatan(cpName: string, pertemuan: number): Pertemuan['kegiatanPembelajaran'] {
    return {
      pendahuluan: [
        'Guru membuka pembelajaran dengan salam dan doa',
        'Guru mengecek kehadiran peserta didik',
        'Guru menyampaikan tujuan pembelajaran',
        `Guru memberikan apersepsi tentang ${cpName}`,
      ],
      inti: [
        `Guru menjelaskan materi ${cpName} menggunakan media presentasi`,
        'Peserta didik mengamati contoh kasus yang diberikan guru',
        'Peserta didik berdiskusi dalam kelompok kecil',
        `Peserta didik mempresentasikan hasil diskusi tentang ${cpName}`,
        'Guru memberikan penguatan dan umpan balik',
      ],
      penutup: [
        `Guru dan peserta didik menyimpulkan materi ${cpName}`,
        'Guru memberikan tugas/PR',
        'Guru menyampaikan rencana pembelajaran pertemuan berikutnya',
        'Pembelajaran ditutup dengan doa dan salam',
      ],
    };
  }

  private generateAsesmen(cpName: string): string[] {
    return [
      'Asesmen Formatif: Observasi diskusi kelompok',
      `Asesmen Formatif: Kuis singkat tentang ${cpName}`,
      'Asesmen Sumatif: Tes tertulis',
      'Asesmen Proyek: Tugas presentasi kelompok',
    ];
  }

  private generateMedia(mapelCode: string): string[] {
    const baseMedia = [
      'Laptop/PC',
      'Proyektor',
      'Papan tulis',
      'Spidol',
      'Buku paket',
    ];

    const mapelSpecific: Record<string, string[]> = {
      mtk: ['Kalkulator', 'Software GeoGebra', 'Alat peraga matematika'],
      ipa: ['Alat praktikum', 'Model anatomi', 'Mikroskop'],
      ips: ['Peta', 'Globe', 'Video dokumenter'],
      default: ['Modul pembelajaran', 'Lembar kerja siswa'],
    };

    return [...baseMedia, ...(mapelSpecific[mapelCode] || mapelSpecific.default)];
  }
}
