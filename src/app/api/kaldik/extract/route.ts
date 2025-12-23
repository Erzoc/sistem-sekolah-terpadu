import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { db } from "@/database/client";
import { kaldikFiles } from "@/schemas/kaldik-files";
import { eq, and } from "drizzle-orm";
import { join } from "path";
import { readFile } from "fs/promises";

// ✅ PENTING: Mencegah Next.js render statis saat build
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
          eq(kaldikFiles.tenantId, session.user.id)
        )
      )
      .limit(1);

    if (!rows || rows.length === 0) {
      return Response.json({ error: "File not found" }, { status: 404 });
    }

    const selectedFile = rows[0];

    // Update status ke processing
    await db.update(kaldikFiles)
      .set({ status: "processing" })
      .where(eq(kaldikFiles.fileId, fileId));

    // Baca file dari storage
    const pathToFile = join(process.cwd(), "public", selectedFile.storagePath);
    const fileBuffer = await readFile(pathToFile);

    // ✅ DYNAMIC IMPORT - Supaya tidak load saat build time
    const { extractKaldikData } = await import("@/lib/ai/kaldik-extractor");
    const result = await extractKaldikData(fileBuffer, selectedFile.mimeType);

    // Update DB dengan hasil
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
    
    // Update status error
    try {
      await db.update(kaldikFiles)
        .set({
          status: "failed",
          lastError: error.message || "Unknown error"
        })
        .where(eq(kaldikFiles.fileId, fileId));
    } catch (e) {
      // Ignore DB update error
    }

    return Response.json({ 
      error: error.message || "Failed to extract calendar data" 
    }, { status: 500 });
  }
}
