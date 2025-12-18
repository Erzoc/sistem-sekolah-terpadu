import { db } from './client';
import { 
  tenantsTable, 
  usersTable, 
  academicYearsTable, 
  classesTable, 
  subjectsTable 
} from '@/schemas';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');

    const tables = [
      { name: 'tenants', table: tenantsTable },
      { name: 'users', table: usersTable },
      { name: 'academic_years', table: academicYearsTable },
      { name: 'classes', table: classesTable },
      { name: 'subjects', table: subjectsTable },
    ];

    for (const { name, table } of tables) {
      const rows = await db.select().from(table);
      console.log(`✅ ${name}: ${rows.length} rows`);
    }

    console.log('\n🎉 Database connection test PASSED!');
  } catch (error) {
    console.error('❌ Database connection test FAILED:', error);
    process.exit(1);
  }
}

testConnection();
