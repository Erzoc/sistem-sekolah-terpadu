'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AttendanceReport {
  studentId: string;
  studentName: string;
  nisn: string;
  presentCount: number;
  absentCount: number;
  sickCount: number;
  permissionCount: number;
  totalRecords: number;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

export default function AttendanceReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [studentReports, setStudentReports] = useState<AttendanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
    fetchClasses();
  }, [classFilter, dateFrom, dateTo]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('type', 'summary');
      if (classFilter) params.append('classId', classFilter);
      if (dateFrom) params.append('startDate', dateFrom);
      if (dateTo) params.append('endDate', dateTo);

      const res = await fetch(`/api/v1/attendance/reports?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setReport(data.data);

        // Fetch student-level reports
        const studentParams = new URLSearchParams();
        studentParams.append('type', 'student');
        if (classFilter) studentParams.append('classId', classFilter);
        if (dateFrom) studentParams.append('startDate', dateFrom);
        if (dateTo) studentParams.append('endDate', dateTo);

        const studentRes = await fetch(
          `/api/v1/attendance/reports?${studentParams.toString()}`
        );
        const studentData = await studentRes.json();

        if (studentData.success) {
          setStudentReports(studentData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
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

  const chartData = report ? [
    { name: 'Hadir', value: report.presentCount, color: '#10b981' },
    { name: 'Tidak Hadir', value: report.absentCount, color: '#ef4444' },
    { name: 'Sakit', value: report.sickCount, color: '#f59e0b' },
    { name: 'Izin', value: report.permissionCount, color: '#3b82f6' },
  ].filter((d) => d.value > 0) : [];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📊 Laporan Absensi
        </h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Semua Kelas</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Summary Cards */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <p className="text-gray-600 text-sm">Total Hadir</p>
              <p className="text-3xl font-bold text-green-600">
                {report.presentCount || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {report.presentPercentage || 0}% dari total
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
              <p className="text-gray-600 text-sm">Total Tidak Hadir</p>
              <p className="text-3xl font-bold text-red-600">
                {report.absentCount || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {report.absentPercentage || 0}% dari total
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <p className="text-gray-600 text-sm">Total Sakit</p>
              <p className="text-3xl font-bold text-yellow-600">
                {report.sickCount || 0}
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm">Total Izin</p>
              <p className="text-3xl font-bold text-blue-600">
                {report.permissionCount || 0}
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Distribusi Absensi</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Students */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Top 5 Siswa Terbaik</h2>
              <div className="space-y-2">
                {studentReports.length > 0 ? (
                  studentReports
                    .sort(
                      (a, b) =>
                        (b.presentCount / b.totalRecords) -
                        (a.presentCount / a.totalRecords)
                    )
                    .slice(0, 5)
                    .map((student, idx) => (
                      <div key={student.studentId} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">
                          {idx + 1}. {student.studentName}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {student.presentCount}/{student.totalRecords} ({student.totalRecords > 0 ? Math.round((student.presentCount / student.totalRecords) * 100) : 0}%)
                        </span>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-sm">Belum ada data</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Student Detail Table */}
        {studentReports.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Nama Siswa
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    NISN
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Hadir
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Tidak Hadir
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Sakit
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Izin
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentReports.map((student) => (
                  <tr key={student.studentId} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {student.studentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.nisn}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">
                      {student.presentCount}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-red-600 font-medium">
                      {student.absentCount}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-yellow-600 font-medium">
                      {student.sickCount}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-blue-600 font-medium">
                      {student.permissionCount}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 font-medium">
                      {student.totalRecords}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {chartData.length === 0 && studentReports.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-500">Belum ada data absensi untuk ditampilkan</p>
            <p className="text-sm text-gray-400 mt-2">Mulai input absensi untuk melihat laporan</p>
          </div>
        )}
      </div>
    </div>
  );
}
