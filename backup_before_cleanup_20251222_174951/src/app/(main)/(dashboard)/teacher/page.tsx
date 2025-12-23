'use client';

import { useSession } from 'next-auth/react';

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Dashboard Guru
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Selamat datang, {user?.name}
        </p>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Jadwal Hari Ini
        </h3>
        <div className="space-y-3">
          <ScheduleItem
            time="07:30 - 09:00"
            subject="Matematika"
            class="XII IPA 1"
            room="Ruang 201"
          />
          <ScheduleItem
            time="09:15 - 10:45"
            subject="Matematika"
            class="XII IPA 2"
            room="Ruang 201"
          />
          <ScheduleItem
            time="13:00 - 14:30"
            subject="Matematika"
            class="XI IPA 1"
            room="Ruang 203"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Input Absensi"
          description="Catat kehadiran siswa hari ini"
          icon="✅"
          href="/attendance"
        />
        <QuickActionCard
          title="Input Nilai"
          description="Entry nilai ujian dan tugas"
          icon="📝"
          href="/grades"
        />
        <QuickActionCard
          title="Jurnal Mengajar"
          description="Catat kegiatan pembelajaran"
          icon="📔"
          href="/journal"
        />
      </div>

      {/* Class List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Kelas yang Diampu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClassCard name="XII IPA 1" students={32} subject="Matematika" />
          <ClassCard name="XII IPA 2" students={30} subject="Matematika" />
          <ClassCard name="XI IPA 1" students={28} subject="Matematika" />
          <ClassCard name="XI IPA 2" students={29} subject="Matematika" />
        </div>
      </div>
    </div>
  );
}

function ScheduleItem({ time, subject, class: className, room }: any) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="text-sm font-medium text-indigo-600">{time}</div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{subject}</p>
          <p className="text-xs text-gray-500">{className} • {room}</p>
        </div>
      </div>
      <button className="text-sm text-indigo-600 hover:text-indigo-800">
        Detail →
      </button>
    </div>
  );
}

function QuickActionCard({ title, description, icon, href }: any) {
  return (
    <a
      href={href}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}

function ClassCard({ name, students, subject }: any) {
  return (
    <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
      <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
      <p className="text-sm text-gray-600 mt-1">{subject}</p>
      <p className="text-xs text-gray-500 mt-2">{students} siswa</p>
    </div>
  );
}
