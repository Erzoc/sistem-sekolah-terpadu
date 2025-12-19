export const PERMISSIONS = {
  // Students
  VIEW_STUDENTS: 'view_students',
  CREATE_STUDENTS: 'create_students',
  UPDATE_STUDENTS: 'update_students',
  DELETE_STUDENTS: 'delete_students',
  
  // Teachers
  VIEW_TEACHERS: 'view_teachers',
  CREATE_TEACHERS: 'create_teachers',
  UPDATE_TEACHERS: 'update_teachers',
  DELETE_TEACHERS: 'delete_teachers',
  
  // Classes
  VIEW_CLASSES: 'view_classes',
  CREATE_CLASSES: 'create_classes',
  UPDATE_CLASSES: 'update_classes',
  DELETE_CLASSES: 'delete_classes',
  
  // System
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: Object.values(PERMISSIONS), // All permissions
  
  admin_sekolah: [
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.CREATE_STUDENTS,
    PERMISSIONS.UPDATE_STUDENTS,
    PERMISSIONS.DELETE_STUDENTS,
    PERMISSIONS.VIEW_TEACHERS,
    PERMISSIONS.CREATE_TEACHERS,
    PERMISSIONS.UPDATE_TEACHERS,
    PERMISSIONS.VIEW_CLASSES,
    PERMISSIONS.CREATE_CLASSES,
    PERMISSIONS.UPDATE_CLASSES,
  ],
  
  guru: [
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.UPDATE_STUDENTS,
    PERMISSIONS.VIEW_CLASSES,
  ],
  
  siswa: [
    PERMISSIONS.VIEW_STUDENTS,
  ],
};

export function hasPermission(role: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
