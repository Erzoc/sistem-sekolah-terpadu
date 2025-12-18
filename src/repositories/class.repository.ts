import { BaseRepository } from './base.repository';
import { classesTable, studentsTable } from '@/schemas';
import { db } from '@/database/client';
import { eq, and } from 'drizzle-orm';

export class ClassRepository extends BaseRepository<typeof classesTable> {
  constructor() {
    super(classesTable);
  }

  /**
   * Find class by ID
   */
  async findById(classId: string) {
    return super.findById(classId, classesTable.classId);
  }

  /**
   * Find class by name
   */
  async findByName(className: string, tenantId: string) {
    const results = await db
      .select()
      .from(classesTable)
      .where(
        and(
          eq(classesTable.className, className),
          eq(classesTable.tenantId, tenantId)
        )
      )
      .limit(1);
    
    return results[0] || null;
  }

  /**
   * Find classes by level
   */
  async findByLevel(level: string, tenantId: string) {
    return await db
      .select()
      .from(classesTable)
      .where(
        and(
          eq(classesTable.level, level),
          eq(classesTable.tenantId, tenantId)
        )
      );
  }

  /**
   * Find classes by tenant
   */
  async findByTenant(tenantId: string) {
    return await db
      .select()
      .from(classesTable)
      .where(eq(classesTable.tenantId, tenantId));
  }

  /**
   * Find classes by academic year
   */
  async findByAcademicYear(academicYearId: string) {
    return await db
      .select()
      .from(classesTable)
      .where(eq(classesTable.academicYearId, academicYearId));
  }

  /**
   * Find class with student count
   */
  async findByIdWithStudentCount(classId: string) {
    const classData = await this.findById(classId);
    if (!classData) return null;

    const students = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.classId, classId));

    return {
  ...classData,
  studentCount: students.length,
  availableSeats: (classData.capacity || 0) - students.length,
};

  }

  /**
   * Find all classes with student counts
   */
  async findAllWithStudentCounts(tenantId: string) {
    const classes = await this.findByTenant(tenantId);
    
    const classesWithCounts = await Promise.all(
      classes.map(async (cls) => {
        const students = await db
          .select()
          .from(studentsTable)
          .where(eq(studentsTable.classId, cls.classId));

        return {
  ...cls,
  studentCount: students.length,
  availableSeats: (cls.capacity || 0) - students.length,
};

      })
    );

    return classesWithCounts;
  }

  /**
   * Get active classes
   */
  async findActive(tenantId: string) {
    return await db
      .select()
      .from(classesTable)
      .where(
        and(
          eq(classesTable.status, 'active'),
          eq(classesTable.tenantId, tenantId)
        )
      );
  }

  /**
   * Update class
   */
  async updateById(classId: string, data: any) {
    return super.updateById(classId, classesTable.classId, data);
  }

  /**
   * Delete class
   */
  async deleteById(classId: string) {
    return super.deleteById(classId, classesTable.classId);
  }

  /**
   * Check if class name exists
   */
  async classNameExists(className: string, tenantId: string): Promise<boolean> {
  const condition = and(
    eq(classesTable.className, className),
    eq(classesTable.tenantId, tenantId)
  );
  
  if (!condition) return false;
  
  return super.exists(condition);
}

}

// Export singleton instance
export const classRepository = new ClassRepository();
