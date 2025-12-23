'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import KaldikManualForm from '@/components/guru/kaldik/kaldik-form';

type ViewMode = 'form' | 'list';

export default function KaldikPage() {
  const [view, setView] = useState<ViewMode>('form');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/guru" className="hover:text-gray-900">Dashboard</Link>
        <span>/</span>
        <Link href="/guru/rpp" className="hover:text-gray-900">RPP Workspace</Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Kaldik</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            Kalender Didik
          </h1>
          <p className="text-gray-600 mt-1">Langkah 1: Setup Kalender Akademik → Prota → Prosem → RPP</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setView('form')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            view === 'form'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Plus className="w-5 h-5" />
          Input Kalender
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {view === 'form' && <KaldikManualForm />}
      </div>
    </div>
  );
}
