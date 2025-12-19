import { db } from '@/database/client';
import { teachersTable } from '@/schemas';
import { eq } from 'drizzle-orm';
import { teacherRepository } from '@/repositories';

export class TeacherService {
  private repository = teacherRepository;

  async getAll(tenantId?: string) {
    const teachers = await this.repository.findAll();
    
    if (tenantId) {
      return teachers.filter((t: any) => t.tenantId === tenantId);
    }
    
    return teachers;
  }

  async getById(id: string, tenantId?: string) {
    const teacher = await this.repository.findById(id);
    
    if (tenantId && (teacher as any)?.tenantId !== tenantId) {
      return null;
    }
    
    return teacher;
  }

  async create(data: any, tenantId?: string) {
    const teacherData = { ...data, tenantId };
    return this.repository.create(teacherData);
  }

  async update(id: string, data: any, tenantId?: string) {
    const existing = await this.getById(id, tenantId);
    if (!existing) {
      throw new Error('Teacher not found or access denied');
    }
    
    const updated = await db
      .update(teachersTable)
      .set({ 
        ...data, 
        updatedAt: new Date() 
      } as any)
      .where(eq(teachersTable.teacherId, id))
      .returning();
    
    return updated[0];
  }

  async delete(id: string, tenantId?: string) {
    const existing = await this.getById(id, tenantId);
    if (!existing) {
      throw new Error('Teacher not found or access denied');
    }
    
    await db
      .delete(teachersTable)
      .where(eq(teachersTable.teacherId, id));
  }

  async getTeachersBySubject(subjectId: string, tenantId?: string) {
    const teachers = await this.getAll(tenantId);
    // Assuming there's a relationship - adjust based on your schema
    return teachers.filter((t: any) => t.subjects?.includes(subjectId));
  }
}

export const teacherService = new TeacherService();
