// src/app/(main)/(dashboard)/teacher/page.tsx
// AUTO-GENERATED REDIRECT TO /guru
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/guru');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
