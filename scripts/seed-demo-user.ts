// scripts/seed-demo-user.ts
import { db } from "../src/database/client";
import { usersTable, tenantsTable } from "../src/schemas";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seedDemoData() {
  try {
    console.log("🌱 [SEED] Starting seed process...");
    console.log("");

    // ========================================================================
    // STEP 1: CREATE DEMO TENANT (School)
    // ========================================================================
    console.log("📋 [SEED] Step 1: Checking tenant...");
    
    const existingTenant = await db
      .select()
      .from(tenantsTable)
      .where(eq(tenantsTable.npsn, "99999999"))  // NPSN demo
      .limit(1);

    let tenantId: string;

    if (existingTenant.length === 0) {
      console.log("📋 [SEED] Creating demo tenant (school)...");
      
      const newTenant = await db.insert(tenantsTable).values({
        // tenantId akan auto-generate oleh createId()
        npsn: "99999999",
        schoolName: "SMA Demo Guru Pintar",
        province: "DKI Jakarta",
        city: "Jakarta Selatan",
        address: "Jl. Demo No. 123, Jakarta",
        phone: "021-12345678",
        email: "admin@demo-school.com",
        status: "active",
        subscriptionTier: "professional",
        tokenBalance: 10000,  // Banyak token untuk demo
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      tenantId = newTenant[0].tenantId;
      console.log(`✅ [SEED] Demo tenant created with ID: ${tenantId}`);
    } else {
      tenantId = existingTenant[0].tenantId;
      console.log(`✅ [SEED] Demo tenant already exists with ID: ${tenantId}`);
    }

    console.log("");

    // ========================================================================
    // STEP 2: CREATE DEMO USER (Teacher)
    // ========================================================================
    console.log("👤 [SEED] Step 2: Checking demo user...");
    
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, "demo@guru.com"))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("✅ [SEED] Demo user already exists");
      console.log("");
      console.log("🎉 Seed check completed!");
      console.log("   Email: demo@guru.com");
      console.log("   Password: demo123");
      return;
    }

    console.log("👤 [SEED] Creating demo user...");
    const passwordHash = await bcrypt.hash("demo123", 10);

    await db.insert(usersTable).values({
      // userId akan auto-generate oleh createId()
      tenantId: tenantId,  // ✅ Pakai tenantId yang baru dibuat
      role: "guru",
      email: "demo@guru.com",
      passwordHash,
      fullName: "Demo Guru",
      phone: "081234567890",
      nip: "1234567890123456",  // NIP demo untuk guru
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ [SEED] Demo user created!");
    console.log("");
    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║           🎉 SEED COMPLETED SUCCESSFULLY! 🎉         ║");
    console.log("╚════════════════════════════════════════════════════════╝");
    console.log("");
    console.log("📋 TENANT INFO:");
    console.log(`   School: SMA Demo Guru Pintar`);
    console.log(`   NPSN: 99999999`);
    console.log(`   Tenant ID: ${tenantId}`);
    console.log("");
    console.log("👤 DEMO USER:");
    console.log("   Email: demo@guru.com");
    console.log("   Password: demo123");
    console.log("   Role: guru");
    console.log("");
    console.log("🚀 Ready to test login at: http://localhost:3000/login");
    console.log("");

  } catch (err) {
    console.error("");
    console.error("❌ [SEED] Error:", err);
    console.error("");
    process.exit(1);
  }
}

seedDemoData();
