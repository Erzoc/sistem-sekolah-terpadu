import { NextRequest } from 'next/server';
import { subjectService } from '@/lib/services';
import { requireAuth, getTenantId } from '@/lib/api/auth-helper';
import { success, error } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    
    const subjects = await subjectService.getAll(tenantId);
    return success(subjects);
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to fetch subjects');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const tenantId = await getTenantId();
    const body = await request.json();
    
    const subject = await subjectService.create(body, tenantId);
    return success(subject, 'Subject created successfully');
  } catch (err: any) {
    return err.status ? err : error(err.message || 'Failed to create subject');
  }
}
