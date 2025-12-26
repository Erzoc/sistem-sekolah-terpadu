'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RppExporter } from '@/lib/export/rpp-exporter';

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

export default function RppGeneratorForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prosemId = searchParams.get('prosemId');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [formData, setFormData] = useState({
        kelasLevel: '10',
        kelasDivision: 'A',
        templateType: 'merdeka',
        generationMethod: 'template',
    });
    const [aiProgress, setAiProgress] = useState<string>('');

    const handleGenerate = async () => {
        if (!prosemId) {
            setError('Prosem ID tidak ditemukan');
            return;
        }
        {
            aiProgress && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 font-medium">{aiProgress}</p>
                    <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '50%' }}></div>
                    </div>
                </div>
            )
        }

        setLoading(true);
        setError('');
        setAiProgress(''); // Reset progress

        try {
            // Show progress for AI method
            if (formData.generationMethod === 'ai') {
                setAiProgress('🤖 Memulai AI enhancement...');
            }

            const response = await fetch('/api/rpp/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prosemId,
                    ...formData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Gagal membuat RPP');
                setAiProgress('');
                return;
            }

            setResult(data.data);
            setSuccess(true);
            setAiProgress(''); // Clear progress
        } catch (err) {
            setError('Terjadi kesalahan. Coba lagi.');
            setAiProgress('');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">📝 RPP Generator</h1>
                <p className="text-gray-600">Generate Rencana Pelaksanaan Pembelajaran</p>
                {prosemId && (
                    <p className="text-sm text-gray-500 mt-2">
                        Prosem ID: <span className="font-mono">{prosemId}</span>
                    </p>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {success && result ? (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">✓ RPP Berhasil Dibuat!</h2>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600">Mata Pelajaran</p>
                                <p className="text-xl font-bold text-blue-600">{result.mapelName}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-gray-600">Kelas</p>
                                <p className="text-xl font-bold text-green-600">
                                    {result.kelasLevel} {result.kelasDivision}
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm text-gray-600">Total Pertemuan</p>
                                <p className="text-xl font-bold text-purple-600">{result.totalPertemuan}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pertemuan List */}
                    {result.pertemuanList.map((pertemuan: Pertemuan, i: number) => (
                        <div key={i} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">
                                    Pertemuan {pertemuan.pertemuanKe} - Minggu {pertemuan.weekNumber}
                                </h3>
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                    {pertemuan.alokasi} JP
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* CP */}
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Capaian Pembelajaran</p>
                                    <p className="font-medium">
                                        {pertemuan.cpCode} - {pertemuan.cpName}
                                    </p>
                                </div>

                                {/* Tujuan */}
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Tujuan Pembelajaran</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {pertemuan.tujuanPembelajaran.map((t, j) => (
                                            <li key={j}>{t}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Materi */}
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Materi Pokok</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {pertemuan.materiPokok.map((m, j) => (
                                            <li key={j}>{m}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Kegiatan */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 bg-yellow-50 rounded-lg">
                                        <p className="text-sm font-medium text-yellow-700 mb-2">Pendahuluan</p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            {pertemuan.kegiatanPembelajaran.pendahuluan.map((k, j) => (
                                                <li key={j}>{k}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <p className="text-sm font-medium text-green-700 mb-2">Inti</p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            {pertemuan.kegiatanPembelajaran.inti.map((k, j) => (
                                                <li key={j}>{k}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-medium text-blue-700 mb-2">Penutup</p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            {pertemuan.kegiatanPembelajaran.penutup.map((k, j) => (
                                                <li key={j}>{k}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Asesmen */}
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Asesmen</p>
                                    <div className="flex flex-wrap gap-2">
                                        {pertemuan.asesmen.map((a, j) => (
                                            <span key={j} className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Media */}
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Media & Alat</p>
                                    <div className="flex flex-wrap gap-2">
                                        {pertemuan.mediaAlat.map((m, j) => (
                                            <span key={j} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Actions */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <button
                                onClick={() => router.push('/guru/rpp/library')}
                                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                📚 Lihat Library RPP
                            </button>

                            <button
                                onClick={() => router.push('/guru')}
                                className="px-4 py-3 border rounded-lg hover:bg-gray-50"
                            >
                                ← Dashboard
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => {
                                    const exporter = new RppExporter({
                                        mapelName: result.mapelName,
                                        kelasLevel: result.kelasLevel,
                                        kelasDivision: result.kelasDivision,
                                        academicYear: '2025/2026',
                                        semester: 1,
                                        pertemuanList: result.pertemuanList,
                                        totalPertemuan: result.totalPertemuan,
                                        totalJamPelajaran: result.totalJamPelajaran,
                                    });
                                    exporter.exportToPDF();
                                }}
                                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                📄 Export PDF
                            </button>

                            <button
                                onClick={async () => {
                                    const exporter = new RppExporter({
                                        mapelName: result.mapelName,
                                        kelasLevel: result.kelasLevel,
                                        kelasDivision: result.kelasDivision,
                                        academicYear: '2025/2026',
                                        semester: 1,
                                        pertemuanList: result.pertemuanList,
                                        totalPertemuan: result.totalPertemuan,
                                        totalJamPelajaran: result.totalJamPelajaran,
                                    });
                                    await exporter.exportToDOCX();
                                }}
                                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                📝 Export DOCX
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Kelas Level <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.kelasLevel}
                                    onChange={(e) => setFormData({ ...formData, kelasLevel: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="10">Kelas 10</option>
                                    <option value="11">Kelas 11</option>
                                    <option value="12">Kelas 12</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Kelas Divisi</label>
                                <input
                                    type="text"
                                    value={formData.kelasDivision}
                                    onChange={(e) => setFormData({ ...formData, kelasDivision: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="A, B, IPA, IPS, dll"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Template Kurikulum</label>
                            <select
                                value={formData.templateType}
                                onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="merdeka">Kurikulum Merdeka</option>
                                <option value="k13">Kurikulum 2013</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Metode Generate</label>
                            <select
                                value={formData.generationMethod}
                                onChange={(e) => setFormData({ ...formData, generationMethod: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="template">Template (Cepat - Gratis)</option>
                                <option value="ai">AI-Enhanced (OpenAI - 5 pertemuan pertama)</option>
                                <option value="manual">Manual (Custom)</option>
                            </select>
                            {formData.generationMethod === 'ai' && (
                                <p className="text-sm text-yellow-600 mt-2">
                                    ⚠️ AI akan digunakan untuk 5 pertemuan pertama, sisanya menggunakan template.
                                </p>
                            )}
                        </div>


                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                        >
                            {loading ? 'Generating RPP...' : 'Generate RPP'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
