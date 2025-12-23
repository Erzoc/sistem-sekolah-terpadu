import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { db } from "@/database/client";
import { kaldikFiles } from "@/schemas/kaldik-files";
import { eq, and } from "drizzle-orm";
import { extractKaldikData } from "@/lib/ai/kaldik-extractor";
import { join } from "path";
import { readFile } from "fs/promises";

// ✅ PENTING: Mencegah Next.js mencoba render statis saat build
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const fileId = body.fileId;

  if (!fileId) {
    return Response.json({ error: "Missing fileId" }, { status: 400 });
  }

  try {
    const rows = await db
      .select()
      .from(kaldikFiles)
      .where(
        and(
          eq(kaldikFiles.fileId, fileId),
          // Gunakan user ID jika tenantId belum ready di session
          // eq(kaldikFiles.tenantId, session.user.tenantId) 
          eq(kaldikFiles.tenantId, session.user.id) // Fallback aman
        )
      )
      .limit(1);

    if (!rows || rows.length === 0) {
      return Response.json({ error: "File not found" }, { status: 404 });
    }

    // AMBIL OBJEK DARI ARRAY
    const selectedFile = rows[0];

    // Mulai proses
    await db.update(kaldikFiles)
      .set({ status: "processing" })
      .where(eq(kaldikFiles.fileId, fileId));

    const pathToFile = join(process.cwd(), "public", selectedFile.storagePath);
    const fileBuffer = await readFile(pathToFile);

    // AI Ekstraksi - pastikan di dalam try-catch
    const result = await extractKaldikData(fileBuffer, selectedFile.mimeType);

    // Update DB
    await db.update(kaldikFiles)
      .set({
        status: "completed",
        extractedData: JSON.stringify(result),
        processedAt: new Date()
      })
      .where(eq(kaldikFiles.fileId, fileId));

    return Response.json({ success: true, data: result });
  } catch (error: any) {
    console.error("ROUTE_ERROR:", error);
    
    // Attempt to update error status
    try {
      await db.update(kaldikFiles)
        .set({
          status: "failed",
          lastError: error.message || "Unknown error"
        })
        .where(eq(kaldikFiles.fileId, fileId));
    } catch (e) {
      // Ignore update error
    }

    return Response.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
