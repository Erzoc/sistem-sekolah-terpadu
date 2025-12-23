'use client';

import Link from 'next/link';
import { Library, Plus, Filter } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/guru" className="hover:text-gray-900 font-semibold text-gray-900">Dashboard</Link>
        <span>/</span>
        <Link href="/guru/rpp" className="hover:text-gray-900">RPP Workspace</Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Library</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Library className="w-6 h-6 text-orange-600" />
            </div>
            Library Pembelajaran
          </h1>
          <p className="text-gray-600 mt-1">Kelola koleksi materi pembelajaran Anda</p>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Tambah Materi
        </button>
      </div>

      <div className="flex gap-4">
        <input type="text" placeholder="Cari materi..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /></button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Library className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Library Kosong</h3>
        <p className="text-gray-600 mb-6">Mulai tambahkan materi pembelajaran ke library Anda</p>
        <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">Tambah Materi Pertama</button>
      </div>
    </div>
  );
}
