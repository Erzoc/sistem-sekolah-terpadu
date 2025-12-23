import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/client';
import { usersTable } from '@/schemas/users';
import { tenantsTable } from '@/schemas/tenants';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// ============================================
// POST /api/auth/register
// Create new user account
// ============================================
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { email, password, name, role = 'guru' } = body;

    console.log('[REGISTER] 📝 New registration attempt:', email);

    // ============================================
    // VALIDATION
    // ============================================
    
    // Required fields
    if (!email || !password || !name) {
      console.log('[REGISTER] ❌ Missing required fields');
      return NextResponse.json(
        { error: 'Email, password, dan nama wajib diisi' },
        { status: 400 }
      );
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[REGISTER] ❌ Invalid email format:', email);
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Password strength
    if (password.length < 6) {
      console.log('[REGISTER] ❌ Password too short');
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // ============================================
    // GET DEFAULT TENANT
    // ============================================
    
    console.log('[REGISTER] 🔍 Fetching default tenant...');
    
    // Try to get active tenant first
    let tenants = await db
      .select()
      .from(tenantsTable)
      .where(eq(tenantsTable.status, 'active'))
      .limit(1);

    // If no active tenant, get any tenant
    if (tenants.length === 0) {
      console.log('[REGISTER] ⚠️  No active tenant, trying any tenant...');
      tenants = await db.select().from(tenantsTable).limit(1);
    }

    // If still no tenant, system not initialized
    if (tenants.length === 0) {
      console.log('[REGISTER] ❌ No tenant in database');
      return NextResponse.json(
        { 
          error: 'Sistem belum diinisialisasi. Hubungi administrator.',
          code: 'NO_TENANT'
        },
        { status: 500 }
      );
    }

    const defaultTenant = tenants[0];
    console.log('[REGISTER] ✅ Using tenant:', defaultTenant.schoolName);

    // ============================================
    // CHECK DUPLICATE EMAIL
    // ============================================
    
    console.log('[REGISTER] 🔍 Checking for duplicate email...');
    
    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUsers.length > 0) {
      console.log('[REGISTER] ❌ Email already registered:', email);
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan login atau gunakan email lain.' },
        { status: 409 }
      );
    }

    // ============================================
    // HASH PASSWORD
    // ============================================
    
    console.log('[REGISTER] 🔒 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // ============================================
    // INSERT NEW USER
    // ============================================
    
    console.log('[REGISTER] 📝 Creating user account...');
    
    const newUser = await db.insert(usersTable).values({
      // Authentication
      email: email.toLowerCase().trim(),
      passwordHash,
      
      // Profile
      fullName: name.trim(),
      
      // Role & Tenant
      role: role as 'guru' | 'admin_sekolah' | 'super_admin' | 'siswa' | 'ortu',
      tenantId: defaultTenant.tenantId,
      
      // Status
      status: 'active', // Auto-activate (or use 'pending' for email verification)
      
      // Optional fields
      phone: null,
      nip: null,
      nisn: null,
      
      // Invite system (not used for public registration)
      inviteToken: null,
      inviteExpiresAt: null,
      
      // Tracking
      lastLogin: null,
    }).returning();

    console.log('[REGISTER] ✅ User created successfully!');
    console.log('[REGISTER] 📧 Email:', email);
    console.log('[REGISTER] 👤 Name:', name);
    console.log('[REGISTER] 🎭 Role:', role);
    console.log('[REGISTER] 🏢 Tenant:', defaultTenant.schoolName);

    // ============================================
    // SUCCESS RESPONSE
    // ============================================
    
    return NextResponse.json(
      {
        success: true,
        message: 'Registrasi berhasil! Silakan login dengan akun Anda.',
        user: {
          email: email,
          name: name,
          role: role,
          tenantName: defaultTenant.schoolName,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    
    console.error('[REGISTER] 💥 Error during registration:', error);
    
    // Handle specific SQLite errors
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      console.error('[REGISTER] ❌ Foreign key constraint failed');
      console.error('[REGISTER] Possible cause: Invalid tenant_id reference');
      return NextResponse.json(
        { 
          error: 'Terjadi kesalahan konfigurasi sistem. Hubungi administrator.',
          code: 'FK_CONSTRAINT'
        },
        { status: 500 }
      );
    }

    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json(
        { error: 'Email sudah terdaftar.' },
        { status: 409 }
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
