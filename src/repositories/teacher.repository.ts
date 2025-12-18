import { BaseRepository } from './base.repository';
import { teachersTable, usersTable, teacherSubjectsTable, subjectsTable, classesTable } from '@/schemas';
import { db } from '@/database/client';
import { eq, like, or } from 'drizzle-orm';

export class TeacherRepository extends BaseRepository<typeof teachersTable> {
  constructor() {
    super(teachersTable);
  }

  /**
   * Find teacher by ID
   */
  async findById(teacherId: string) {
    return super.findById(teacherId, teachersTable.teacherId);
  }

  /**
   * Find teacher by NIP
   */
  async findByNip(nip: string) {
    const results = await db
      .select()
      .from(teachersTable)
      .where(eq(teachersTable.nip, nip))
      .limit(1);
    
    return results[0] || null;
  }

  /**
   * Find teacher by user ID
   */
  async findByUserId(userId: string) {
    const results = await db
      .select()
      .from(teachersTable)
      .where(eq(teachersTable.userId, userId))
      .limit(1);
    
    return results[0] || null;
  }

  /**
   * Find all teachers with user info
   */
  async findAllWithUser() {
    return await db
      .select({
        teacherId: teachersTable.teacherId,
        userId: teachersTable.userId,
        tenantId: teachersTable.tenantId,
        nip: teachersTable.nip,
        position: teachersTable.position,
        status: teachersTable.status,
        // User info
        fullName: usersTable.fullName,
        email: usersTable.email,
        phone: usersTable.phone,
      })
      .from(teachersTable)
      .innerJoin(usersTable, eq(teachersTable.userId, usersTable.userId));
  }

  /**
   * Find teacher with subjects taught
   */
  async findByIdWithSubjects(teacherId: string) {
    const teacherData = await db
      .select({
        teacherId: teachersTable.teacherId,
        nip: teachersTable.nip,
        position: teachersTable.position,
        status: teachersTable.status,
        fullName: usersTable.fullName,
        email: usersTable.email,
        phone: usersTable.phone,
      })
      .from(teachersTable)
      .innerJoin(usersTable, eq(teachersTable.userId, usersTable.userId))
      .where(eq(teachersTable.teacherId, teacherId))
      .limit(1);

    if (!teacherData[0]) return null;

    const subjects = await db
      .select({
        subjectId: subjectsTable.subjectId,
        subjectName: subjectsTable.subjectName,
        subjectCode: subjectsTable.subjectCode,
        className: classesTable.className,
        classLevel: classesTable.level,
        hoursPerWeek: teacherSubjectsTable.hoursPerWeek,
      })
      .from(teacherSubjectsTable)
      .innerJoin(subjectsTable, eq(teacherSubjectsTable.subjectId, subjectsTable.subjectId))
      .innerJoin(classesTable, eq(teacherSubjectsTable.classId, classesTable.classId))
      .where(eq(teacherSubjectsTable.teacherId, teacherId));

    return {
      ...teacherData[0],
      subjects,
    };
  }

  /**
   * Search teachers by name or NIP
   */
  async search(query: string) {
    return await db
      .select({
        teacherId: teachersTable.teacherId,
        nip: teachersTable.nip,
        position: teachersTable.position,
        fullName: usersTable.fullName,
        email: usersTable.email,
      })
      .from(teachersTable)
      .innerJoin(usersTable, eq(teachersTable.userId, usersTable.userId))
      .where(
        or(
          like(usersTable.fullName, `%${query}%`),
          like(teachersTable.nip, `%${query}%`)
        )
      );
  }

  /**
   * Find teachers by position
   */
  async findByPosition(position: 'guru_mapel' | 'wali_kelas' | 'guru_bk' | 'kepala_sekolah') {
    return await db
      .select({
        teacherId: teachersTable.teacherId,
        nip: teachersTable.nip,
        position: teachersTable.position,
        fullName: usersTable.fullName,
        email: usersTable.email,
      })
      .from(teachersTable)
      .innerJoin(usersTable, eq(teachersTable.userId, usersTable.userId))
      .where(eq(teachersTable.position, position));
  }

  /**
   * Get active teachers
   */
  async findActive() {
    return await db
      .select()
      .from(teachersTable)
      .where(eq(teachersTable.status, 'aktif'));
  }

  /**
   * Find teachers by tenant
   */
  async findByTenant(tenantId: string) {
    return await db
      .select()
      .from(teachersTable)
      .where(eq(teachersTable.tenantId, tenantId));
  }

  /**
   * Update teacher
   */
  async updateById(teacherId: string, data: any) {
    return super.updateById(teacherId, teachersTable.teacherId, data);
  }

  /**
   * Delete teacher
   */
  async deleteById(teacherId: string) {
    return super.deleteById(teacherId, teachersTable.teacherId);
  }

  /**
   * Check if NIP exists
   */
  async nipExists(nip: string): Promise<boolean> {
    return super.exists(eq(teachersTable.nip, nip));
  }
}

// Export singleton instance
export const teacherRepository = new TeacherRepository();
