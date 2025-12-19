import { NextRequest } from 'next/server';
import { subjectService } from '@/lib/services';
import { requireAuth, getTenantId } from '@/lib/api/auth-helper';
import { success, error, notFound } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    
    const subject = await subjectService.getById(params.id, tenantId);
    
    if (!subject) {
      return notFound('Subject not found');
    }
    
    return success(subject);
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to fetch subject');
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
    
    const subject = await subjectService.update(params.id, body, tenantId);
    return success(subject, 'Subject updated successfully');
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to update subject');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    
    await subjectService.delete(params.id, tenantId);
    return success(null, 'Subject deleted successfully');
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to delete subject');
  }
}
