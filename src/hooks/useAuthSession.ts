'use client';

import { useSession, useRouter } from 'next-auth/react';
import { useEffect } from 'react';

export function useAuthSession(redirectTo: string = '/login') {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [status, router, redirectTo]);

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
    tenantId: (session?.user as any)?.tenantId,
  };
}
