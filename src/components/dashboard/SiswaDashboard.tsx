export default function SiswaDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-500 text-white rounded-lg shadow p-6">
          <p className="text-yellow-100 text-sm font-medium">Mata Pelajaran</p>
          <p className="text-3xl font-bold mt-1">12</p>
        </div>

        <div className="bg-green-500 text-white rounded-lg shadow p-6">
          <p className="text-green-100 text-sm font-medium">Rata-rata Nilai</p>
          <p className="text-3xl font-bold mt-1">85</p>
        </div>

        <div className="bg-red-500 text-white rounded-lg shadow p-6">
          <p className="text-red-100 text-sm font-medium">Tugas Pending</p>
          <p className="text-3xl font-bold mt-1">3</p>
        </div>
      </div>

      {/* Jadwal Hari Ini */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Jadwal Hari Ini</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center min-w-[60px]">
              <p className="text-2xl font-bold text-gray-900">07:00</p>
              <p className="text-xs text-gray-600">08:30</p>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Matematika</p>
              <p className="text-sm text-gray-600">Pak Budi - Ruang 10A</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border-2 border-blue-500">
            <div className="text-center min-w-[60px]">
              <p className="text-2xl font-bold text-blue-600">10:00</p>
              <p className="text-xs text-blue-600">11:30</p>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Bahasa Indonesia</p>
              <p className="text-sm text-gray-600">Bu Siti - Ruang 10A</p>
            </div>
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
              Sekarang
            </span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center min-w-[60px]">
              <p className="text-2xl font-bold text-gray-900">13:00</p>
              <p className="text-xs text-gray-600">14:30</p>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Fisika</p>
              <p className="text-sm text-gray-600">Pak Ahmad - Lab Fisika</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tugas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Tugas Terbaru</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border-l-4 border-red-500 bg-red-50 rounded">
            <div>
              <p className="font-medium text-gray-900">Essay Bahasa Indonesia</p>
              <p className="text-sm text-gray-600">Deadline: Besok, 23:59</p>
            </div>
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
              Urgent
            </span>
          </div>

          <div className="flex items-center justify-between p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded">
            <div>
              <p className="font-medium text-gray-900">Soal Matematika Bab 5</p>
              <p className="text-sm text-gray-600">Deadline: 3 hari lagi</p>
            </div>
            <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
              Pending
            </span>
          </div>

          <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-50 rounded">
            <div>
              <p className="font-medium text-gray-900">Laporan Praktikum Fisika</p>
              <p className="text-sm text-gray-600">Sudah dikumpulkan</p>
            </div>
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              Done
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
