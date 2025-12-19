'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-6xl font-bold text-red-600">
            403
          </h2>
          <h3 className="mt-4 text-3xl font-bold text-gray-900">
            Akses Ditolak
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Anda tidak memiliki akses ke halaman ini.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => router.back()}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Kembali
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Jika Anda merasa ini adalah kesalahan,</p>
          <p>silakan hubungi administrator sistem.</p>
        </div>
      </div>
    </div>
  );
}
