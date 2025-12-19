export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Guru</p>
              <p className="text-3xl font-bold mt-1">24</p>
            </div>
            <div className="text-4xl">👨‍🏫</div>
          </div>
        </div>

        <div className="bg-green-500 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Siswa</p>
              <p className="text-3xl font-bold mt-1">320</p>
            </div>
            <div className="text-4xl">🎓</div>
          </div>
        </div>

        <div className="bg-purple-500 text-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Kelas</p>
              <p className="text-3xl font-bold mt-1">12</p>
            </div>
            <div className="text-4xl">🏫</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
            <span className="text-3xl">👨‍🏫</span>
            <span className="text-sm font-medium text-gray-700">Tambah Guru</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
            <span className="text-3xl">🎓</span>
            <span className="text-sm font-medium text-gray-700">Tambah Siswa</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
            <span className="text-3xl">📚</span>
            <span className="text-sm font-medium text-gray-700">Kelola Kelas</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
            <span className="text-3xl">📊</span>
            <span className="text-sm font-medium text-gray-700">Laporan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
