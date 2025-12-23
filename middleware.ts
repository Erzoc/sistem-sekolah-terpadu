import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('[MIDDLEWARE] 🛡️ Request:', pathname);

  // ============================================
  // GET JWT TOKEN
  // ============================================
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = (token as any)?.role || null;
  const userEmail = (token as any)?.email || null;

  console.log('[MIDDLEWARE] 👤 Auth status:', {
    authenticated: isAuthenticated,
    email: userEmail,
    role: userRole,
    path: pathname,
  });

  // ============================================
  // PUBLIC ROUTES (No auth required)
  // ============================================
  const publicRoutes = ['/api/auth'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log('[MIDDLEWARE] ✅ Public route - allowing');
    return NextResponse.next();
  }

  // ============================================
  // AUTHENTICATED USER ON LANDING PAGE
  // Auto-redirect to their dashboard
  // ============================================
  if (isAuthenticated && pathname === '/') {
    let redirectUrl = null;

    // Role-based redirect
    if (userRole === 'guru') {
      redirectUrl = '/guru';
    } else if (userRole === 'admin_sekolah') {
      redirectUrl = '/admin';
    } else if (userRole === 'superadmin') {
      redirectUrl = '/superadmin';
    }

    if (redirectUrl) {
      console.log('[MIDDLEWARE] 🔄 Redirecting authenticated user:', {
        email: userEmail,
        role: userRole,
        to: redirectUrl
      });
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // ============================================
  // PROTECTED ROUTES (Auth required)
  // ============================================
  const protectedRoutes = ['/guru', '/admin', '/superadmin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Not authenticated trying to access protected route
  if (isProtectedRoute && !isAuthenticated) {
    console.log('[MIDDLEWARE] ❌ Not authenticated - redirecting to landing');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ============================================
  // ROLE-BASED ACCESS CONTROL
  // ============================================
  if (isAuthenticated && isProtectedRoute) {
    
    // GURU routes - only 'guru' role
    if (pathname.startsWith('/guru') && userRole !== 'guru') {
      console.log('[MIDDLEWARE] ❌ Access denied:', {
        user: userEmail,
        role: userRole,
        attempting: '/guru'
      });
      return redirectToUserDashboard(userRole, request.url);
    }

    // ADMIN routes - only 'admin_sekolah' role
    if (pathname.startsWith('/admin') && userRole !== 'admin_sekolah') {
      console.log('[MIDDLEWARE] ❌ Access denied:', {
        user: userEmail,
        role: userRole,
        attempting: '/admin'
      });
      return redirectToUserDashboard(userRole, request.url);
    }

    // SUPERADMIN routes - only 'superadmin' role
    if (pathname.startsWith('/superadmin') && userRole !== 'superadmin') {
      console.log('[MIDDLEWARE] ❌ Access denied:', {
        user: userEmail,
        role: userRole,
        attempting: '/superadmin'
      });
      return redirectToUserDashboard(userRole, request.url);
    }

    console.log('[MIDDLEWARE] ✅ Access granted:', {
      user: userEmail,
      role: userRole,
      path: pathname
    });
  }

  return NextResponse.next();
}

// ============================================
// HELPER: Redirect to user's correct dashboard
// ============================================
function redirectToUserDashboard(role: string | null, baseUrl: string) {
  if (role === 'guru') {
    return NextResponse.redirect(new URL('/guru', baseUrl));
  } else if (role === 'admin_sekolah') {
    return NextResponse.redirect(new URL('/admin', baseUrl));
  } else if (role === 'superadmin') {
    return NextResponse.redirect(new URL('/superadmin', baseUrl));
  } else {
    // Unknown role or no role - redirect to landing
    return NextResponse.redirect(new URL('/', baseUrl));
  }
}

// ============================================
// MIDDLEWARE MATCHER
// Define which paths to intercept
// ============================================
export const config = {
  matcher: [
    '/',
    '/guru/:path*',
    '/admin/:path*',
    '/superadmin/:path*',
  ],
};
