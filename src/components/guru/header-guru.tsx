"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface HeaderGuruProps {
  schoolName?: string;
}

export function HeaderGuru({ schoolName }: HeaderGuruProps) {
  const { data: session } = useSession();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 19) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-8 py-6 flex items-center justify-between">
        {/* Left: Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {session?.user?.name || "Guru"}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {schoolName && `${schoolName} • `}
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Right: User Profile */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
          <UserCircleIcon className="w-10 h-10 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
