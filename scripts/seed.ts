import { db } from '../src/database/client';
import { usersTable } from '../src/schemas/users';
import { tenantsTable } from '../src/schemas/tenants';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createId } from '@paralleldrive/cuid2';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Create or get tenant
    console.log('📦 Creating tenant...');
    const tenantId = 'tenant_demo_001';
    
    const existingTenant = await db
      .select()
      .from(tenantsTable)
      .where(eq(tenantsTable.tenantId, tenantId))
      .limit(1);
    
    if (existingTenant.length === 0) {
      await db.insert(tenantsTable).values({
        tenantId: tenantId,
        name: 'Sekolah Demo',
        domain: 'demo.schoolsuper.tools',
        subscriptionPlan: 'premium',
        maxUsers: 100,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Tenant created: Sekolah Demo\n');
    } else {
      console.log('✅ Tenant already exists\n');
    }

    // 2. Create test users
    console.log('👥 Creating test users...');
    
    const testUsers = [
      {
        userId: createId(),
        tenantId: tenantId,
        email: 'guru@test.id',
        fullName: 'Guru Kelas',
        passwordHash: await bcrypt.hash('Test@123', 10),
        role: 'guru',
        nip: '198505012020121001',
        phone: '081234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: createId(),
        tenantId: tenantId,
        email: 'admin@test.id',
        fullName: 'Admin Sekolah',
        passwordHash: await bcrypt.hash('Test@123', 10),
        role: 'admin_sekolah',
        nip: '198605012020121002',
        phone: '081234567891',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: createId(),
        tenantId: tenantId,
        email: 'superadmin@test.id',
        fullName: 'Super Admin',
        passwordHash: await bcrypt.hash('Test@123', 10),
        role: 'super_admin',
        phone: '081234567892',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const user of testUsers) {
      const existing = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, user.email))
        .limit(1);

      if (existing.length > 0) {
        // Update existing user
        await db
          .update(usersTable)
          .set({
            passwordHash: user.passwordHash,
            fullName: user.fullName,
            role: user.role,
            updatedAt: new Date(),
          })
          .where(eq(usersTable.email, user.email));
        console.log(`✅ Updated: ${user.email}`);
      } else {
        // Insert new user
        await db.insert(usersTable).values(user);
        console.log(`✅ Created: ${user.email}`);
      }
    }

    console.log('\n🎉 Database seeding completed!\n');
    console.log('📝 Test Credentials:');
    console.log('   Email: guru@test.id');
    console.log('   Password: Test@123');
    console.log('\n   Email: admin@test.id');
    console.log('   Password: Test@123');
    console.log('\n   Email: superadmin@test.id');
    console.log('   Password: Test@123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
