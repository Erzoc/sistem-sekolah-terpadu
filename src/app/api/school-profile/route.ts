import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { db } from "@/schemas";
import {
  schoolProfilesTable,
  SchoolProfile,
  NewSchoolProfile,
} from "@/schemas/school_profiles";
import { eq } from "drizzle-orm";

// GET: Fetch school profile untuk tenant
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tenantId = session.user.tenantId;

    // 🔒 Multi-tenant: Filter by tenantId
    const profile = await db
      .select()
      .from(schoolProfilesTable)
      .where(eq(schoolProfilesTable.tenantId, tenantId))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile: profile[0] });
  } catch (error) {
    console.error("GET /api/school-profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create atau Update school profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as NewSchoolProfile & {
      tenantId: string;
    };

    if (!body.schoolName || !body.tenantId) {
      return NextResponse.json(
        { error: "schoolName dan tenantId harus diisi" },
        { status: 400 }
      );
    }

    // 🔒 Security: Pastikan user hanya bisa update profile sendiri
    if (body.tenantId !== session.user.tenantId) {
      return NextResponse.json(
        { error: "Forbidden: Cannot update other tenant's profile" },
        { status: 403 }
      );
    }

    // Cek apakah profile sudah ada
    const existing = await db
      .select()
      .from(schoolProfilesTable)
      .where(eq(schoolProfilesTable.tenantId, body.tenantId))
      .limit(1);

    let result: SchoolProfile;

    if (existing.length > 0) {
      // UPDATE
      const updated = await db
        .update(schoolProfilesTable)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(schoolProfilesTable.profileId, existing[0].profileId))
        .returning();

      result = updated[0];
    } else {
      // INSERT
      const inserted = await db
        .insert(schoolProfilesTable)
        .values({
          ...body,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as NewSchoolProfile)
        .returning();

      result = inserted[0];
    }

    return NextResponse.json({
      success: true,
      profile: result,
      message: existing.length > 0
        ? "Profile berhasil diperbarui"
        : "Profile berhasil dibuat",
    });
  } catch (error) {
    console.error("POST /api/school-profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Soft delete school profile (optional)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tenantId = session.user.tenantId;

    // 🔒 Multi-tenant: Cek ownership
    const profile = await db
      .select()
      .from(schoolProfilesTable)
      .where(eq(schoolProfilesTable.tenantId, tenantId))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json(
        { error: "Profile tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update isActive to false (soft delete)
    const deleted = await db
      .update(schoolProfilesTable)
      .set({ isActive: false })
      .where(eq(schoolProfilesTable.profileId, profile[0].profileId))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Profile berhasil dihapus",
      profile: deleted[0],
    });
  } catch (error) {
    console.error("DELETE /api/school-profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
