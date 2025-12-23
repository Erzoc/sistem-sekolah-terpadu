'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">
          {user.name || 'Guru'}
        </h2>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </header>
  );
}
