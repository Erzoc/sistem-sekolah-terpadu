import { BaseRepository } from './base.repository';
import { studentsTable, classesTable, usersTable } from '@/schemas';
import { db } from '@/database/client';
import { eq, and, like, or } from 'drizzle-orm';

export class StudentRepository extends BaseRepository<typeof studentsTable> {
  constructor() {
    super(studentsTable);
  }

  /**
   * Find student by ID
   */
  async findById(studentId: string) {
    return super.findById(studentId, studentsTable.studentId);
  }

  /**
   * Find student by NISN
   */
  async findByNisn(nisn: string) {
    const results = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.nisn, nisn))
      .limit(1);
    
    return results[0] || null;
  }

  /**
   * Find student by NIS
   */
  async findByNis(nis: string) {
    const results = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.nis, nis))
      .limit(1);
    
    return results[0] || null;
  }

  /**
   * Find students by class
   */
  async findByClass(classId: string) {
    return await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.classId, classId));
  }

  /**
   * Find students with class info
   */
  async findAllWithClass() {
  return await db
    .select({
      studentId: studentsTable.studentId,
      userId: studentsTable.userId,
      tenantId: studentsTable.tenantId,
      nisn: studentsTable.nisn,
      nis: studentsTable.nis,
      fullName: studentsTable.fullName,
      gender: studentsTable.gender,
      parentName: studentsTable.parentName,
      parentPhone: studentsTable.parentPhone,
      status: studentsTable.status,
      className: classesTable.className,
      classLevel: classesTable.level,
      classCapacity: classesTable.capacity,
    })
    .from(studentsTable)
    .leftJoin(classesTable, eq(studentsTable.classId, classesTable.classId));
}


  /**
   * Find student with class and user info
   */
  async findByIdWithDetails(studentId: string) {
  const results = await db
    .select({
      // Student data
      studentId: studentsTable.studentId,
      nisn: studentsTable.nisn,
      nis: studentsTable.nis,
      fullName: studentsTable.fullName,
      gender: studentsTable.gender,
      parentName: studentsTable.parentName,
      parentPhone: studentsTable.parentPhone,
      status: studentsTable.status,
      // Class data
      className: classesTable.className,
      classLevel: classesTable.level,
      // User data
      userEmail: usersTable.email,
      userPhone: usersTable.phone,
    })
    .from(studentsTable)
    .leftJoin(classesTable, eq(studentsTable.classId, classesTable.classId))
    .leftJoin(usersTable, eq(studentsTable.userId, usersTable.userId))
    .where(eq(studentsTable.studentId, studentId))
    .limit(1);
  
  return results[0] || null;
}


  /**
   * Search students by name or NISN
   */
  async search(query: string) {
    return await db
      .select()
      .from(studentsTable)
      .where(
        or(
          like(studentsTable.fullName, `%${query}%`),
          like(studentsTable.nisn, `%${query}%`),
          like(studentsTable.nis, `%${query}%`)
        )
      );
  }

  /**
   * Get students by gender
   */
  async findByGender(gender: 'male' | 'female') {
    return await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.gender, gender));
  }

  /**
   * Get active students
   */
  async findActive() {
    return await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.status, 'active'));
  }

  /**
   * Get students by tenant
   */
  async findByTenant(tenantId: string) {
    return await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.tenantId, tenantId));
  }

  /**
   * Update student
   */
  async updateById(studentId: string, data: any) {
    return super.updateById(studentId, studentsTable.studentId, data);
  }

  /**
   * Delete student
   */
  async deleteById(studentId: string) {
    return super.deleteById(studentId, studentsTable.studentId);
  }

  /**
   * Count students by class
   */
  async countByClass(classId: string) {
    return super.count(eq(studentsTable.classId, classId));
  }

  /**
   * Check if NISN exists
   */
  async nisnExists(nisn: string): Promise<boolean> {
    return super.exists(eq(studentsTable.nisn, nisn));
  }

  /**
   * Check if NIS exists
   */
  async nisExists(nis: string): Promise<boolean> {
    return super.exists(eq(studentsTable.nis, nis));
  }
}

// Export singleton instance
export const studentRepository = new StudentRepository();
