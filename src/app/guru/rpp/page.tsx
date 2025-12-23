'use client';

import { Calendar, BookOpen, ClipboardList, Library, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RppWorkspace() {
  const modules = [
    { title: 'Kaldik', description: 'Kelola kalender didik pembelajaran Anda', icon: Calendar, href: '/guru/rpp/kaldik', stats: { total: 12, active: 8, completed: 5 }, bgGradient: 'from-blue-50 to-blue-100', borderColor: 'border-blue-200', iconBg: 'bg-blue-500', textColor: 'text-blue-600' },
    { title: 'Prota', description: 'Kelola program tahunan pembelajaran', icon: BookOpen, href: '/guru/rpp/prota', stats: { total: 6, active: 4, completed: 3 }, bgGradient: 'from-green-50 to-green-100', borderColor: 'border-green-200', iconBg: 'bg-green-500', textColor: 'text-green-600' },
    { title: 'Prosem', description: 'Kelola program semester pembelajaran', icon: ClipboardList, href: '/guru/rpp/prosem', stats: { total: 24, active: 18, completed: 12 }, bgGradient: 'from-purple-50 to-purple-100', borderColor: 'border-purple-200', iconBg: 'bg-purple-500', textColor: 'text-purple-600' },
    { title: 'Library', description: 'Koleksi materi pembelajaran Anda', icon: Library, href: '/guru/rpp/library', stats: { total: 45, active: 32, completed: 28 }, bgGradient: 'from-orange-50 to-orange-100', borderColor: 'border-orange-200', iconBg: 'bg-orange-500', textColor: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/guru" className="hover:text-gray-900 font-semibold text-gray-900">Dashboard</Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">RPP Workspace</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">RPP Workspace</h1>
        <p className="text-gray-600 mt-1">Pilih modul perencanaan pembelajaran</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.title} href={module.href} className={`block bg-gradient-to-br ${module.bgGradient} rounded-xl border-2 ${module.borderColor} hover:shadow-lg group transition-all`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${module.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <ArrowRight className={`w-5 h-5 ${module.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200/50">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{module.stats.total}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${module.textColor}`}>{module.stats.active}</div>
                    <div className="text-xs text-gray-500">Aktif</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{module.stats.completed}</div>
                    <div className="text-xs text-gray-500">Selesai</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">Butuh bantuan memulai?</h3>
            <p className="text-sm text-gray-600 mb-3">Pelajari cara menggunakan setiap modul RPP dengan panduan lengkap kami</p>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Lihat Panduan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
