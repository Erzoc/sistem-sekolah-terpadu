import { NextRequest } from 'next/server';
import { classService } from '@/lib/services';
import { requireAuth, getTenantId } from '@/lib/api/auth-helper';
import { success, error, notFound } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    
    const classData = await classService.getById(params.id, tenantId);
    
    if (!classData) {
      return notFound('Class not found');
    }
    
    return success(classData);
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to fetch class');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    const body = await request.json();
    
    const classData = await classService.update(params.id, body, tenantId);
    return success(classData, 'Class updated successfully');
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to update class');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    
    await classService.delete(params.id, tenantId);
    return success(null, 'Class deleted successfully');
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to delete class');
  }
}
