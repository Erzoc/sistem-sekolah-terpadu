"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SparklesIcon,
  CalendarIcon,
  DocumentChartBarIcon,
  ChartBarSquareIcon,
  BookmarkIcon, // ✅ Yang benar
} from "@heroicons/react/24/outline";

interface FeatureNavProps {
  isVisible?: boolean;
}

export function FeatureNav({ isVisible = false }: FeatureNavProps) {
  const pathname = usePathname();

  const rppMenuItems = [
    {
      id: "buat-rpp",
      label: "Buat RPP Baru",
      icon: SparklesIcon,
      href: "/guru/rpp/generator",
    },
    {
      id: "kaldik",
      label: "Kalender Pendidikan",
      icon: CalendarIcon,
      href: "/guru/rpp/kaldik",
    },
    {
      id: "prota",
      label: "Program Tahunan",
      icon: DocumentChartBarIcon,
      href: "/guru/rpp/prota",
    },
    {
      id: "prosem",
      label: "Program Semester",
      icon: ChartBarSquareIcon,
      href: "/guru/rpp/prosem",
    },
    {
      id: "library",
      label: "Library RPP Saya",
      icon: BookmarkIcon, // ✅ Changed from BookmarksIcon
      href: "/guru/rpp/library",
    },
  ];

  if (!isVisible) return null;

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto sticky top-0 flex flex-col shadow-xs">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-900">RPP Workspace</h2>
        <p className="text-xs text-gray-500 mt-1">Pilih Modul</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {rppMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white text-teal-700 border-l-2 border-teal-700"
                  : "text-gray-700 hover:bg-white hover:bg-opacity-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Info Box */}
      <div className="p-4 bg-teal-50 border-t border-gray-200 text-xs">
        <p className="text-gray-700 font-medium">💡 Tips:</p>
        <p className="text-gray-600 mt-2 leading-relaxed">
          Mulai dari Kaldik → Prota → Prosem → RPP untuk hasil maksimal.
        </p>
      </div>
    </aside>
  );
}
