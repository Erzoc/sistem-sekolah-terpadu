import type { Role } from '@/lib/types/auth';

// Role hierarchy: higher index = more permissions
const roleHierarchy: Role[] = [
  'siswa',
  'guru', 
  'admin_sekolah',
  'super_admin',
];

/**
 * Check if user has required role
 */
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  const userIndex = roleHierarchy.indexOf(userRole);
  const requiredIndex = roleHierarchy.indexOf(requiredRole);
  
  return userIndex >= requiredIndex;
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.some(role => hasRole(userRole, role));
}

/**
 * Get accessible routes for a role
 */
export function getAccessibleRoutes(role: Role): string[] {
  const routes: Record<Role, string[]> = {
    super_admin: ['/admin', '/school-admin', '/teacher', '/student'],
    admin_sekolah: ['/school-admin', '/teacher', '/student'],
    guru: ['/teacher', '/student'],
    siswa: ['/student'],
  };
  
  return routes[role] || [];
}

/**
 * Get default redirect path for role
 */
export function getDefaultRoute(role: Role): string {
  const defaults: Record<Role, string> = {
    super_admin: '/admin',
    admin_sekolah: '/school-admin',
    guru: '/teacher',
    siswa: '/student',
  };
  
  return defaults[role] || '/';
}
