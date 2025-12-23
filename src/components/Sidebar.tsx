'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Guru', href: '/teachers', icon: UserGroupIcon },
  { name: 'Siswa', href: '/students', icon: AcademicCapIcon },
  { name: 'Kelas', href: '/classes', icon: BuildingOfficeIcon },
  { name: 'Mata Pelajaran', href: '/subjects', icon: BookOpenIcon },
  { name: 'Absensi', href: '/attendance', icon: CheckCircleIcon },
  { name: 'Jadwal', href: '/schedules', icon: CalendarIcon }, // ← TAMBAHKAN INI
  { name: 'Penugasan Guru', href: '/teacher-assignments', icon: ClipboardDocumentListIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col fixed top-0 left-0 h-screen z-20">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          🎓 SST v1
        </h1>
        <p className="text-xs text-gray-400 mt-1">School Super Tools</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-400">Madrasah Edition - v1.0.0</p>
        <p className="text-xs text-gray-500 mt-1">© 2026 Sistem Sekolah Terpadu</p>
      </div>
    </aside>
  );
}
