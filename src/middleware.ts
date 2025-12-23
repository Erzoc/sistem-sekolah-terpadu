import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // No custom logic needed for now
    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
  }
);

// IMPORTANT: Protect routes, but DON'T block /api/auth!
export const config = {
  matcher: [
    // Protect these routes
    '/guru/:path*',
    '/admin/:path*',
    '/teacher/:path*',
    
    // Protect API (but exclude /api/auth)
    '/api/school-profile/:path*',
    
    // DON'T match /api/auth - NextAuth needs it!
  ],
};
