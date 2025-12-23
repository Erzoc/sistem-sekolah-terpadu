const { db } = require('./src/database/client');
const { usersTable } = require('./src/schemas/users');
const { eq, or } = require('drizzle-orm');

async function updatePasswords() {
  try {
    const newHash = '$2b$10$YJM9l5jTUQUNU2.OpmxpGesIIHnanDr07GcXi9.yOgWXNOj4Jq5oK';
    
    // Update all test users with same password
    const result = await db
      .update(usersTable)
      .set({ 
        passwordHash: newHash,
        updatedAt: new Date()
      })
      .where(
        or(
          eq(usersTable.email, 'guru@test.id'),
          eq(usersTable.email, 'admin@test.id'),
          eq(usersTable.email, 'superadmin@test.id')
        )
      );
    
    console.log('✅ Password hash updated for all test users');
    
    // Verify
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, 'guru@test.id'))
      .limit(1);
    
    if (users.length > 0) {
      console.log('\n=== VERIFICATION ===');
      console.log('Email:', users[0].email);
      console.log('Hash length:', users[0].passwordHash.length);
      console.log('Hash preview:', users[0].passwordHash.substring(0, 30) + '...');
      console.log('====================\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updatePasswords();
