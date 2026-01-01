// src/app/rpp-generate/page.tsx
'use client';

import { useState } from 'react';

export default function RPPGeneratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    guruId: 'test-guru-123',
    jenjang: 'SMA',
    kelas: 10,
    semester: 1,
    mataPelajaran: 'Matematika',
    topik: '',
    subTopik: '',
    jp: 2,
    tahunAjaran: '2025/2026',
    metodePembelajaran: [] as string[],
    mediaPembelajaran: [] as string[],
    sumberBelajar: [] as string[],
    jenisPenilaian: [] as string[],
  });

  const metodeOptions = [
    'Discovery Learning',
    'Problem Based Learning',
    'Project Based Learning',
    'Inquiry Learning',
    'Diskusi Kelompok',
    'Ceramah Interaktif',
  ];

  const mediaOptions = [
    'PPT',
    'Video',
    'Worksheet',
    'Whiteboard',
    'Aplikasi/Software',
    'Internet',
  ];

  const sumberOptions = [
    'Buku Paket',
    'Modul',
    'Internet',
    'Video Pembelajaran',
    'Jurnal',
  ];

  const penilaianOptions = [
    'Tes Tulis',
    'Tes Lisan',
    'Observasi',
    'Praktik',
    'Portofolio',
    'Presentasi',
  ];

  const handleCheckbox = (field: string, value: string) => {
    const current = formData[field as keyof typeof formData] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topik) {
      setError('Topik wajib diisi!');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/rpp/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Gagal generate RPP');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Generate RPP dengan AI
        </h1>
        <p className="text-gray-600 mb-8">
          Isi form di bawah untuk generate RPP otomatis dengan AI
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenjang
              </label>
              <select
                value={formData.jenjang}
                onChange={e => setFormData({ ...formData, jenjang: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>SMA</option>
                <option>MA</option>
                <option>SMK</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kelas
              </label>
              <select
                value={formData.kelas}
                onChange={e => setFormData({ ...formData, kelas: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={e => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={1}>1 (Ganjil)</option>
                <option value={2}>2 (Genap)</option>
              </select>
            </div>
          </div>

          {/* Mata Pelajaran & Topik */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mata Pelajaran
              </label>
              <input
                type="text"
                value={formData.mataPelajaran}
                onChange={e => setFormData({ ...formData, mataPelajaran: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g. Matematika"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                JP (Jam Pelajaran)
              </label>
              <input
                type="number"
                value={formData.jp}
                onChange={e => setFormData({ ...formData, jp: Number(e.target.value) })}
                min={1}
                max={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topik <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.topik}
              onChange={e => setFormData({ ...formData, topik: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. Fungsi Linear"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Topik (opsional)
            </label>
            <input
              type="text"
              value={formData.subTopik}
              onChange={e => setFormData({ ...formData, subTopik: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. Grafik Fungsi Linear"
            />
          </div>

          {/* Metode Pembelajaran */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metode Pembelajaran
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {metodeOptions.map(opt => (
                <label key={opt} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.metodePembelajaran.includes(opt)}
                    onChange={() => handleCheckbox('metodePembelajaran', opt)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Media Pembelajaran */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Pembelajaran
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {mediaOptions.map(opt => (
                <label key={opt} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.mediaPembelajaran.includes(opt)}
                    onChange={() => handleCheckbox('mediaPembelajaran', opt)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sumber Belajar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sumber Belajar
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sumberOptions.map(opt => (
                <label key={opt} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.sumberBelajar.includes(opt)}
                    onChange={() => handleCheckbox('sumberBelajar', opt)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Jenis Penilaian */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Penilaian
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {penilaianOptions.map(opt => (
                <label key={opt} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.jenisPenilaian.includes(opt)}
                    onChange={() => handleCheckbox('jenisPenilaian', opt)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Generating RPP...' : '🚀 Generate RPP'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✅ RPP Berhasil Dibuat!
            </h2>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {result.id}</p>
              <p><strong>Topik:</strong> {result.topik}</p>
              <p><strong>Status:</strong> {result.status}</p>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 font-medium">
                Lihat Detail RPP
              </summary>
              <pre className="mt-4 p-4 bg-gray-50 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
