export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN_SEKOLAH: 'admin_sekolah',
  GURU: 'guru',
  SISWA: 'siswa',
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

export const ROLE_DESCRIPTIONS: Record<RoleType, string> = {
  [ROLES.SUPER_ADMIN]: 'Super Administrator',
  [ROLES.ADMIN_SEKOLAH]: 'School Administrator',
  [ROLES.GURU]: 'Teacher',
  [ROLES.SISWA]: 'Student',
};
