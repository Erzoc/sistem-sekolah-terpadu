import { BaseRepository } from './base.repository';
import { subjectsTable, teacherSubjectsTable, teachersTable, usersTable } from '@/schemas';
import { db } from '@/database/client';
import { eq, like } from 'drizzle-orm';

export class SubjectRepository extends BaseRepository<typeof subjectsTable> {
  constructor() {
    super(subjectsTable);
  }

  /**
   * Find subject by ID
   */
  async findById(subjectId: string) {
    return super.findById(subjectId, subjectsTable.subjectId);
  }

  /**
   * Find subject by code
   */
  async findByCode(code: string) {
    const results = await db
      .select()
      .from(subjectsTable)
      .where(eq(subjectsTable.subjectCode, code))
      .limit(1);
    
    return results[0] || null;
  }

  /**
   * Find core subjects
   */
  async findCoreSubjects() {
    return await db
      .select()
      .from(subjectsTable)
      .where(eq(subjectsTable.isCore, true));
  }

  /**
   * Find elective subjects
   */
  async findElectiveSubjects() {
    return await db
      .select()
      .from(subjectsTable)
      .where(eq(subjectsTable.isCore, false));
  }

  /**
   * Search subjects by name
   */
  async search(query: string) {
    return await db
      .select()
      .from(subjectsTable)
      .where(like(subjectsTable.subjectName, `%${query}%`));
  }

  /**
   * Find subject with teachers
   */
  async findByIdWithTeachers(subjectId: string) {
    const subjectData = await this.findById(subjectId);
    if (!subjectData) return null;

    const teachers = await db
      .select({
        teacherId: teachersTable.teacherId,
        teacherName: usersTable.fullName,
        nip: teachersTable.nip,
        hoursPerWeek: teacherSubjectsTable.hoursPerWeek,
      })
      .from(teacherSubjectsTable)
      .innerJoin(teachersTable, eq(teacherSubjectsTable.teacherId, teachersTable.teacherId))
      .innerJoin(usersTable, eq(teachersTable.userId, usersTable.userId))
      .where(eq(teacherSubjectsTable.subjectId, subjectId));

    return {
      ...subjectData,
      teachers,
    };
  }

  /**
   * Update subject
   */
  async updateById(subjectId: string, data: any) {
    return super.updateById(subjectId, subjectsTable.subjectId, data);
  }

  /**
   * Delete subject
   */
  async deleteById(subjectId: string) {
    return super.deleteById(subjectId, subjectsTable.subjectId);
  }

  /**
   * Check if subject code exists
   */
  async codeExists(code: string): Promise<boolean> {
    return super.exists(eq(subjectsTable.subjectCode, code));
  }
}

// Export singleton instance
export const subjectRepository = new SubjectRepository();
