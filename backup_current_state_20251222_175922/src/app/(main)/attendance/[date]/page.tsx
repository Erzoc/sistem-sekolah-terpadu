'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { attendanceConfig, formatDisplayDate } from '@/lib/attendanceUtils';

interface Student {
  studentId: string;
  nisn: string;
  fullName: string;
  classId: string;
  className: string;
}

interface AttendanceEntry {
  studentId: string;
  status: 'present' | 'absent' | 'sick' | 'permission';
  notes?: string;
}

export default function DailyAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceEntry>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classFilter, setClassFilter] = useState('');
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, classesRes] = await Promise.all([
        fetch('/api/v1/students'),
        fetch('/api/v1/classes'),
      ]);

      const [studentsData, classesData] = await Promise.all([
        studentsRes.json(),
        classesRes.json(),
      ]);

      if (studentsData.success) {
        setStudents(studentsData.data);
      }
      if (classesData.success) {
        setClasses(classesData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (
    studentId: string,
    status: 'present' | 'absent' | 'sick' | 'permission',
    notes?: string
  ) => {
    const newAttendance = new Map(attendance);
    newAttendance.set(studentId, { studentId, status, notes });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    if (attendance.size === 0) {
      alert('Belum ada data absensi yang diinput');
      return;
    }

    setSaving(true);
    try {
      const records = Array.from(attendance.values()).map((entry) => {
        const student = students.find((s) => s.studentId === entry.studentId);
        return {
          ...entry,
          studentName: student?.fullName || '',
          nisn: student?.nisn || '',
          classId: student?.classId || classFilter,
          className: student?.className || '',
          attendanceDate: date,
          academicYearId: '2024/2025',
          tenantId: 'default',
        };
      });

      const res = await fetch('/api/v1/attendance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Berhasil simpan ${data.successCount} absensi`);
        router.push('/attendance');
      } else {
        alert('Gagal menyimpan absensi');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error menyimpan absensi');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents =
    classFilter && classFilter !== ''
      ? students.filter((s) => s.classId === classFilter)
      : students;

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            📋 Absensi - {formatDisplayDate(date)}
          </h1>
          <p className="mt-2 text-gray-600">
            Input absensi siswa untuk tanggal ini
          </p>
        </div>

        {/* Class Filter */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Kelas
          </label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-1/3"
          >
            <option value="">-- Semua Kelas --</option>
            {classes.map((cls) => (
              <option key={cls.classId} value={cls.classId}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid gap-4">
            {filteredStudents.map((student) => {
              const entry = attendance.get(student.studentId);
              const selectedStatus = entry?.status || '';

              return (
                <div
                  key={student.studentId}
                  className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{student.fullName}</p>
                    <p className="text-sm text-gray-600">{student.nisn} - {student.className}</p>
                  </div>

                  <div className="flex gap-2">
                    {attendanceConfig.statuses.map((status) => (
                      <button
                        key={status.key}
                        onClick={() =>
                          handleAttendanceChange(
                            student.studentId,
                            status.key as any,
                            ''
                          )
                        }
                        className={`px-4 py-2 rounded-lg transition font-medium text-sm flex items-center gap-2 ${
                          selectedStatus === status.key
                            ? `${status.bgColor} border-2 border-gray-800`
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {status.emoji} {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            Tidak ada siswa. Pilih kelas terlebih dahulu.
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || attendance.size === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
          >
            {saving ? 'Menyimpan...' : `Simpan Absensi (${attendance.size})`}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
