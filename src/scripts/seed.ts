import { db } from '@/database/client';
import { users, studentsTable, teachersTable, classesTable, subjectsTable, tenantsTable } from '@/schemas';
import { authService } from '@/lib/services';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // DISABLE FOREIGN KEY CHECKS
    await db.run(sql`PRAGMA foreign_keys = OFF`);
    console.log('🔓 Foreign key checks disabled');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.delete(studentsTable);
    await db.delete(teachersTable);
    await db.delete(classesTable);
    await db.delete(subjectsTable);
    await db.delete(users);
    await db.delete(tenantsTable);

    // ========== CREATE TENANTS ==========
    console.log('🏢 Creating tenants...');
    
    const tenant1Id = 'school-1';
    const tenant2Id = 'school-2';
    
    await db.insert(tenantsTable).values([
      {
        tenantId: tenant1Id,
        schoolName: 'SMK Negeri 1 Jakarta',
        npsn: '10101010',
        address: 'Jl. Pendidikan No. 1, Jakarta Pusat',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: '10110',
        phone: '021-12345678',
        email: 'info@smkn1jakarta.sch.id',
        website: 'https://smkn1jakarta.sch.id',
        principalName: 'Dr. Ahmad Suryadi, M.Pd',
        principalPhone: '081234567890',
        isActive: true,
        createdAt: new Date(),
      },
      {
        tenantId: tenant2Id,
        schoolName: 'SMK Negeri 2 Jakarta',
        npsn: '10101011',
        address: 'Jl. Pendidikan No. 2, Jakarta Selatan',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: '12150',
        phone: '021-87654321',
        email: 'info@smkn2jakarta.sch.id',
        website: 'https://smkn2jakarta.sch.id',
        principalName: 'Dra. Siti Nurhaliza, M.Pd',
        principalPhone: '081234567899',
        isActive: true,
        createdAt: new Date(),
      },
    ] as any);

    // Hash password
    const hashedPassword = await authService.hashPassword('password');

    // ========== CREATE USERS ==========
    console.log('👥 Creating users...');
    
    await db.insert(users).values([
      {
        email: 'superadmin@dashboard.com',
        passwordHash: hashedPassword,
        fullName: 'Super Admin',
        role: 'super_admin',
        tenantId: tenant1Id, // ⬅ Use valid tenantId instead of empty
        status: 'active',
        phone: '081234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'admin@school1.com',
        passwordHash: hashedPassword,
        fullName: 'Admin Sekolah 1',
        role: 'admin_sekolah',
        tenantId: tenant1Id,
        status: 'active',
        phone: '081234567891',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'admin@school2.com',
        passwordHash: hashedPassword,
        fullName: 'Admin Sekolah 2',
        role: 'admin_sekolah',
        tenantId: tenant2Id,
        status: 'active',
        phone: '081234567892',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'guru@school1.com',
        passwordHash: hashedPassword,
        fullName: 'Budi Santoso',
        role: 'guru',
        tenantId: tenant1Id,
        status: 'active',
        phone: '081234567893',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'siswa@school1.com',
        passwordHash: hashedPassword,
        fullName: 'Andi Wijaya',
        role: 'siswa',
        tenantId: tenant1Id,
        status: 'active',
        phone: '081234567894',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as any);

    // ========== CREATE SUBJECTS ==========
    console.log('📚 Creating subjects...');
    
    await db.insert(subjectsTable).values([
      {
        subjectName: 'Matematika',
        subjectCode: 'MTK',
        description: 'Matematika Wajib',
        tenantId: tenant1Id,
        createdAt: new Date(),
      },
      {
        subjectName: 'Fisika',
        subjectCode: 'FIS',
        description: 'Fisika',
        tenantId: tenant1Id,
        createdAt: new Date(),
      },
      {
        subjectName: 'Kimia',
        subjectCode: 'KIM',
        description: 'Kimia',
        tenantId: tenant1Id,
        createdAt: new Date(),
      },
      {
        subjectName: 'Bahasa Inggris',
        subjectCode: 'ENG',
        description: 'English Language',
        tenantId: tenant1Id,
        createdAt: new Date(),
      },
    ] as any).returning();

    // ========== CREATE CLASSES ==========
    console.log('🏫 Creating classes...');
    
    const classes = await db.insert(classesTable).values([
      {
        className: 'XII IPA 1',
        level: '12',
        tenantId: tenant1Id,
        academicYearId: '2024-2025',
        capacity: 32,
        createdAt: new Date(),
      },
      {
        className: 'XII IPA 2',
        level: '12',
        tenantId: tenant1Id,
        academicYearId: '2024-2025',
        capacity: 30,
        createdAt: new Date(),
      },
      {
        className: 'XI IPA 1',
        level: '11',
        tenantId: tenant1Id,
        academicYearId: '2024-2025',
        capacity: 28,
        createdAt: new Date(),
      },
    ] as any).returning();

    // ========== CREATE TEACHERS ==========
    console.log('👨‍🏫 Creating teachers...');
    
    await db.insert(teachersTable).values([
      {
        userId: 'teacher-user-1',
        nip: '199001012020011001',
        fullName: 'Budi Santoso, S.Pd',
        email: 'budi@school1.com',
        phone: '081234567895',
        tenantId: tenant1Id,
        status: 'active',
        createdAt: new Date(),
      },
      {
        userId: 'teacher-user-2',
        nip: '199002022020012002',
        fullName: 'Ani Setyawati, S.Si',
        email: 'ani@school1.com',
        phone: '081234567896',
        tenantId: tenant1Id,
        status: 'active',
        createdAt: new Date(),
      },
      {
        userId: 'teacher-user-3',
        nip: '199003032020013003',
        fullName: 'Joko Widodo, M.Pd',
        email: 'joko@school1.com',
        phone: '081234567897',
        tenantId: tenant1Id,
        status: 'active',
        createdAt: new Date(),
      },
    ] as any);

        // ========== CREATE STUDENTS ==========
    console.log('🎓 Creating students...');
    
    const studentNames = [
      'Andi Wijaya', 'Budi Hartono', 'Citra Dewi', 'Dian Sari',
      'Eko Prasetyo', 'Fitri Handayani', 'Gilang Ramadhan', 'Hana Putri',
      'Irfan Hakim', 'Jihan Aulia', 'Kevin Tanaka', 'Lina Marlina',
      'Muhammad Rizki', 'Nisa Azzahra', 'Oscar Pratama', 'Putri Utami',
    ];

    const students = studentNames.map((name, index) => ({
      userId: `student-user-${index + 1}`,  // ⬅ ADD userId
      nisn: `00123456${String(index + 1).padStart(2, '0')}`,
      fullName: name,
      email: `${name.toLowerCase().replace(' ', '.')}@student.com`,
      phone: `08123456${String(7900 + index)}`,
      dateOfBirth: new Date(2007, Math.floor(index / 4), (index % 28) + 1),
      gender: index % 2 === 0 ? 'L' : 'P',
      address: `Jl. Pendidikan No. ${index + 1}, Jakarta`,
      classId: classes[index % 3]?.classId,
      tenantId: tenant1Id,
      createdAt: new Date(),
    }));

    await db.insert(studentsTable).values(students as any);


    // RE-ENABLE FOREIGN KEY CHECKS
    await db.run(sql`PRAGMA foreign_keys = ON`);
    console.log('🔒 Foreign key checks re-enabled');

    console.log('✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  ✓ 2 tenants (schools)');
    console.log('  ✓ 5 users (1 super admin, 2 school admins, 1 teacher, 1 student)');
    console.log('  ✓ 4 subjects');
    console.log('  ✓ 3 classes');
    console.log('  ✓ 3 teachers');
    console.log('  ✓ 16 students');
    console.log('\n🔑 Demo Credentials:');
    console.log('  Super Admin: superadmin@dashboard.com / password');
    console.log('  School Admin: admin@school1.com / password');
    console.log('  Teacher: guru@school1.com / password');
    console.log('  Student: siswa@school1.com / password');
    console.log('\n🚀 Ready! Run: npm run dev');

  } catch (error) {
    // Re-enable FK on error
    await db.run(sql`PRAGMA foreign_keys = ON`);
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('\n👋 Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error');
    process.exit(1);
  });
