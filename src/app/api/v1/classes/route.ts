import { NextRequest } from 'next/server';
import { classService } from '@/lib/services';
import { requireAuth, getTenantId } from '@/lib/api/auth-helper';
import { success, error } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    
    const classes = await classService.getAll(tenantId);
    return success(classes);
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to fetch classes');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    const body = await request.json();
    
    const classData = await classService.create(body, tenantId);
    return success(classData, 'Class created successfully');
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to create class');
  }
}
