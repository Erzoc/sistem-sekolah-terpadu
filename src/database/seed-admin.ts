// database/seed-admin.ts
import { db } from './client';
import { usersTable, tenantsTable } from '@/schemas';
import { hashPassword } from '@/lib/auth/password';

async function seedAdmin() {
  console.log('🌱 Seeding super admin user...');

  // 1. Buat tenant System untuk super admin
  const [systemTenant] = await db
    .insert(tenantsTable)
    .values({
      npsn: '00000000',              // ✅ Required: NPSN dummy untuk system
      schoolName: 'System',          // ✅ Required: schoolName, bukan tenantName
      address: 'System',
      phone: '000000000000',
      email: 'system@internal.com',
      status: 'active',
    })
    .returning();

  // 2. Hash password
  const password = await hashPassword('admin123');

  // 3. Buat super admin user
  const [admin] = await db
    .insert(usersTable)
    .values({
      tenantId: systemTenant.tenantId,  // ✅ tenantId dari tenant yang baru dibuat
      role: 'super_admin',
      email: 'admin@test.com',
      passwordHash: password,
      fullName: 'Super Admin',
      status: 'active',
    })
    .returning();

  console.log('✅ System tenant created:');
  console.log('   Tenant ID:', systemTenant.tenantId);
  console.log('   School Name:', systemTenant.schoolName);
  console.log('');
  console.log('✅ Super admin user created:');
  console.log('   Email: admin@test.com');
  console.log('   Password: admin123');
  console.log('   User ID:', admin.userId);
}

seedAdmin()
  .then(() => {
    console.log('\n✅ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  });
