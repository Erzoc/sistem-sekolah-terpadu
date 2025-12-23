'use client';

import { useRouter } from 'next/navigation';

export default function GuruDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard Guru</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kaldik Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Kalender Akademik</h3>
            <p className="text-gray-600 text-sm mb-4">Input kalender akademik untuk membuat Prota</p>
            <button
              onClick={() => router.push('/guru/rpp/kaldik')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Buat Kaldik →
            </button>
          </div>

          {/* RPP Library Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Library RPP</h3>
            <p className="text-gray-600 text-sm mb-4">Lihat koleksi RPP yang sudah dibuat</p>
            <button
              onClick={() => router.push('/guru/rpp/library')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Lihat Library →
            </button>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Semua Dokumen</h3>
            <p className="text-gray-600 text-sm mb-4">Kaldik, Prota, Prosem, RPP</p>
            <button
              onClick={() => router.push('/guru/documents')}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Lihat Semua →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/guru/rpp/kaldik')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              📅 Buat Kaldik Baru
            </button>
            <button
              onClick={() => router.push('/guru/rpp/library')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              📚 Library RPP
            </button>
            <button
              onClick={() => router.push('/guru/documents')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              📄 Semua Dokumen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
