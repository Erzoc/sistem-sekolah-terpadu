'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RppExporter } from '@/lib/export/rpp-exporter';

export default function RppViewPage() {
  const router = useRouter();
  const params = useParams();
  const rppId = params.id as string;

  const [rpp, setRpp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRpp();
  }, [rppId]);

  const loadRpp = async () => {
  try {
    console.log('[View] Loading RPP:', rppId);
    
    const response = await fetch(`/api/rpp/view?id=${rppId}`);
    
    console.log('[View] Response status:', response.status);
    
    if (!response.ok) {
      console.error('[View] Response not OK:', response.statusText);
      setLoading(false);
      return;
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('[View] Response not JSON:', contentType);
      setLoading(false);
      return;
    }
    
    const data = await response.json();
    console.log('[View] Data received:', data.success);

    if (data.success) {
      setRpp(data.data);
    } else {
      console.error('[View] API error:', data.error);
    }
  } catch (error) {
    console.error('[View] Load error:', error);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading RPP...</p>
      </div>
    );
  }

  if (!rpp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">RPP tidak ditemukan</p>
          <button
            onClick={() => router.push('/guru/rpp/library')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            ← Kembali ke Library
          </button>
        </div>
      </div>
    );
  }

  const pertemuanList = JSON.parse(rpp.pertemuanListJson);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Same display as generator result - reuse the pertemuan cards */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{rpp.mapelName} - Kelas {rpp.kelasLevel}{rpp.kelasDivision}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/guru/rpp/library')}
            className="px-4 py-2 border rounded-lg"
          >
            ← Library
          </button>
          <button
            onClick={() => {
              const exporter = new RppExporter({
                mapelName: rpp.mapelName,
                kelasLevel: rpp.kelasLevel,
                kelasDivision: rpp.kelasDivision,
                academicYear: rpp.academicYear,
                semester: rpp.semester,
                pertemuanList,
                totalPertemuan: rpp.totalPertemuan,
                totalJamPelajaran: rpp.totalJamPelajaran,
              });
              exporter.exportToPDF();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            📄 PDF
          </button>
          <button
            onClick={async () => {
              const exporter = new RppExporter({
                mapelName: rpp.mapelName,
                kelasLevel: rpp.kelasLevel,
                kelasDivision: rpp.kelasDivision,
                academicYear: rpp.academicYear,
                semester: rpp.semester,
                pertemuanList,
                totalPertemuan: rpp.totalPertemuan,
                totalJamPelajaran: rpp.totalJamPelajaran,
              });
              await exporter.exportToDOCX();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            📝 DOCX
          </button>
        </div>
      </div>

      {/* Display pertemuan list - copy from generator component */}
      <div className="space-y-6">
        {pertemuanList.map((pertemuan: any, i: number) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6">
            {/* Same card structure as generator result */}
            <h3 className="text-xl font-bold mb-4">
              Pertemuan {pertemuan.pertemuanKe} - {pertemuan.cpName}
            </h3>
            {/* ... rest of pertemuan display ... */}
          </div>
        ))}
      </div>
    </div>
  );
}
