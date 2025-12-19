export default function GuruDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-500 text-white rounded-lg shadow p-6">
          <p className="text-green-100 text-sm font-medium">Kelas Mengajar</p>
          <p className="text-3xl font-bold mt-1">5</p>
        </div>

        <div className="bg-blue-500 text-white rounded-lg shadow p-6">
          <p className="text-blue-100 text-sm font-medium">Total Siswa</p>
          <p className="text-3xl font-bold mt-1">150</p>
        </div>

        <div className="bg-orange-500 text-white rounded-lg shadow p-6">
          <p className="text-orange-100 text-sm font-medium">Tugas Pending</p>
          <p className="text-3xl font-bold mt-1">8</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
            <span className="text-3xl">📝</span>
            <span className="text-sm font-medium text-gray-700">Input Nilai</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
            <span className="text-3xl">📋</span>
            <span className="text-sm font-medium text-gray-700">Buat RPP</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
            <span className="text-3xl">👥</span>
            <span className="text-sm font-medium text-gray-700">Daftar Siswa</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
            <span className="text-3xl">📊</span>
            <span className="text-sm font-medium text-gray-700">Rekap Nilai</span>
          </button>
        </div>
      </div>

      {/* Kelas Hari Ini */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Jadwal Hari Ini</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Matematika - Kelas 10A</p>
              <p className="text-sm text-gray-600">07:00 - 08:30</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Selesai
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-500">
            <div>
              <p className="font-medium text-gray-900">Matematika - Kelas 10B</p>
              <p className="text-sm text-gray-600">10:00 - 11:30</p>
            </div>
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
              Sedang Berlangsung
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Matematika - Kelas 10C</p>
              <p className="text-sm text-gray-600">13:00 - 14:30</p>
            </div>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
              Akan Datang
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
