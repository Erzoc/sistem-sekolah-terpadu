"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard SSTF
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Selamat Datang, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Anda login sebagai <span className="font-semibold text-blue-600 uppercase">{user?.role}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-500 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Guru</p>
                <p className="text-3xl font-bold mt-1">24</p>
              </div>
              <div className="text-4xl">👨‍🏫</div>
            </div>
          </div>

          <div className="bg-green-500 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Siswa</p>
                <p className="text-3xl font-bold mt-1">320</p>
              </div>
              <div className="text-4xl">🎓</div>
            </div>
          </div>

          <div className="bg-purple-500 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Kelas</p>
                <p className="text-3xl font-bold mt-1">12</p>
              </div>
              <div className="text-4xl">🏫</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <span className="text-3xl">📝</span>
              <span className="text-sm font-medium text-gray-700">Input Nilai</span>
            </button>
            
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <span className="text-3xl">📊</span>
              <span className="text-sm font-medium text-gray-700">Laporan</span>
            </button>
            
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <span className="text-3xl">👥</span>
              <span className="text-sm font-medium text-gray-700">Data Siswa</span>
            </button>
            
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <span className="text-3xl">⚙️</span>
              <span className="text-sm font-medium text-gray-700">Pengaturan</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
