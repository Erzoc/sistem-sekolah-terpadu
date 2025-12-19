import { NextRequest } from 'next/server';
import { teacherService } from '@/lib/services';
import { requireAuth, getTenantId } from '@/lib/api/auth-helper';
import { success, error, notFound } from '@/lib/api/response';

// GET /api/v1/teachers/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    
    const teacher = await teacherService.getById(params.id, tenantId);
    
    if (!teacher) {
      return notFound('Teacher not found');
    }
    
    return success(teacher);
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to fetch teacher');
  }
}

// PUT /api/v1/teachers/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    const body = await request.json();
    
    const teacher = await teacherService.update(params.id, body, tenantId);
    return success(teacher, 'Teacher updated successfully');
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to update teacher');
  }
}

// DELETE /api/v1/teachers/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    
    await teacherService.delete(params.id, tenantId);
    return success(null, 'Teacher deleted successfully');
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to delete teacher');
  }
}
