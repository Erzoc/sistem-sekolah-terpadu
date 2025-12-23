import { db } from '@/schemas/db';
import { usersTable } from '@/schemas/users';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { createId } from '@paralleldrive/cuid2';

async function seedUsers() {
  console.log('[SEED] Starting database seeding...');

  try {
    const tenantId = 'tenant_demo_001';
    
    const testUsers = [
      {
        userId: createId(),
        tenantId: tenantId,
        email: 'guru@test.id',
        fullName: 'Guru Kelas',
        passwordHash: await bcrypt.hash('Test@123', 10),
        role: 'guru' as const,
        nip: '198505012020121001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: createId(),
        tenantId: tenantId,
        email: 'admin@test.id',
        fullName: 'Admin Sekolah',
        passwordHash: await bcrypt.hash('Test@123', 10),
        role: 'admin_sekolah' as const,
        nip: '198605012020121002',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const user of testUsers) {
      const existing = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, user.email),
      });

      if (existing) {
        await db
          .update(usersTable)
          .set(user)
          .where(eq(usersTable.userId, existing.userId));
        console.log(`✅ Updated: ${user.email}`);
      } else {
        await db.insert(usersTable).values(user);
        console.log(`✅ Created: ${user.email}`);
      }
    }

    console.log('[SEED] ✅ Database seeding completed!');
    console.log('\n📝 Test Credentials:');
    console.log('   Email: guru@test.id');
    console.log('   Password: Test@123');
  } catch (error) {
    console.error('[SEED] ❌ Error:', error);
    process.exit(1);
  }
}

seedUsers();
