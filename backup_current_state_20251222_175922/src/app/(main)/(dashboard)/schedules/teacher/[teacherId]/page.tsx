// src/app/(dashboard)/schedules/teacher/[teacherId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScheduleGrid from '@/components/schedule/ScheduleGrid';

interface TeacherScheduleData {
  teacher: {
    teacherId: string;
    fullName: string;
    nip: string;
    position: string;
  };
  schedules: any[];
}

export default function TeacherSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.teacherId as string;
  
  const [data, setData] = useState<TeacherScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (teacherId) {
      fetchTeacherSchedule();
    }
  }, [teacherId]);

  const fetchTeacherSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/schedules/teacher/${teacherId}`);
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError('Gagal memuat jadwal guru');
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
              Jadwal Mengajar {data.teacher.fullName}
            </h1>
            <p className="text-gray-600 mt-1">
              NIP: {data.teacher.nip} • {data.teacher.position}
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
            Guru ini belum memiliki jadwal mengajar
          </p>
        </div>
      )}

      {/* Summary */}
      {data.schedules.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Total Jadwal</h3>
            <div className="text-3xl font-bold text-blue-600">
              {data.schedules.length}
            </div>
            <div className="text-sm text-gray-500">jam mengajar per minggu</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Kelas Diajar</h3>
            <div className="text-3xl font-bold text-green-600">
              {new Set(data.schedules.map(s => s.classId)).size}
            </div>
            <div className="text-sm text-gray-500">kelas berbeda</div>
          </div>
        </div>
      )}
    </div>
  );
}
