import { db } from '../src/database/client';
import { usersTable } from '../src/schemas/users';
import { tenantsTable } from '../src/schemas/tenants';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seedSuperAdmin() {
  try {
    console.log('🔍 Fetching tenant from database...');
    
    // Get ANY tenant (preferably first one)
    const tenants = await db.select().from(tenantsTable).limit(1);
    
    if (tenants.length === 0) {
      console.error('❌ No tenant found in database!');
      console.log('📝 Create tenant first: npx tsx scripts/create-default-tenant.ts');
      process.exit(1);
    }
    
    const tenant = tenants[0];
    console.log('✅ Using tenant:');
    console.log('   ID:', tenant.tenantId);
    console.log('   Name:', tenant.schoolName);
    console.log('   NPSN:', tenant.npsn);
    
    // Check if superadmin exists
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, 'superadmin@gurupintar.id'))
      .limit(1);
    
    if (existing.length > 0) {
      console.log('\n⚠️  SuperAdmin already exists!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: superadmin@gurupintar.id');
      console.log('🔑 Password: superadmin123');
      console.log('🏢 Tenant:', existing[0].tenantId);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      process.exit(0);
    }
    
    console.log('\n📝 Creating superadmin user...');
    
    const passwordHash = await bcrypt.hash('superadmin123', 10);
    
    const result = await db.insert(usersTable).values({
      email: 'superadmin@gurupintar.id',
      fullName: 'Super Administrator',
      passwordHash,
      role: 'super_admin',
      tenantId: tenant.tenantId, // ✅ Use ACTUAL tenant ID from DB
      status: 'active',
      phone: null,
      nip: null,
      nisn: null,
      inviteToken: null,
      inviteExpiresAt: null,
      lastLogin: null,
    });
    
    console.log('\n✅ SuperAdmin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: superadmin@gurupintar.id');
    console.log('🔑 Password: superadmin123');
    console.log('🏢 Tenant:', tenant.schoolName);
    console.log('🆔 Tenant ID:', tenant.tenantId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
    
  } catch (error: any) {
    console.error('\n❌ Error creating superadmin:', error.message);
    
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      console.log('\n💡 Foreign key constraint error - possible causes:');
      console.log('   1. Tenant ID not found in tenants table');
      console.log('   2. Database schema mismatch');
      console.log('\n🔧 Try:');
      console.log('   - npx drizzle-kit push (sync schema)');
      console.log('   - Check tenants table in Drizzle Studio');
    }
    
    process.exit(1);
  }
}

seedSuperAdmin();
