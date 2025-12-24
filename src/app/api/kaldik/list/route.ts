import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/schemas';
import { kaldikFiles } from '@/schemas/kaldik-files';
import { eq } from 'drizzle-orm';
// ✅ FORCE DYNAMIC untuk menghindari static generation
export const dynamic = 'force-dynamic';

// ✅ TAMBAH: Suppress revalidate (optional)
export const revalidate = 0;
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const files = await db
      .select()
      .from(kaldikFiles)
      .where(eq(kaldikFiles.tenantId, session.user.tenantId || 'default'));

    return Response.json({ files });
  } catch (error) {
    console.error('List error:', error);
    return Response.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
