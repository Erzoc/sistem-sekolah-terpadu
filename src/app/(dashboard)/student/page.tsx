'use client';

import { useSession } from 'next-auth/react';

export default function StudentDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Dashboard Siswa
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Selamat datang, {user?.name}
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl">
            🎓
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-600">Kelas XII IPA 1</p>
            <p className="text-xs text-gray-500">NISN: 0012345678</p>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Jadwal Hari Ini
        </h3>
        <div className="space-y-3">
          <ClassSchedule time="07:30 - 09:00" subject="Matematika" teacher="Pak Budi" />
          <ClassSchedule time="09:15 - 10:45" subject="Fisika" teacher="Bu Ani" />
          <ClassSchedule time="11:00 - 12:30" subject="Kimia" teacher="Pak Joko" />
          <ClassSchedule time="13:00 - 14:30" subject="Bahasa Inggris" teacher="Ms. Sarah" />
        </div>
      </div>

      {/* Grades Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Nilai Rata-rata
          </h3>
          <div className="space-y-3">
            <GradeItem subject="Matematika" score={85} />
            <GradeItem subject="Fisika" score={88} />
            <GradeItem subject="Kimia" score={82} />
            <GradeItem subject="Bahasa Inggris" score={90} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Kehadiran
          </h3>
          <div className="text-center py-8">
            <div className="text-5xl font-bold text-green-600">95%</div>
            <p className="text-sm text-gray-600 mt-2">Tingkat Kehadiran</p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Hadir: 180 hari</p>
              <p>Sakit: 5 hari</p>
              <p>Izin: 3 hari</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassSchedule({ time, subject, teacher }: any) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="text-sm font-medium text-indigo-600">{time}</div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{subject}</p>
          <p className="text-xs text-gray-500">{teacher}</p>
        </div>
      </div>
    </div>
  );
}

function GradeItem({ subject, score }: any) {
  const getColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{subject}</span>
      <span className={`text-lg font-bold ${getColor(score)}`}>{score}</span>
    </div>
  );
}
