import { db } from '@/database/client';
import { studentsTable } from '@/schemas';
import { eq, and } from 'drizzle-orm';
import { studentRepository } from '@/repositories';

export class StudentService {
  private repository = studentRepository;

  async getAll(tenantId?: string) {
    const students = await this.repository.findAll();
    
    if (tenantId) {
      return students.filter((s: any) => s.tenantId === tenantId);
    }
    
    return students;
  }

  async getById(id: string, tenantId?: string) {
    const student = await this.repository.findById(id);
    
    if (tenantId && (student as any)?.tenantId !== tenantId) {
      return null;
    }
    
    return student;
  }

  async create(data: any, tenantId?: string) {
    const studentData = { ...data, tenantId };
    return this.repository.create(studentData);
  }

  async update(id: string, data: any, tenantId?: string) {
    // Verify student exists and belongs to tenant
    const existing = await this.getById(id, tenantId);
    if (!existing) {
      throw new Error('Student not found or access denied');
    }
    
    // Direct DB update
    const updated = await db
      .update(studentsTable)
      .set({ 
        ...data, 
        updatedAt: new Date() 
      } as any)
      .where(eq(studentsTable.studentId, id))
      .returning();
    
    return updated[0];
  }

  async delete(id: string, tenantId?: string) {
    // Verify student exists and belongs to tenant
    const existing = await this.getById(id, tenantId);
    if (!existing) {
      throw new Error('Student not found or access denied');
    }
    
    // Direct DB delete
    await db
      .delete(studentsTable)
      .where(eq(studentsTable.studentId, id));
  }

  async getStudentsByClass(classId: string, tenantId?: string) {
    const students = await this.repository.findAll();
    return students.filter((s: any) => 
      s.classId === classId && (!tenantId || s.tenantId === tenantId)
    );
  }
}

export const studentService = new StudentService();
