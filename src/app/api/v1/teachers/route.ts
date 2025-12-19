import { NextRequest } from 'next/server';
import { teacherService } from '@/lib/services';
import { requireAuth, getTenantId } from '@/lib/api/auth-helper';
import { success, error } from '@/lib/api/response';

// GET /api/v1/teachers
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    
    const teachers = await teacherService.getAll(tenantId);
    return success(teachers);
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to fetch teachers');
  }
}

// POST /api/v1/teachers
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    const body = await request.json();
    
    const teacher = await teacherService.create(body, tenantId);
    return success(teacher, 'Teacher created successfully');
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to create teacher');
  }
}
