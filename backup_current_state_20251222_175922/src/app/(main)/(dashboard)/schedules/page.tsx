// src/app/(dashboard)/schedules/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DAY_NAMES = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function SchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/schedules?_t=' + Date.now());
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      if (!res.ok) {
        throw new Error('Response not OK: ' + res.status);
      }
      
      const text = await res.text();
      console.log('Response text (first 200 chars):', text.substring(0, 200));
      
      const data = JSON.parse(text);
      console.log('Parsed data:', data);
      
      if (data.success && Array.isArray(data.data)) {
        console.log('✅ Setting schedules:', data.data.length);
        setSchedules(data.data);
      }
    } catch (err: any) {
      console.error('❌ Fetch error:', err.message);
      alert('Error loading schedules: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <div>Loading schedules...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📅 Jadwal Pelajaran</h1>
        <div className="flex gap-3">
          <button
            onClick={() => fetchSchedules()}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => router.push('/schedules/import')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📊 Import
          </button>
          <button
            onClick={() => router.push('/schedules/create')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Tambah
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <strong>🐛 Debug Info:</strong>
        <div>Total schedules loaded: <strong>{schedules.length}</strong></div>
        <div>Loading state: {loading ? 'Yes' : 'No'}</div>
        <button 
          onClick={() => console.log('Current schedules:', schedules)}
          className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-sm"
        >
          Log Schedules to Console
        </button>
      </div>

      {/* Empty State */}
      {schedules.length === 0 ? (
        <div className="bg-white p-12 text-center rounded shadow">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">Tidak Ada Jadwal</h3>
          <p className="text-gray-600">API returned {schedules.length} schedules</p>
          <button
            onClick={() => router.push('/schedules/create')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
          >
            + Tambah Jadwal Pertama
          </button>
        </div>
      ) : (
        <>
          {/* Simple List View */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Kelas</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mata Pelajaran</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Guru</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Hari</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Waktu</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Ruangan</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {schedules.map((schedule, idx) => (
                  <tr key={schedule.scheduleId || idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {schedule.class?.className || schedule.classId}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {schedule.subject?.subjectName || schedule.subjectId}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {schedule.teacher?.fullName || schedule.teacherId}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {DAY_NAMES[schedule.dayOfWeek] || schedule.dayOfWeek}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {schedule.startTime} - {schedule.endTime}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {schedule.room || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/schedules/edit/${schedule.scheduleId}`)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm('Yakin hapus?')) return;
                            try {
                              const res = await fetch(`/api/schedules/${schedule.scheduleId}`, {
                                method: 'DELETE',
                              });
                              const data = await res.json();
                              if (data.success) {
                                alert('Berhasil dihapus!');
                                fetchSchedules();
                              } else {
                                alert('Gagal: ' + data.error);
                              }
                            } catch (err) {
                              alert('Error: ' + err);
                            }
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Success Message */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            ✅ Berhasil memuat {schedules.length} jadwal
          </div>
        </>
      )}
    </div>
  );
}
