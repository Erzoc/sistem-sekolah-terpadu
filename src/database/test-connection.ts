import { db } from './client';
import { tenantsTable, usersTable } from '@/schemas';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test 1: Query tenants table
    console.log('Test 1: Query tenants table');
    const tenants = await db.select().from(tenantsTable);
    console.log('✅ Tenants table accessible');
    console.log('   Rows found:', tenants.length);

    // Test 2: Query users table
    console.log('\nTest 2: Query users table');
    const users = await db.select().from(usersTable);
    console.log('✅ Users table accessible');
    console.log('   Rows found:', users.length);

    console.log('\n🎉 Database connection test PASSED!');
  } catch (error) {
    console.error('❌ Database connection test FAILED:', error);
    process.exit(1);
  }
}

// Run test
testConnection();
