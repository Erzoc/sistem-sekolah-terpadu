// src/app/api/kaldik/upload/route.ts
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { db } from "@/database/client";
import { kaldikFiles } from "@/schemas/kaldik-files";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json(
        {
          error: `File too large. Max 10MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        },
        { status: 400 }
      );
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Invalid file type. Use PDF, JPG, or PNG" },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), "public", "uploads", "kaldik");
    await mkdir(uploadDir, { recursive: true });

    const fileId = nanoid();
    const fileExt = file.name.split(".").pop() ?? "bin";
    const fileName = `${fileId}.${fileExt}`;
    const filePath = join(uploadDir, fileName);

    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    const storagePath = `/uploads/kaldik/${fileName}`;

    await db.insert(kaldikFiles).values({
      fileId,
      tenantId: session.user.tenantId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      storagePath,
      status: "pending",
    });

    console.log("✅ File uploaded:", fileName);

    return Response.json({ fileId, message: "File uploaded successfully" });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
