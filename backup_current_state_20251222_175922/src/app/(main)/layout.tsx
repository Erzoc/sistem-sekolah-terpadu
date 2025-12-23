'use client';

import { SessionProvider } from 'next-auth/react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-50">
        {children}
      </div>
    </SessionProvider>
  );
}
