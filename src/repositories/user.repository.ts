// repositories/user.repository.ts
import { BaseRepository } from './base.repository';
import { usersTable } from '@/schemas/users';
import { db } from '@/database/client';
import { eq } from 'drizzle-orm';

export class UserRepository extends BaseRepository<typeof usersTable> {
  constructor() {
    super(usersTable);
  }

  /**
   * Find user by ID
   */
  async findById(userId: string) {
    return super.findById(userId, usersTable.userId);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    const results = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return results[0] || null;
  }

  /**
   * Find users by tenant
   */
  async findByTenant(tenantId: string) {
    return await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.tenantId, tenantId));
  }

  /**
   * Find users by role
   */
  async findByRole(role: 'super_admin' | 'admin_sekolah' | 'guru' | 'siswa' | 'ortu') {
    return await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, role));  // ✅ Sekarang oke
  }


  /**
   * Update user
   */
  async updateById(userId: string, data: any) {
    return super.updateById(userId, usersTable.userId, {
      ...data,
      updatedAt: new Date(),
    });
  }

  /**
   * Delete user
   */
  async deleteById(userId: string) {
    return super.deleteById(userId, usersTable.userId);
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    return super.exists(eq(usersTable.email, email));
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
