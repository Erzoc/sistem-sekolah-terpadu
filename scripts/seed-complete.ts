import { db } from '../src/database/client';
import { usersTable } from '../src/schemas/users';
import { tenantsTable } from '../src/schemas/tenants';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function seedComplete() {
  console.log('🌱 Starting complete database seeding...\n');

  try {
    // 1. Create or get tenant
    console.log('📦 Step 1: Creating tenant...');
    const tenantId = 'tenant_demo_001';
    
    const existingTenant = await db
      .select()
      .from(tenantsTable)
      .where(eq(tenantsTable.tenantId, tenantId))
      .limit(1);

    if (existingTenant.length === 0) {
      await db.insert(tenantsTable).values({
        tenantId: tenantId,
        npsn: '10000001',
        schoolName: 'SMA Demo GuruPintar',
        province: 'DKI Jakarta',
        city: 'Jakarta Pusat',
        address: 'Jl. Demo No. 123, Jakarta',
        phone: '021-12345678',
        email: 'admin@demo.school.id',
        status: 'active',
        subscriptionTier: 'professional',
        tokenBalance: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Tenant created: SMA Demo GuruPintar\n');
    } else {
      console.log('✅ Tenant already exists\n');
    }

    // 2. Create test users
    console.log('👥 Step 2: Creating test users...');
    
    const testUsers = [
      {
        email: 'guru@test.id',
        fullName: 'Guru Demo',
        role: 'guru',
        nip: '198505012020121001',
      },
      {
        email: 'admin@test.id',
        fullName: 'Admin Sekolah',
        role: 'admin_sekolah',
        nip: '198605012020121002',
      },
      {
        email: 'superadmin@test.id',
        fullName: 'Super Admin',
        role: 'super_admin',
        nip: null,
      },
    ];

    for (const userData of testUsers) {
      const existing = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, userData.email))
        .limit(1);

      const passwordHash = await bcrypt.hash('Test@123', 10);

      if (existing.length > 0) {
        await db
          .update(usersTable)
          .set({
            passwordHash: passwordHash,
            fullName: userData.fullName,
            role: userData.role,
            updatedAt: new Date(),
          })
          .where(eq(usersTable.email, userData.email));
        console.log(`✅ Updated: ${userData.email}`);
      } else {
        await db.insert(usersTable).values({
          tenantId: tenantId,
          email: userData.email,
          fullName: userData.fullName,
          passwordHash: passwordHash,
          role: userData.role,
          nip: userData.nip,
          phone: null,
          nisn: null,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created: ${userData.email}`);
      }
    }

    console.log('\n🎉 Database seeding completed!\n');
    console.log('╔════════════════════════════════════════╗');
    console.log('║       TEST CREDENTIALS                 ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log('📧 Email: guru@test.id');
    console.log('🔑 Password: Test@123');
    console.log('');
    console.log('📧 Email: admin@test.id');
    console.log('🔑 Password: Test@123');
    console.log('');
    console.log('📧 Email: superadmin@test.id');
    console.log('🔑 Password: Test@123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding error:', error);
    process.exit(1);
  }
}

seedComplete();
