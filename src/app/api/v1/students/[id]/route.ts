import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { studentService } from '@/lib/services';
import { errorResponse, successResponse } from '@/lib/api/response';
import { ForbiddenError, NotFoundError } from '@/lib/api/error';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      throw new ForbiddenError('Unauthorized');
    }
    
    const student = await studentService.getById(
      params.id,
      session.user.tenantId
    );
    
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    
    return NextResponse.json(
      successResponse(student, 'Student retrieved successfully'),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      errorResponse('FETCH_ERROR', error.message),
      { status: error.statusCode || 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      throw new ForbiddenError('Unauthorized');
    }
    
    if (!['super_admin', 'admin_sekolah'].includes(session.user.role)) {
      throw new ForbiddenError('You do not have permission to update students');
    }
    
    const body = await request.json();
    
    const student = await studentService.update(
      params.id,
      body,
      session.user.tenantId
    );
    
    return NextResponse.json(
      successResponse(student, 'Student updated successfully'),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', error.message),
      { status: error.statusCode || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      throw new ForbiddenError('Unauthorized');
    }
    
    if (session.user.role !== 'super_admin') {
      throw new ForbiddenError('Only super admin can delete students');
    }
    
    await studentService.delete(params.id, session.user.tenantId);
    
    return NextResponse.json(
      successResponse(null, 'Student deleted successfully'),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      errorResponse('DELETE_ERROR', error.message),
      { status: error.statusCode || 500 }
    );
  }
}
