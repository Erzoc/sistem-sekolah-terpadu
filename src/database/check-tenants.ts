import { db } from './client';
import { tenantsTable } from '../schemas/tenants';

async function checkTenants() {
  const tenants = await db.select().from(tenantsTable);
  console.log('Tenants Data:', JSON.stringify(tenants, null, 2));
}

checkTenants()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
