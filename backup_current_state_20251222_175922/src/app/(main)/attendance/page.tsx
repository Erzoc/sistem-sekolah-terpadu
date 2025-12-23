'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { attendanceConfig, formatDisplayDate, getTodayDate } from '@/lib/attendanceUtils';

interface AttendanceRecord {
  attendanceId: string;
  studentId: string;
  studentName: string;
  nisn: string;
  classId: string;
  className: string;
  attendanceDate: string;
  status: 'present' | 'absent' | 'sick' | 'permission';
  notes?: string;
  recordedAt: string;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    fetchAttendance();
    fetchClasses();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, search, classFilter, statusFilter, dateFrom, dateTo]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateFrom) params.append('startDate', dateFrom);
      if (dateTo) params.append('endDate', dateTo);
      if (classFilter) params.append('classId', classFilter);

      const res = await fetch(`/api/v1/attendance?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setRecords(data.data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/v1/classes');
      const data = await res.json();
      if (data.success) {
        setClasses(data.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const filterRecords = () => {
    let filtered = records;

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.studentName.toLowerCase().includes(search.toLowerCase()) ||
          r.nisn.includes(search)
      );
    }

    if (classFilter) {
      filtered = filtered.filter((r) => r.classId === classFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    setFilteredRecords(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus record ini?')) return;

    try {
      const res = await fetch(`/api/v1/attendance?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setRecords(records.filter((r) => r.attendanceId !== id));
      }
    } catch (error) {
      console.error('Error deleting attendance:', error);
    }
  };

  const getStatusConfig = (status: string) => {
    return attendanceConfig.statuses.find((s) => s.key === status);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading attendance data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📋 Absensi Siswa</h1>
            <p className="mt-2 text-gray-600">
              Total records: {filteredRecords.length}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/attendance/${getTodayDate()}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <CalendarIcon className="w-5 h-5" />
              Absensi Hari Ini
            </Link>
            <Link
              href="/attendance/reports"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              📊 Laporan
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Cari nama atau NISN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Kelas</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Status</option>
              {attendanceConfig.statuses.map((status) => (
                <option key={status.key} value={status.key}>
                  {status.label}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Dari tanggal"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Sampai tanggal"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Nama Siswa
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  NISN
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Kelas
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Catatan
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  const statusConfig = getStatusConfig(record.status);
                  return (
                    <tr
                      key={record.attendanceId}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDisplayDate(record.attendanceDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {record.studentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {record.nisn}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {record.className}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-medium"
                          style={{ backgroundColor: statusConfig?.color }}
                        >
                          {statusConfig?.emoji} {statusConfig?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {record.notes || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <Link
                          href={`/attendance/${record.attendanceDate}`}
                          className="p-2 hover:bg-blue-100 rounded transition"
                          title="View detail"
                        >
                          <EyeIcon className="w-5 h-5 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(record.attendanceId)}
                          className="p-2 hover:bg-red-100 rounded transition"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data absensi. Klik "Absensi Hari Ini" untuk mulai input.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
