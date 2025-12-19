'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/login' });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Logging out...
        </h2>
        <p className="mt-2 text-gray-600">
          Mohon tunggu sebentar
        </p>
      </div>
    </div>
  );
}
