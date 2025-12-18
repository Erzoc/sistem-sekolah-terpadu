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
        schoolName: 'SMA Negeri 1 Medan',
        province: 'Sumatera Utara',
        city: 'Medan',
        address: 'Jl. Sudirman No. 1',
        phone: '021-1234567',
        email: 'info@sman1medan.sch.id',
        tokenBalance: 500,
      },
      {
        npsn: '87654321',
        schoolName: 'MA Ypi Nurul Hadina',
        province: 'Sumatera Utara',
        city: 'Deli Serdang',
        address: 'Jl. Pertahanan No. X',
        phone: '022-7654321',
        email: 'admin@ypi.sch.id',
        tokenBalance: 1000,
      },
      {
        npsn: '11223344',
        schoolName: 'SMA Cendekia Harapan',
        province: 'Sumatera Utara',
        city: 'Medan',
        address: 'Jl. Pahlawan No. 5',
        phone: '031-9988776',
        email: 'info@cendekia.sch.id',
        tokenBalance: 1500,
      },
    ]).returning();

    console.log(`✅ Created ${schools.length} schools`);

    // 2. Create admin users for each school
    console.log('\n👤 Creating users...');
    
     // Hash password yang mudah diingat
    const superAdminPassword = await bcrypt.hash('121212', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    const guruPassword = await bcrypt.hash('guru123', 10);
    const siswaPassword = await bcrypt.hash('siswa123', 10);

    const users = await db.insert(usersTable).values([
      // SUPER ADMIN (bisa akses semua sekolah)
      {
        tenantId: schools[0].tenantId, // linked ke sekolah pertama
        role: 'super_admin',
        email: 'superadmin',  // Username-style, bukan email
        passwordHash: superAdminPassword,
        fullName: 'Super Administrator',
        phone: '081234567890',
        status: 'active',
      },
  
      // Admin Sekolah 1
      {
        tenantId: schools[0].tenantId,
        role: 'admin_sekolah',
        email: 'admin@sman1medan.sch.id',
        passwordHash: adminPassword,
        fullName: 'Admin SMAN 1 Medan',
        phone: '081234567890',
        status: 'active',
      },
      // Admin Sekolah 2
      {
        tenantId: schools[1].tenantId,
        role: 'admin_sekolah',
        email: 'admin@ypi.sch.id',
        passwordHash: adminPassword,
        fullName: 'Admin YPI Nurul Hadina',
        phone: '081234567891',
        status: 'active',
      },
      // Admin Sekolah 3
      {
        tenantId: schools[2].tenantId,
        role: 'admin_sekolah',
        email: 'admin@cendekia.sch.id',
        passwordHash: adminPassword,
        fullName: 'Admin Cendekia',
        phone: '081234567892',
        status: 'active',
      },
      // Guru Sekolah 1
      {
        tenantId: schools[0].tenantId,
        role: 'guru',
        email: 'guru1@sman1medan.sch.id',
        passwordHash: guruPassword,
        fullName: 'Budi Santoso',
        phone: '082345678901',
        nip: '197001011998031001',
        status: 'active',
      },
      // Siswa Sekolah 1
      {
        tenantId: schools[0].tenantId,
        role: 'siswa',
        email: 'siswa1@sman1medan.sch.id',
        passwordHash: siswaPassword,
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
    console.log('\n📝 LOGIN CREDENTIALS (MUDAH DIINGAT!):');
    console.log('═══════════════════════════════════════');
    console.log('SUPER ADMIN:');
    console.log('  Username: superadmin');
    console.log('  Password: 121212');
    console.log('');
    console.log('ADMIN SEKOLAH:');
    console.log('  Username: admin1 / admin2 / admin3');
    console.log('  Password: admin123');
    console.log('');
    console.log('GURU:');
    console.log('  Username: guru1');
    console.log('  Password: guru123');
    console.log('');
    console.log('SISWA:');
    console.log('  Username: siswa1');
    console.log('  Password: siswa123');
    console.log('═══════════════════════════════════════');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seed();