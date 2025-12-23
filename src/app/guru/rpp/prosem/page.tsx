'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import ProsemGeneratorForm from '@/components/guru/prosem/prosem-generator-form';

export default function ProsemPage() {
  const searchParams = useSearchParams();
  const protaId = searchParams.get('protaId');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/guru" className="hover:text-gray-900">Dashboard</Link>
        <span>/</span>
        <Link href="/guru/rpp" className="hover:text-gray-900">RPP Workspace</Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Prosem</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            Program Semester
          </h1>
          <p className="text-gray-600 mt-1">Langkah 3: Breakdown Prota per Minggu</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProsemGeneratorForm protaId={protaId} />
      </div>
    </div>
  );
}
