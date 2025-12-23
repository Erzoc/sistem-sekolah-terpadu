'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard,
  FileText,
  Calendar,
  BookOpen,
  Library,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['rpp']); // RPP expanded by default

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/guru',
      icon: LayoutDashboard,
      description: 'Overview & analytics'
    },
    {
      id: 'rpp',
      label: 'RPP & Perencanaan',
      href: '/guru/rpp',
      icon: FileText,
      description: 'Rencana pembelajaran',
      children: [
        { label: 'Kaldik', href: '/guru/rpp/kaldik', icon: Calendar },
        { label: 'Prota', href: '/guru/rpp/prota', icon: BookOpen },
        { label: 'Prosem', href: '/guru/rpp/prosem', icon: ClipboardList },
        { label: 'Library', href: '/guru/rpp/library', icon: Library },
      ]
    },
    {
      id: 'soal',
      label: 'Generator Soal',
      href: '/guru/soal',
      icon: ClipboardList,
      description: 'Buat soal otomatis'
    },
    {
      id: 'nilai',
      label: 'Input Nilai',
      href: '/guru/nilai',
      icon: BarChart3,
      description: 'Kelola nilai siswa'
    },
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/guru') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-gradient-to-b from-slate-900 to-slate-800 text-white
        flex flex-col transition-all duration-300 ease-in-out
        border-r border-slate-700
      `}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">GP</span>
              </div>
              <div>
                <h1 className="font-bold text-white">Teacher Toolbox</h1>
                <p className="text-xs text-slate-400">Workspace Guru</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              p-1.5 hover:bg-slate-700 rounded-lg transition-colors
              ${isCollapsed ? 'mx-auto' : ''}
            `}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.includes(item.id);

            return (
              <div key={item.id}>
                {/* Main Menu */}
                <div
                  className={`
                    flex items-center rounded-lg transition-all
                    ${active ? 'bg-purple-600' : 'hover:bg-slate-700'}
                  `}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 flex-1"
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-slate-400">{item.description}</div>
                      </div>
                    )}
                  </Link>
                  
                  {/* Expand button */}
                  {hasChildren && !isCollapsed && (
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className="p-2 hover:bg-slate-600 rounded-lg mr-2"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Submenu */}
                {hasChildren && isExpanded && !isCollapsed && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = pathname === child.href;
                      
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                            transition-colors
                            ${childActive 
                              ? 'bg-purple-500 text-white' 
                              : 'text-slate-300 hover:bg-slate-700'
                            }
                          `}
                        >
                          <ChildIcon className="w-4 h-4" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 space-y-1">
        <Link
          href="/guru/settings"
          className={`
            flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700
            transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Settings' : ''}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
        
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg
            text-red-400 hover:bg-red-500/10 transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Footer Version */}
      {!isCollapsed && (
        <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-700">
          Platform v1.0.0
        </div>
      )}
    </aside>
  );
}
