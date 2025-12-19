import { DefaultUser } from 'next-auth';

export type Role = 'super_admin' | 'admin_sekolah' | 'guru' | 'siswa';

export interface User extends DefaultUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId?: string;
  isActive: boolean;
}

export interface JWT {
  id?: string;
  email?: string;
  name?: string;
  role?: Role;
  tenantId?: string;
}

export interface Session {
  user: User;
}
