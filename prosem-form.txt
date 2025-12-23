'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface WeeklySchedule {
  weekNumber: number;
  weekLabel: string;
  dateRange: string;
  cpCode: string | null;
  cpName: string | null;
  materiPokok: string;
  isHoliday: boolean;
  holidayName?: string;
  allocatedHours?: number;
}

export default function ProsemGeneratorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const protaId = searchParams.get('protaId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!protaId) {
      setError('Prota ID tidak ditemukan. Silakan buat Prota dulu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/prosem/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ protaId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Gagal membuat Prosem');
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
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📅 Prosem Generator</h1>
        <p className="text-gray-600">Buat Program Semester dari Prota (Weekly Breakdown)</p>
        {protaId && (
          <p className="text-sm text-gray-500 mt-2">
            Prota ID: <span className="font-mono">{protaId}</span>
          </p>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && result ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">✓ Prosem Berhasil Dibuat!</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Minggu</p>
              <p className="text-2xl font-bold text-blue-600">{result.totalWeeks}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Minggu Efektif</p>
              <p className="text-2xl font-bold text-green-600">{result.effectiveWeeks}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Minggu Libur</p>
              <p className="text-2xl font-bold text-red-600">{result.holidayWeeks}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Minggu</th>
                  <th className="border p-2">Tanggal</th>
                  <th className="border p-2">Kode CP</th>
                  <th className="border p-2">Materi Pokok</th>
                  <th className="border p-2">JP</th>
                </tr>
              </thead>
              <tbody>
                {result.weeklySchedule.map((week: WeeklySchedule, i: number) => (
                  <tr key={i} className={week.isHoliday ? 'bg-red-50' : ''}>
                    <td className="border p-2 text-center">{week.weekLabel}</td>
                    <td className="border p-2 text-sm">{week.dateRange}</td>
                    <td className="border p-2 text-center font-mono text-xs">
                      {week.cpCode || '-'}
                    </td>
                    <td className="border p-2">
                      {week.isHoliday ? (
                        <span className="text-red-600 font-medium">{week.materiPokok}</span>
                      ) : (
                        week.materiPokok
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      {week.allocatedHours || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.push('/guru')}
              className="flex-1 px-4 py-2 border rounded-lg"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => router.push(`/guru/rpp/rpp?prosemId=${result.id}`)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Lanjut ke RPP →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Siap Generate Prosem?</h3>
            <p className="text-gray-600 mb-6">
              Prosem akan dibuat otomatis dari Prota dengan breakdown per minggu
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Prosem'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
