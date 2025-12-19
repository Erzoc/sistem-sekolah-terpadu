export default function SuperadminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <p className="text-purple-100 text-sm font-medium">Total Sekolah</p>
          <p className="text-4xl font-bold mt-2">5</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <p className="text-blue-100 text-sm font-medium">Total Admin</p>
          <p className="text-4xl font-bold mt-2">12</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <p className="text-green-100 text-sm font-medium">Total Guru</p>
          <p className="text-4xl font-bold mt-2">156</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
          <p className="text-orange-100 text-sm font-medium">Total Siswa</p>
          <p className="text-4xl font-bold mt-2">2,340</p>
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏫 Kelola Sekolah</h3>
          <p className="text-gray-600 text-sm mb-4">Manage semua sekolah dalam sistem</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition">
            Buka Management
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Kelola Users</h3>
          <p className="text-gray-600 text-sm mb-4">Manage admin, guru, dan siswa</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
            Buka Management
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Laporan Global</h3>
          <p className="text-gray-600 text-sm mb-4">Lihat laporan semua sekolah</p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition">
            Lihat Laporan
          </button>
        </div>
      </div>
    </div>
  );
}
