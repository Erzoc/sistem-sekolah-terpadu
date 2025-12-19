import { db } from '@/database/client';
import { users } from '@/schemas';
import { eq, and } from 'drizzle-orm';
import { authService } from './auth.service';
import type { User } from '@/lib/types/auth';

export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
  role: string;
  tenantId?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export class UserService {
  async getUserById(id: string): Promise<User | null> {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.userId, id))  // ⬅ FIX: userId not id
      .limit(1);
    
    return user.length ? this.mapToUser(user[0]) : null;  // ⬅ FIX: [0]
  }
  
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return user.length ? this.mapToUser(user[0]) : null;  // ⬅ FIX: [0]
  }
  
  async getUsersByTenant(tenantId: string): Promise<User[]> {
    const usersList = await db
      .select()
      .from(users)
      .where(eq(users.tenantId, tenantId));
    
    return usersList.map((u: any) => this.mapToUser(u));  // ⬅ FIX: add type
  }
  
  async createUser(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.getUserByEmail(data.email);
    
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    const hashedPassword = await authService.hashPassword(data.password);
    
    const newUser = await db
      .insert(users)
      .values({
        email: data.email,
        fullName: data.name,           // ⬅ FIX: fullName not name
        passwordHash: hashedPassword,   // ⬅ FIX: passwordHash not password
        role: data.role as any,         // ⬅ FIX: cast as any
        tenantId: data.tenantId || '',
        status: 'active',               // ⬅ FIX: status not isActive
      })
      .returning();
    
    return this.mapToUser(newUser[0]);  // ⬅ FIX: [0]
  }
  
  async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    const updateData: any = {};
    
    if (data.email) updateData.email = data.email;
    if (data.name) updateData.fullName = data.name;  // ⬅ FIX: fullName
    if (data.role) updateData.role = data.role;
    if (data.isActive !== undefined) {
      updateData.status = data.isActive ? 'active' : 'inactive';  // ⬅ FIX: status
    }
    updateData.updatedAt = new Date();
    
    const updated = await db
      .update(users)
      .set(updateData)
      .where(eq(users.userId, id))  // ⬅ FIX: userId not id
      .returning();
    
    if (!updated.length) {
      throw new Error('User not found');
    }
    
    return this.mapToUser(updated[0]);  // ⬅ FIX: [0]
  }
  
  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.userId, id));  // ⬅ FIX: userId not id
  }
  
  private mapToUser(dbUser: any): User {
    return {
      id: dbUser.userId,                      // ⬅ FIX: userId
      email: dbUser.email,
      name: dbUser.fullName,                  // ⬅ FIX: fullName
      role: dbUser.role as any,
      tenantId: dbUser.tenantId,
      isActive: dbUser.status === 'active',   // ⬅ FIX: status to boolean
    };
  }
}

export const userService = new UserService();
