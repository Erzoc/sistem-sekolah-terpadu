'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Competency {
  cpCode: string;
  cpName: string;
  allocatedWeeks?: number;
}

export default function ProtaGeneratorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const calendarId = searchParams.get('calendarId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    mapelCode: 'mtk',
    mapelName: 'Matematika',
    strategy: 'proportional',
  });

  const [cpList, setCpList] = useState<Competency[]>([
    { cpCode: 'CP-MAT-001', cpName: 'Bilangan Bulat' },
  ]);

  const [result, setResult] = useState<any>(null);

  const addCp = () => {
    setCpList([...cpList, { cpCode: '', cpName: '' }]);
  };

  const removeCp = (index: number) => {
    setCpList(cpList.filter((_, i) => i !== index));
  };

  const updateCp = (index: number, field: string, value: string) => {
    const updated = [...cpList];
    updated[index] = { ...updated[index], [field]: value };
    setCpList(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/prota/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simpleCalendarId: calendarId,
          mapelCode: formData.mapelCode,
          mapelName: formData.mapelName,
          cpList: cpList.filter((cp) => cp.cpCode && cp.cpName),
          strategy: formData.strategy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Gagal membuat Prota');
        return;
      }

      setResult(data.data);
      setSuccess(true);
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📊 Prota Generator</h1>
        <p className="text-gray-600">Buat Program Tahunan dari Kalender Akademik</p>
        {calendarId && (
          <p className="text-sm text-gray-500 mt-2">
            Calendar ID: <span className="font-mono">{calendarId}</span>
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Success Result */}
      {success && result ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">✓ Prota Berhasil Dibuat!</h2>
          
          <div className="mb-6">
            <p className="text-gray-600">
              <strong>Mata Pelajaran:</strong> {result.mapelName}
            </p>
            <p className="text-gray-600">
              <strong>Total Minggu:</strong> {result.totalWeeks} minggu
            </p>
            <p className="text-gray-600">
              <strong>Strategy:</strong> {result.strategy}
            </p>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Kode CP</th>
                <th className="border p-2 text-left">Nama CP/KD</th>
                <th className="border p-2 text-right">Minggu</th>
                <th className="border p-2 text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {result.competencies.map((cp: any, i: number) => (
                <tr key={i}>
                  <td className="border p-2 font-mono text-sm">{cp.cpCode}</td>
                  <td className="border p-2">{cp.cpName}</td>
                  <td className="border p-2 text-right">{cp.allocatedWeeks}</td>
                  <td className="border p-2 text-right">{cp.percentage?.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.push('/guru')}
              className="flex-1 px-4 py-2 border rounded-lg"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => router.push(`/guru/rpp/prosem?protaId=${result.id}`)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Lanjut ke Prosem →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Mapel */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Mata Pelajaran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.mapelName}
              onChange={(e) => setFormData({ ...formData, mapelName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Matematika"
            />
          </div>

          {/* Strategy */}
          <div>
            <label className="block text-sm font-medium mb-2">Strategy Alokasi</label>
            <select
              value={formData.strategy}
              onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="proportional">Proportional (otomatis merata)</option>
              <option value="linear">Linear (sama rata)</option>
            </select>
          </div>

          {/* CP/KD List */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Daftar CP/KD <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {cpList.map((cp, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={cp.cpCode}
                    onChange={(e) => updateCp(i, 'cpCode', e.target.value)}
                    placeholder="CP-MAT-001"
                    className="w-1/3 px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={cp.cpName}
                    onChange={(e) => updateCp(i, 'cpName', e.target.value)}
                    placeholder="Nama CP/KD"
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <button
                    onClick={() => removeCp(i)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addCp}
              className="mt-3 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              + Tambah CP/KD
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Prota'}
          </button>
        </div>
      )}
    </div>
  );
}
