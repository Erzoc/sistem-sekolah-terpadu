import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { studentService } from '@/lib/services';
import { errorResponse, successResponse } from '@/lib/api/response';
import { ForbiddenError, ValidationError, NotFoundError } from '@/lib/api/error';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      throw new ForbiddenError('Unauthorized');
    }
    
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    
    let students;
    
    if (classId) {
      students = await studentService.getStudentsByClass(
        classId,
        session.user.tenantId
      );
    } else {
      students = await studentService.getAll(session.user.tenantId);
    }
    
    return NextResponse.json(
      successResponse(students, 'Students retrieved successfully'),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      errorResponse('FETCH_ERROR', error.message),
      { status: error.statusCode || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      throw new ForbiddenError('Unauthorized');
    }
    
    // Check if user has permission to create students
    if (!['super_admin', 'admin_sekolah'].includes(session.user.role)) {
      throw new ForbiddenError('You do not have permission to create students');
    }
    
    const body = await request.json();
    const { name, email, nisn, classId } = body;
    
    if (!name || !classId) {
      throw new ValidationError('Name and classId are required');
    }
    
    const student = await studentService.create({
      name,
      email,
      nisn,
      classId,
      tenantId: session.user.tenantId || '',
    });
    
    return NextResponse.json(
      successResponse(student, 'Student created successfully'),
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      errorResponse('CREATE_ERROR', error.message),
      { status: error.statusCode || 500 }
    );
  }
}
