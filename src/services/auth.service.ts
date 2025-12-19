// services/auth.service.ts
import { userRepository } from '@/repositories/user.repository';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSession, deleteSession } from '@/lib/auth/session';

export class AuthService {
  /**
   * Login user
   */
  async login(email: string, password: string) {
    // 1. Find user by email
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Email atau password salah');
    }

    // 2. Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      throw new Error('Email atau password salah');
    }

    // 3. Create session
    await createSession(user.userId, user.role, user.tenantId || undefined);

    // 4. Return user data (without password)
    return {
      userId: user.userId,
      name: user.fullName,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
  }

  /**
   * Logout user
   */
  async logout() {
    await deleteSession();
  }

  /**
   * Register new user
   */
  async register(data: {
    fullName: string;
    email: string;
    password: string;
    role: 'super_admin' | 'admin_sekolah' | 'guru' | 'siswa' | 'ortu';
    tenantId?: string;
    nip?: string;
    nisn?: string;
  }) {
    // 1. Check if email exists
    const exists = await userRepository.emailExists(data.email);
    if (exists) {
      throw new Error('Email sudah digunakan');
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(data.password);

    // 3. Create user
    const user = await userRepository.create({
      fullName: data.fullName,
      email: data.email,
      passwordHash: hashedPassword,
      role: data.role,
      tenantId: data.tenantId,
      nip: data.nip,
      nisn: data.nisn,
      status: 'active',
    });

    return {
      userId: user.userId,
      name: user.fullName,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
  }
}

// Export singleton
export const authService = new AuthService();
