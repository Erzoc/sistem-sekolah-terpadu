"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CogIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface SidebarGuruProps {
  onRppMenuClick?: () => void;
  isRppExpanded?: boolean;
}

export function SidebarGuru({ onRppMenuClick, isRppExpanded = false }: SidebarGuruProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard Guru",
      icon: HomeIcon,
      href: "/guru",
    },
    {
      id: "setup",
      label: "Setup Profil Sekolah",
      icon: CogIcon,
      href: "/guru/setup",
    },
    {
      id: "rpp",
      label: "RPP & Perencanaan",
      icon: BookOpenIcon,
      expandable: true,
      onClick: onRppMenuClick,
      isExpanded: isRppExpanded,
    },
    {
      id: "soal",
      label: "Generator Soal",
      icon: QuestionMarkCircleIcon,
      href: "/guru/soal",
    },
    {
      id: "nilai",
      label: "Input Nilai",
      icon: ChartBarIcon,
      href: "/guru/nilai",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Teacher Toolbox</h1>
        <p className="text-xs text-gray-500 mt-1">Workspace Guru</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <div key={item.id}>
              {item.expandable ? (
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isRppExpanded
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      isRppExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        <p>v1.0 Beta</p>
        <p>Teacher Toolbox © 2024</p>
      </div>
    </aside>
  );
}
