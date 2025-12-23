import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

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
    alokasi: number;
}

interface RppData {
    mapelName: string;
    kelasLevel: string;
    kelasDivision?: string;
    academicYear: string;
    semester: number;
    pertemuanList: Pertemuan[];
    totalPertemuan: number;
    totalJamPelajaran: number;
}

export class RppExporter {
    private data: RppData;

    constructor(data: RppData) {
        this.data = data;
    }

    // Export to PDF
    exportToPDF(): void {
        const doc = new jsPDF();
        let yPosition = 20;

        // Header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('RENCANA PELAKSANAAN PEMBELAJARAN (RPP)', 105, yPosition, { align: 'center' });

        yPosition += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Mata Pelajaran: ${this.data.mapelName}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Kelas: ${this.data.kelasLevel}${this.data.kelasDivision || ''}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Tahun Ajaran: ${this.data.academicYear} - Semester ${this.data.semester}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Total Pertemuan: ${this.data.totalPertemuan} (${this.data.totalJamPelajaran} JP)`, 20, yPosition);
        yPosition += 10;

        // Pertemuan details
        this.data.pertemuanList.forEach((pertemuan, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }

            // Pertemuan header
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(`Pertemuan ${pertemuan.pertemuanKe} - ${pertemuan.cpName}`, 20, yPosition);
            yPosition += 8;

            // Details table
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            const tableData = [
                ['CP/KD', `${pertemuan.cpCode} - ${pertemuan.cpName}`],
                ['Alokasi', `${pertemuan.alokasi} JP (${pertemuan.alokasi * 45} menit)`],
                ['Tujuan', pertemuan.tujuanPembelajaran.join('\n')],
                ['Materi', pertemuan.materiPokok.join(', ')],
                ['Kegiatan Pendahuluan', pertemuan.kegiatanPembelajaran.pendahuluan.join('\n')],
                ['Kegiatan Inti', pertemuan.kegiatanPembelajaran.inti.join('\n')],
                ['Kegiatan Penutup', pertemuan.kegiatanPembelajaran.penutup.join('\n')],
                ['Asesmen', pertemuan.asesmen.join('\n')],
                ['Media & Alat', pertemuan.mediaAlat.join(', ')],
            ];

            autoTable(doc, {
                startY: yPosition,
                head: [],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 9, cellPadding: 3 },
                columnStyles: {
                    0: { cellWidth: 40, fontStyle: 'bold' },
                    1: { cellWidth: 140 },
                },
            });

            yPosition = (doc as any).lastAutoTable.finalY + 10;
        });

        // Save
        const filename = `RPP_${this.data.mapelName}_Kelas${this.data.kelasLevel}_${Date.now()}.pdf`;
        doc.save(filename);
    }

    // Export to DOCX
    async exportToDOCX(): Promise<void> {
        const children: any[] = [];

        // Header
        children.push(
            new Paragraph({
                text: 'RENCANA PELAKSANAAN PEMBELAJARAN (RPP)',
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: 'Mata Pelajaran: ', bold: true }),
                    new TextRun(this.data.mapelName),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: 'Kelas: ', bold: true }),
                    new TextRun(`${this.data.kelasLevel}${this.data.kelasDivision || ''}`),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: 'Tahun Ajaran: ', bold: true }),
                    new TextRun(`${this.data.academicYear} - Semester ${this.data.semester}`),
                ],
            }),
            new Paragraph({ text: '' }) // Spacing
        );

        // Pertemuan details
        this.data.pertemuanList.forEach((pertemuan) => {
            children.push(
                new Paragraph({
                    text: `Pertemuan ${pertemuan.pertemuanKe} - Minggu ${pertemuan.weekNumber}`,
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: 'CP/KD: ', bold: true }),
                        new TextRun(`${pertemuan.cpCode} - ${pertemuan.cpName}`),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Alokasi: ', bold: true }),
                        new TextRun(`${pertemuan.alokasi} JP (${pertemuan.alokasi * 45} menit)`),
                    ],
                }),
                new Paragraph({ text: '' }),

                // Tujuan Pembelajaran
                new Paragraph({
                    children: [new TextRun({ text: 'Tujuan Pembelajaran:', bold: true })],
                }),
                ...pertemuan.tujuanPembelajaran.map((t) => new Paragraph({ text: `• ${t}` })),
                new Paragraph({ text: '' }),

                // Materi Pokok
                new Paragraph({
                    children: [new TextRun({ text: 'Materi Pokok:', bold: true })],
                }),
                ...pertemuan.materiPokok.map((m) => new Paragraph({ text: `• ${m}` })),
                new Paragraph({ text: '' }),

                // Kegiatan Pembelajaran
                new Paragraph({
                    children: [new TextRun({ text: 'Kegiatan Pembelajaran:', bold: true })],
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Pendahuluan:', bold: true })],
                }),
                ...pertemuan.kegiatanPembelajaran.pendahuluan.map((k) => new Paragraph({ text: `• ${k}` })),
                new Paragraph({
                    children: [new TextRun({ text: 'Inti:', bold: true })],
                }),
                ...pertemuan.kegiatanPembelajaran.inti.map((k) => new Paragraph({ text: `• ${k}` })),
                new Paragraph({
                    children: [new TextRun({ text: 'Penutup:', bold: true })],
                }),
                ...pertemuan.kegiatanPembelajaran.penutup.map((k) => new Paragraph({ text: `• ${k}` })),
                new Paragraph({ text: '' }),

                // Asesmen
                new Paragraph({
                    children: [new TextRun({ text: 'Asesmen:', bold: true })],
                }),
                ...pertemuan.asesmen.map((a) => new Paragraph({ text: `• ${a}` })),
                new Paragraph({ text: '' }),

                // Media & Alat
                new Paragraph({
                    children: [new TextRun({ text: 'Media & Alat:', bold: true })],
                }),
                new Paragraph({ text: pertemuan.mediaAlat.join(', ') }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '─'.repeat(50) })
            );
        });

        const doc = new Document({
            sections: [{ children }],
        });

        const blob = await Packer.toBlob(doc);
        const filename = `RPP_${this.data.mapelName}_Kelas${this.data.kelasLevel}_${Date.now()}.docx`;
        saveAs(blob, filename);
    }

}
