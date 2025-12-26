'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TicketIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2,
  Settings,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  {
    href: '/superadmin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Ringkasan & statistik'
  },
  {
    href: '/superadmin/users', 
    label: 'Manajemen User',
    icon: Users,
    description: 'Kelola semua pengguna'
  },

  {
    href: '/superadmin/setup-sekolah',
    label: 'Setup Sekolah',
    icon: Building2,
    description: 'Konfigurasi profil sekolah'
  },
  {
  label: 'Kode Undangan',
  href: '/superadmin/invites',
  icon: TicketIcon,
},
  {
    href: '/superadmin/tenants',
    label: 'Tenant',
    icon: Building2,
    description: 'Organisasi sekolah'
  },
  {
    href: '/superadmin/analytics',
    label: 'Analitik',
    icon: BarChart3,
    description: 'Metrik platform'
  },
  {
    href: '/superadmin/settings',
    label: 'Pengaturan Sistem', 
    icon: Settings,
    description: 'Konfigurasi platform'
  },
];


export default function SuperAdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={`
        relative flex flex-col bg-gray-900 text-white border-r border-gray-800
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">SuperAdmin</h2>
              <p className="text-xs text-gray-400">GuruPintar</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-150
                    ${isActive 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 text-center">
            Platform v1.0.0
          </div>
        </div>
      )}
    </aside>
  );
}
