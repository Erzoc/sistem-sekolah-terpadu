'use client';

import { useSession } from 'next-auth/react';

export default function SchoolAdminDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          School Admin Dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Selamat datang, {user?.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Guru" value="45" icon="👨‍🏫" color="bg-blue-500" />
        <StatCard title="Total Siswa" value="890" icon="🎓" color="bg-green-500" />
        <StatCard title="Total Kelas" value="28" icon="🏫" color="bg-purple-500" />
        <StatCard title="Mata Pelajaran" value="15" icon="📚" color="bg-orange-500" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Manajemen Data
          </h3>
          <div className="space-y-2">
            <MenuLink label="Kelola Guru" href="/teacher" />
            <MenuLink label="Kelola Siswa" href="/student" />
            <MenuLink label="Kelola Kelas" href="/classes" />
            <MenuLink label="Mata Pelajaran" href="/subjects" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Laporan
          </h3>
          <div className="space-y-2">
            <MenuLink label="Absensi" href="/attendance" />
            <MenuLink label="Nilai" href="/grades" />
            <MenuLink label="Rapor" href="/reports" />
            <MenuLink label="Statistik" href="/statistics" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function MenuLink({ label, href }: any) {
  return (
    <a
      href={href}
      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
    >
      {label} →
    </a>
  );
}
