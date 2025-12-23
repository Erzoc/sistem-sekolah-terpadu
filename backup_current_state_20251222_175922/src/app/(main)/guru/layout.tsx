// src/app/(main)/guru/layout.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;

  const menuItems = [
    {
      icon: '🏠',
      label: 'Dashboard Guru',
      href: '/guru',
      active: pathname === '/guru',
    },
    {
      icon: '⚙️',
      label: 'Setup Profil Sekolah',
      href: '/guru/setup',
      active: pathname === '/guru/setup',
    },
    {
      icon: '📚',
      label: 'RPP & Perencanaan',
      href: '/guru/rpp',
      active: pathname?.startsWith('/guru/rpp'),
      submenu: [
        { label: 'Kalender Pendidikan', href: '/guru/rpp/kaldik' },
        { label: 'Program Tahunan', href: '/guru/rpp/prota' },
        { label: 'Program Semester', href: '/guru/rpp/prosem' },
        { label: 'Library RPP', href: '/guru/rpp/library' },
      ],
    },
    {
      icon: '❓',
      label: 'Generator Soal',
      href: '/guru/generator-soal',
      active: pathname === '/guru/generator-soal',
    },
    {
      icon: '📊',
      label: 'Input Nilai',
      href: '/guru/input-nilai',
      active: pathname === '/guru/input-nilai',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-teal-600">Teacher Toolbox</h1>
          <p className="text-sm text-gray-500 mt-1">Workspace Guru</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={index}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-teal-50 text-teal-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
              
              {/* Submenu */}
              {item.submenu && item.active && (
                <div className="ml-12 mt-2 space-y-1">
                  {item.submenu.map((subitem, subindex) => (
                    <Link
                      key={subindex}
                      href={subitem.href}
                      className={`block px-4 py-2 text-sm rounded-lg transition ${
                        pathname === subitem.href
                          ? 'bg-teal-50 text-teal-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>v1.0 Beta</p>
          <p>Teacher Toolbox © 2024</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Selamat Sore, Guru! 👋
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Senin, 22 Desember 2025
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || 'Demo Guru'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
