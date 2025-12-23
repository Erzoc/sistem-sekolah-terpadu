import { db } from '../src/database/client';
import { tenantsTable } from '../src/schemas/tenants';

async function createDefaultTenant() {
  try {
    console.log('Creating default tenant...');
    
    await db.insert(tenantsTable).values({
      npsn: '00000000', // Default NPSN
      schoolName: 'GuruPintar Demo School',
      province: 'DKI Jakarta',
      city: 'Jakarta Pusat',
      address: 'Jl. Demo No. 123, Jakarta',
      phone: '021-12345678',
      email: 'demo@gurupintar.id',
      status: 'active',
      subscriptionTier: 'professional',
      tokenBalance: 1000,
    });
    
    console.log('✅ Default tenant created successfully');
    process.exit(0);
  } catch (error: any) {
    if (error?.message?.includes('UNIQUE constraint failed')) {
      console.log('⚠️  Tenant already exists (NPSN: 00000000)');
      process.exit(0);
    }
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createDefaultTenant();
