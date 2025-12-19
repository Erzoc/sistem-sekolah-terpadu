import { db } from '@/database/client';
import { users } from '@/schemas';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/types/auth';

export class AuthService {
  async authenticate(email: string, password: string): Promise<User> {
    try {
      const [userData] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!userData) {
        throw new Error('Invalid credentials');
      }

      if (!userData.passwordHash) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      if (userData.status !== 'active') {
        throw new Error('User is inactive');
      }

      return {
        id: userData.userId,
        email: userData.email,
        name: userData.fullName,
        role: userData.role as any,
        tenantId: userData.tenantId || undefined,
        isActive: userData.status === 'active',
      };
    } catch (error) {
      throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export const authService = new AuthService();
