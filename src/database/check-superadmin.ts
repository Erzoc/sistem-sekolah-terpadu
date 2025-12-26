import { db } from './client';
import { usersTable } from '../schemas/users';
import { eq } from 'drizzle-orm';

async function checkSuperAdmin() {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, 'superadmin@gurupintar.id'))
    .limit(1);

  console.log('SuperAdmin User Data:', JSON.stringify(user, null, 2));
}

checkSuperAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
