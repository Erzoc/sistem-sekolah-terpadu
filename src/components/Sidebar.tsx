"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface MenuItem {
  name: string;
  href: string;
  icon: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: "🏠", roles: ["superadmin", "admin", "guru", "siswa"] },
  { name: "Kelola Sekolah", href: "/schools", icon: "🏫", roles: ["superadmin"] },
  { name: "Kelola Users", href: "/users", icon: "👥", roles: ["superadmin", "admin"] },
  { name: "Data Guru", href: "/teachers", icon: "👨‍🏫", roles: ["superadmin", "admin"] },
  { name: "Data Siswa", href: "/students", icon: "🎓", roles: ["superadmin", "admin", "guru"] },
  { name: "Kelas", href: "/classes", icon: "📚", roles: ["superadmin", "admin", "guru"] },
  { name: "Mata Pelajaran", href: "/subjects", icon: "📖", roles: ["superadmin", "admin"] },
  { name: "Input Nilai", href: "/grades", icon: "📝", roles: ["guru"] },
  { name: "Buat RPP", href: "/rpp", icon: "📋", roles: ["guru"] },
  { name: "Jadwal", href: "/schedule", icon: "📅", roles: ["guru", "siswa"] },
  { name: "Nilai Saya", href: "/my-grades", icon: "📊", roles: ["siswa"] },
  { name: "Tugas", href: "/assignments", icon: "📝", roles: ["siswa"] },
  { name: "Laporan", href: "/reports", icon: "📈", roles: ["superadmin", "admin"] },
  { name: "Pengaturan", href: "/settings", icon: "⚙️", roles: ["superadmin", "admin", "guru", "siswa"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  // Filter menu based on role
  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">SSTF</h2>
        <p className="text-xs text-gray-500">Sistem Sekolah Terpadu</p>
      </div>

      <nav className="px-2 pb-4">
        {filteredMenu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
