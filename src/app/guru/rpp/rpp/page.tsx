'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import RppGeneratorForm from '@/components/guru/rpp/rpp-generator-form';
import RppLibrary from '@/components/guru/rpp/rpp-library';
import { useState } from 'react';

export default function RppPage() {
  const searchParams = useSearchParams();
  const prosemId = searchParams.get('prosemId');
  const [view, setView] = useState<'create' | 'library'>('library');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/guru" className="hover:text-gray-900">Dashboard</Link>
        <span>/</span>
        <Link href="/guru/rpp" className="hover:text-gray-900">RPP Workspace</Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">RPP</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            Rencana Pelaksanaan Pembelajaran
          </h1>
          <p className="text-gray-600 mt-1">Langkah 4: Generate RPP dengan AI OpenRouter (Free) atau Manual</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setView('library')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'library'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          📚 Library
        </button>
        <button
          onClick={() => setView('create')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'create'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          ✨ Generate Baru
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {view === 'library' && <RppLibrary />}
        {view === 'create' && <RppGeneratorForm prosemId={prosemId} />}
      </div>
    </div>
  );
}
