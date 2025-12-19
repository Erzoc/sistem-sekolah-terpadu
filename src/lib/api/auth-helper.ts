import { auth } from '@/lib/auth/auth';
import { unauthorized, forbidden } from './response';
import type { Role } from '@/lib/types/auth';

/**
 * Get authenticated user session
 * Returns session or throws error response
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session || !session.user) {
    throw unauthorized('Authentication required');
  }
  
  return session;
}

/**
 * Check if user has required role
 */
export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  const userRole = (session.user as any).role as Role;
  
  if (!allowedRoles.includes(userRole)) {
    throw forbidden('Insufficient permissions');
  }
  
  return session;
}

/**
 * Get tenant ID from authenticated user
 */
export async function getTenantId(): Promise<string | undefined> {
  const session = await requireAuth();
  return (session.user as any).tenantId;
}

/**
 * Verify user has access to tenant resource
 */
export async function verifyTenantAccess(resourceTenantId: string) {
  const session = await requireAuth();
  const userTenantId = (session.user as any).tenantId;
  const userRole = (session.user as any).role as Role;
  
  // Super admin can access all tenants
  if (userRole === 'super_admin') {
    return session;
  }
  
  // Check tenant match
  if (userTenantId !== resourceTenantId) {
    throw forbidden('Access denied to this resource');
  }
  
  return session;
}
