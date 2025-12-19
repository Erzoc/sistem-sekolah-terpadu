import { db } from '@/database/client';
import { subjectsTable } from '@/schemas';
import { eq } from 'drizzle-orm';
import { subjectRepository } from '@/repositories';

export class SubjectService {
  private repository = subjectRepository;

  async getAll(tenantId?: string) {
    const subjects = await this.repository.findAll();
    
    if (tenantId) {
      return subjects.filter((s: any) => s.tenantId === tenantId);
    }
    
    return subjects;
  }

  async getById(id: string, tenantId?: string) {
    const subject = await this.repository.findById(id);
    
    if (tenantId && (subject as any)?.tenantId !== tenantId) {
      return null;
    }
    
    return subject;
  }

  async create(data: any, tenantId?: string) {
    const subjectData = { ...data, tenantId };
    return this.repository.create(subjectData);
  }

  async update(id: string, data: any, tenantId?: string) {
    const existing = await this.getById(id, tenantId);
    if (!existing) {
      throw new Error('Subject not found or access denied');
    }
    
    const updated = await db
      .update(subjectsTable)
      .set({ 
        ...data, 
        updatedAt: new Date() 
      } as any)
      .where(eq(subjectsTable.subjectId, id))
      .returning();
    
    return updated[0];
  }

  async delete(id: string, tenantId?: string) {
    const existing = await this.getById(id, tenantId);
    if (!existing) {
      throw new Error('Subject not found or access denied');
    }
    
    await db
      .delete(subjectsTable)
      .where(eq(subjectsTable.subjectId, id));
  }

  async getSubjectsByGrade(grade: string, tenantId?: string) {
    const subjects = await this.getAll(tenantId);
    return subjects.filter((s: any) => s.grade === grade);
  }
}

export const subjectService = new SubjectService();
