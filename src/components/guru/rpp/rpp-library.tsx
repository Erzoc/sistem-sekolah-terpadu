'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RppItem {
  id: string;
  mapelName: string;
  kelasLevel: string;
  kelasDivision?: string;
  academicYear: string;
  semester: number;
  totalPertemuan: number;
  totalJamPelajaran: number;
  templateType: string;
  generationMethod: string;
  status: string;
  createdAt: string;
}

export default function RppLibrary() {
  const router = useRouter();
  const [rpps, setRpps] = useState<RppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRpps = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/guru/rpp/list');
      
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      
      const data = await response.json();
      console.log('RPP data:', data);
      
      if (data.success) {
        setRpps(data.data || []);
      } else {
        setError(data.error || 'Gagal memuat RPP');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRpps();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat library RPP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Library RPP</h1>
          <p className="text-gray-600 mt-2">Koleksi RPP yang sudah dibuat</p>
        </div>
        <button
          onClick={() => router.push('/guru/rpp/kaldik')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Buat RPP Baru
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {rpps.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h3 className="text-xl font-bold text-gray-700 mb-2">Belum Ada RPP</h3>
          <p className="text-gray-500 mb-6">Mulai buat RPP pertama Anda</p>
          <button
            onClick={() => router.push('/guru/rpp/kaldik')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Buat RPP Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rpps.map((rpp) => (
            <div key={rpp.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{rpp.mapelName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Kelas {rpp.kelasLevel}{rpp.kelasDivision || ''}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {rpp.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Pertemuan:</span>
                  <span className="font-medium">{rpp.totalPertemuan}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Jam Pelajaran:</span>
                  <span className="font-medium">{rpp.totalJamPelajaran} JP</span>
                </div>
                <div className="flex justify-between">
                  <span>Tahun Ajaran:</span>
                  <span className="font-medium">{rpp.academicYear}</span>
                </div>
                <div className="flex justify-between">
                  <span>Semester:</span>
                  <span className="font-medium">{rpp.semester}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                <button
                  onClick={() => router.push('/guru/rpp/view?id=' + rpp.id)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Lihat
                </button>
                <button
                  onClick={() => router.push('/guru/rpp/edit?id=' + rpp.id)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
