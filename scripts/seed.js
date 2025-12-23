const { db } = require('./src/database/client');
const { usersTable } = require('./src/schemas/users');
const { tenantsTable } = require('./src/schemas/tenants');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');
const { createId } = require('@paralleldrive/cuid2');

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Create tenant
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
      console.log('✅ Tenant created\n');
    } else {
      console.log('✅ Tenant exists\n');
    }

    // 2. Create users
    console.log('👥 Creating users...');
    
    const passwordHash = await bcrypt.hash('Test@123', 10);
    
    const testUsers = [
      {
        userId: createId(),
        tenantId: tenantId,
        email: 'guru@test.id',
        fullName: 'Guru Kelas',
        passwordHash: passwordHash,
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
        passwordHash: passwordHash,
        role: 'admin_sekolah',
        nip: '198605012020121002',
        phone: '081234567891',
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
        await db.insert(usersTable).values(user);
        console.log(`✅ Created: ${user.email}`);
      }
    }

    console.log('\n🎉 Seeding completed!\n');
    console.log('📝 Credentials:');
    console.log('   Email: guru@test.id');
    console.log('   Password: Test@123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDatabase();
