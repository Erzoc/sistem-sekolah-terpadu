import { db } from '@/database/client';
import { classesTable } from '@/schemas';
import { eq } from 'drizzle-orm';
import { classRepository } from '@/repositories';

export class ClassService {
  private repository = classRepository;

  async getAll(tenantId?: string) {
    const classes = await this.repository.findAll();
    
    if (tenantId) {
      return classes.filter((c: any) => c.tenantId === tenantId);
    }
    
    return classes;
  }

  async getById(id: string, tenantId?: string) {
    const classData = await this.repository.findById(id);
    
    if (tenantId && (classData as any)?.tenantId !== tenantId) {
      return null;
    }
    
    return classData;
  }

  async create(data: any, tenantId?: string) {
    const classData = { ...data, tenantId };
    return this.repository.create(classData);
  }

  async update(id: string, data: any, tenantId?: string) {
    const existing = await this.getById(id, tenantId);
    if (!existing) {
      throw new Error('Class not found or access denied');
    }
    
    const updated = await db
      .update(classesTable)
      .set({ 
        ...data, 
        updatedAt: new Date() 
      } as any)
      .where(eq(classesTable.classId, id))
      .returning();
    
    return updated[0];
  }

  async delete(id: string, tenantId?: string) {
    const existing = await this.getById(id, tenantId);
    if (!existing) {
      throw new Error('Class not found or access denied');
    }
    
    await db
      .delete(classesTable)
      .where(eq(classesTable.classId, id));
  }

  async getClassesByAcademicYear(academicYearId: string, tenantId?: string) {
    const classes = await this.getAll(tenantId);
    return classes.filter((c: any) => c.academicYearId === academicYearId);
  }
}

export const classService = new ClassService();
