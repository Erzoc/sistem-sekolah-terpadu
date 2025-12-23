'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import ProtageneratorForm from '@/components/guru/prota/prota-generator-form';

export default function ProtaPage() {
  const searchParams = useSearchParams();
  const calendarId = searchParams.get('calendarId');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/guru" className="hover:text-gray-900">Dashboard</Link>
        <span>/</span>
        <Link href="/guru/rpp" className="hover:text-gray-900">RPP Workspace</Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Prota</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            Program Tahunan
          </h1>
          <p className="text-gray-600 mt-1">Langkah 2: Breakdown Kompetensi Dasar per Tahun</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProtageneratorForm calendarId={calendarId} />
      </div>
    </div>
  );
}
