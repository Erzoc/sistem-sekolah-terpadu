// lib/auth/password.ts
import bcrypt from 'bcryptjs';

// Hash password sebelum save ke database
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Cek password saat login
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
