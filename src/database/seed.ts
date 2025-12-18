import { db } from './client';
import { tenantsTable, usersTable } from '@/schemas';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Create 3 test schools
    console.log('📚 Creating schools...');
    
    const schools = await db.insert(tenantsTable).values([
      {
        npsn: '12345678',
        schoolName: 'SMA Negeri 1 Jakarta',
        province: 'DKI Jakarta',
        city: 'Jakarta Pusat',
        address: 'Jl. Sudirman No. 1',
        phone: '021-1234567',
        email: 'info@sman1jakarta.sch.id',
        tokenBalance: 500,
      },
      {
        npsn: '87654321',
        schoolName: 'SMA Islam Al-Azhar',
        province: 'Jawa Barat',
        city: 'Bandung',
        address: 'Jl. Merdeka No. 10',
        phone: '022-7654321',
        email: 'admin@alazhar.sch.id',
        tokenBalance: 1000,
      },
      {
        npsn: '11223344',
        schoolName: 'SMA Cendekia Harapan',
        province: 'Jawa Timur',
        city: 'Surabaya',
        address: 'Jl. Pahlawan No. 5',
        phone: '031-9988776',
        email: 'info@cendekia.sch.id',
        tokenBalance: 1500,
      },
    ]).returning();

    console.log(`✅ Created ${schools.length} schools`);

    // 2. Create admin users for each school
    console.log('\n👤 Creating users...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await db.insert(usersTable).values([
      // Admin Sekolah 1
      {
        tenantId: schools[0].tenantId,
        role: 'admin_sekolah',
        email: 'admin@sman1jakarta.sch.id',
        passwordHash: hashedPassword,
        fullName: 'Admin SMAN 1 Jakarta',
        phone: '081234567890',
        status: 'active',
      },
      // Admin Sekolah 2
      {
        tenantId: schools[1].tenantId,
        role: 'admin_sekolah',
        email: 'admin@alazhar.sch.id',
        passwordHash: hashedPassword,
        fullName: 'Admin Al-Azhar',
        phone: '081234567891',
        status: 'active',
      },
      // Admin Sekolah 3
      {
        tenantId: schools[2].tenantId,
        role: 'admin_sekolah',
        email: 'admin@cendekia.sch.id',
        passwordHash: hashedPassword,
        fullName: 'Admin Cendekia',
        phone: '081234567892',
        status: 'active',
      },
      // Guru Sekolah 1
      {
        tenantId: schools[0].tenantId,
        role: 'guru',
        email: 'guru1@sman1jakarta.sch.id',
        passwordHash: hashedPassword,
        fullName: 'Budi Santoso',
        phone: '082345678901',
        nip: '197001011998031001',
        status: 'active',
      },
      // Siswa Sekolah 1
      {
        tenantId: schools[0].tenantId,
        role: 'siswa',
        email: 'siswa1@sman1jakarta.sch.id',
        passwordHash: hashedPassword,
        fullName: 'Ani Wijaya',
        phone: '083456789012',
        nisn: '0051234567',
        status: 'active',
      },
    ]).returning();

    console.log(`✅ Created ${users.length} users`);

    // 3. Summary
    console.log('\n📊 SEEDING SUMMARY:');
    console.log('═══════════════════════════════════════');
    console.log(`Schools: ${schools.length}`);
    console.log(`Users: ${users.length}`);
    console.log('═══════════════════════════════════════');
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login credentials (all users):');
    console.log('   Email: (see above)');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seed();
