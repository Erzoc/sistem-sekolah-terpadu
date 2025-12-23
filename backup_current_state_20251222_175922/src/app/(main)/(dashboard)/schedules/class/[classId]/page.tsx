// src/app/(dashboard)/schedules/class/[classId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScheduleGrid from '@/components/schedule/ScheduleGrid';

interface ClassScheduleData {
  class: {
    classId: string;
    className: string;
    level: string;
    capacity: number;
  };
  schedules: any[];
}

export default function ClassSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;
  
  const [data, setData] = useState<ClassScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (classId) {
      fetchClassSchedule();
    }
  }, [classId]);

  const fetchClassSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/schedules/class/${classId}`);
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError('Gagal memuat jadwal kelas');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Data tidak ditemukan'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Kembali
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Jadwal Kelas {data.class.className}
            </h1>
            <p className="text-gray-600 mt-1">
              {data.class.level} • Kapasitas: {data.class.capacity} siswa
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      {data.schedules.length > 0 ? (
        <ScheduleGrid schedules={data.schedules} />
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Belum Ada Jadwal
          </h3>
          <p className="text-gray-500">
            Kelas ini belum memiliki jadwal pelajaran
          </p>
        </div>
      )}

      {/* Summary */}
      {data.schedules.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Ringkasan</h3>
          <div className="text-sm text-gray-600">
            Total {data.schedules.length} jadwal pelajaran dalam seminggu
          </div>
        </div>
      )}
    </div>
  );
}
