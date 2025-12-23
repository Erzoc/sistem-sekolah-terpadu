#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Teacher Toolbox - Complete Auth Setup Automation Script
  
.DESCRIPTION
  Auto-creates semua file auth, seed database, dan verifikasi setup
  
.EXAMPLE
  .\auth-setup.ps1
  
.NOTES
  Run dari project root: C:\super app\sstf\sstv1\
#>

param(
    [switch]$SkipDeps,
    [switch]$SkipSeed,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# ==================== COLORS ====================
function Write-Success { Write-Host "✅ $args" -ForegroundColor Green }
function Write-Error  { Write-Host "❌ $args" -ForegroundColor Red }
function Write-Warn   { Write-Host "⚠️  $args" -ForegroundColor Yellow }
function Write-Info   { Write-Host "ℹ️  $args" -ForegroundColor Cyan }
function Write-Step   { Write-Host "`n>>> $args" -ForegroundColor Magenta }

# ==================== FUNCTIONS ====================

function Test-Prerequisites {
    Write-Step "Checking Prerequisites..."
    
    # Check Node
    $node = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Node.js not installed"
        exit 1
    }
    Write-Success "Node.js: $node"
    
    # Check npm
    $npm = npm --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm not installed"
        exit 1
    }
    Write-Success "npm: $npm"
    
    # Check .env.local
    if (-not (Test-Path ".env.local")) {
        Write-Error ".env.local not found"
        Write-Warn "Create it with these vars:"
        Write-Warn "  NEXTAUTH_URL=http://localhost:3000"
        Write-Warn "  NEXTAUTH_SECRET=5WEblRVP3FMq6UKa720ZfOmdsSXIxN1CwpAriTevBYk8Quyj"
        Write-Warn "  DATABASE_URL=./dev.db"
        exit 1
    }
    Write-Success ".env.local exists"
    
    # Check database
    if (-not (Test-Path "dev.db")) {
        Write-Warn "dev.db not found - will be created on first run"
    } else {
        Write-Success "dev.db exists"
    }
    
    # Check package.json
    if (-not (Test-Path "package.json")) {
        Write-Error "package.json not found"
        exit 1
    }
    Write-Success "package.json exists"
}

function Install-Dependencies {
    if ($SkipDeps) {
        Write-Warn "Skipping dependency installation (--SkipDeps)"
        return
    }
    
    Write-Step "Installing Dependencies..."
    
    # Check if bcryptjs already installed
    $bcryptInstalled = npm ls bcryptjs 2>$null | Select-String "bcryptjs" | Select-Object -First 1
    
    if (-not $bcryptInstalled) {
        Write-Info "Installing bcryptjs..."
        npm install bcryptjs 2>&1 | Out-Null
        npm install -D @types/bcryptjs 2>&1 | Out-Null
        Write-Success "bcryptjs installed"
    } else {
        Write-Success "bcryptjs already installed"
    }
}

function Create-LoginPage {
    Write-Step "Creating Login Page..."
    
    $loginPath = "src/app/login/page.tsx"
    
    if (Test-Path $loginPath) {
        Write-Warn "Login page already exists, skipping..."
        return
    }
    
    $content = @'
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/guru';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError(result?.error || 'Email atau password salah');
        return;
      }

      router.push(callbackUrl);
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            📚 Teacher Toolbox
          </h1>
          <p className="text-slate-600">Masuk ke akun Anda untuk lanjut</p>
        </div>

        {(error || errorParam) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
            <p className="text-red-700 font-medium">⚠️ Login Gagal</p>
            <p className="text-red-600 mt-1">
              {error || 'Terjadi kesalahan saat login'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.id"
                required
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-50"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-700">
                <input type="checkbox" className="mr-2" />
                Ingat saya
              </label>
              <Link href="#" className="text-teal-600 hover:text-teal-700">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition"
            >
              {isLoading ? '⏳ Sedang masuk...' : '✓ Masuk'}
            </button>
          </div>
        </form>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="text-blue-900 font-medium">🧪 Test Credentials (Dev)</p>
            <div className="mt-2 space-y-1 text-blue-700 font-mono text-xs">
              <p>Email: guru@test.id</p>
              <p>Password: Test@123</p>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-slate-600">
          <p>Belum punya akun?</p>
          <p className="mt-1">Hubungi administrator sekolah Anda</p>
        </div>
      </div>
    </div>
  );
}
'@
    
    New-Item -Path $loginPath -ItemType File -Force | Out-Null
    Set-Content -Path $loginPath -Value $content -Encoding UTF8
    Write-Success "Created: $loginPath"
}

function Create-LogoutRoute {
    Write-Step "Creating Logout Route..."
    
    $logoutPath = "src/app/api/auth/logout/route.ts"
    
    if (Test-Path $logoutPath) {
        Write-Warn "Logout route already exists, skipping..."
        return
    }
    
    $content = @'
export async function GET() {
  return Response.redirect(new URL('/login?logged-out=true', process.env.NEXTAUTH_URL), 307);
}

export async function POST() {
  return Response.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
}
'@
    
    New-Item -Path $logoutPath -ItemType File -Force | Out-Null
    Set-Content -Path $logoutPath -Value $content -Encoding UTF8
    Write-Success "Created: $logoutPath"
}

function Create-Middleware {
    Write-Step "Creating Auth Middleware..."
    
    if (Test-Path "src/middleware.ts") {
        Write-Warn "Middleware already exists, skipping..."
        return
    }
    
    $content = @'
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    return null;
  },
  {
    pages: {
      signIn: '/login',
      error: '/login?error=callback',
    },
  }
);

export const config = {
  matcher: [
    '/guru/:path*',
    '/api/school-profile/:path*',
  ],
};
'@
    
    New-Item -Path "src/middleware.ts" -ItemType File -Force | Out-Null
    Set-Content -Path "src/middleware.ts" -Value $content -Encoding UTF8
    Write-Success "Created: src/middleware.ts"
}

function Create-AuthHook {
    Write-Step "Creating Auth Session Hook..."
    
    if (Test-Path "src/hooks/useAuthSession.ts") {
        Write-Warn "Auth hook already exists, skipping..."
        return
    }
    
    $content = @'
'use client';

import { useSession, useRouter } from 'next-auth/react';
import { useEffect } from 'react';

export function useAuthSession(redirectTo: string = '/login') {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [status, router, redirectTo]);

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
    tenantId: (session?.user as any)?.tenantId,
  };
}
'@
    
    New-Item -Path "src/hooks/useAuthSession.ts" -ItemType File -Force | Out-Null
    Set-Content -Path "src/hooks/useAuthSession.ts" -Value $content -Encoding UTF8
    Write-Success "Created: src/hooks/useAuthSession.ts"
}

function Create-Seeder {
    Write-Step "Creating Database Seeder..."
    
    if (-not (Test-Path "scripts")) {
        New-Item -ItemType Directory -Path "scripts" | Out-Null
    }
    
    $seedPath = "scripts/seed-users.ts"
    
    if (Test-Path $seedPath) {
        Write-Warn "Seeder already exists, skipping..."
        return
    }
    
    $content = @'
import { db } from '@/schemas/db';
import { usersTable } from '@/schemas/users';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { createId } from '@paralleldrive/cuid2';

async function seedUsers() {
  console.log('[SEED] Starting database seeding...');

  try {
    const tenantId = 'tenant_demo_001';
    
    const testUsers = [
      {
        userId: createId(),
        tenantId: tenantId,
        email: 'guru@test.id',
        fullName: 'Guru Kelas',
        passwordHash: await bcrypt.hash('Test@123', 10),
        role: 'guru' as const,
        nip: '198505012020121001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: createId(),
        tenantId: tenantId,
        email: 'admin@test.id',
        fullName: 'Admin Sekolah',
        passwordHash: await bcrypt.hash('Test@123', 10),
        role: 'admin_sekolah' as const,
        nip: '198605012020121002',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const user of testUsers) {
      const existing = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, user.email),
      });

      if (existing) {
        await db
          .update(usersTable)
          .set(user)
          .where(eq(usersTable.userId, existing.userId));
        console.log(`✅ Updated: ${user.email}`);
      } else {
        await db.insert(usersTable).values(user);
        console.log(`✅ Created: ${user.email}`);
      }
    }

    console.log('[SEED] ✅ Database seeding completed!');
    console.log('\n📝 Test Credentials:');
    console.log('   Email: guru@test.id');
    console.log('   Password: Test@123');
  } catch (error) {
    console.error('[SEED] ❌ Error:', error);
    process.exit(1);
  }
}

seedUsers();
'@
    
    New-Item -Path $seedPath -ItemType File -Force | Out-Null
    Set-Content -Path $seedPath -Value $content -Encoding UTF8
    Write-Success "Created: $seedPath"
}

function Update-PackageJson {
    Write-Step "Updating package.json scripts..."
    
    $packagePath = "package.json"
    $content = Get-Content $packagePath -Raw | ConvertFrom-Json
    
    # Add seed script if not exists
    if (-not $content.scripts."db:seed") {
        $content.scripts."db:seed" = "tsx scripts/seed-users.ts"
        $content | ConvertTo-Json -Depth 10 | Set-Content $packagePath
        Write-Success "Added db:seed script to package.json"
    } else {
        Write-Success "db:seed script already exists"
    }
}

function Run-DatabasePush {
    Write-Step "Pushing database migrations..."
    
    Write-Info "Running: npm run db:push"
    npm run db:push 2>&1 | ForEach-Object {
        if ($_ -match "error|fail") {
            Write-Error "$_"
        } else {
            Write-Info "$_"
        }
    }
    
    Write-Success "Database push completed"
}

function Seed-Database {
    if ($SkipSeed) {
        Write-Warn "Skipping database seeding (--SkipSeed)"
        return
    }
    
    Write-Step "Seeding test data..."
    
    Write-Info "Running: npm run db:seed"
    npm run db:seed 2>&1 | ForEach-Object {
        Write-Info "$_"
    }
    
    Write-Success "Database seeded"
}

function Verify-Setup {
    Write-Step "Verifying setup..."
    
    # Check files created
    $files = @(
        "src/app/login/page.tsx",
        "src/app/api/auth/logout/route.ts",
        "src/middleware.ts",
        "src/hooks/useAuthSession.ts",
        "scripts/seed-users.ts"
    )
    
    foreach ($file in $files) {
        if (Test-Path $file) {
            Write-Success "$file exists"
        } else {
            Write-Error "$file missing!"
        }
    }
    
    # Check .env.local
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "NEXTAUTH_URL" -and $envContent -match "NEXTAUTH_SECRET") {
        Write-Success ".env.local configured"
    } else {
        Write-Error ".env.local incomplete!"
    }
}

# ==================== MAIN ====================

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  Teacher Toolbox - Auth System Setup Automation      ║" -ForegroundColor Magenta
Write-Host "║  Phase 1.5: Complete Authentication Flow             ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Magenta

try {
    Test-Prerequisites
    Install-Dependencies
    Create-LoginPage
    Create-LogoutRoute
    Create-Middleware
    Create-AuthHook
    Create-Seeder
    Update-PackageJson
    Run-DatabasePush
    Seed-Database
    Verify-Setup
    
    Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  ✅ SETUP COMPLETE!                                   ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Green
    
    Write-Info "🚀 Next Steps:"
    Write-Host "  1. Start dev server:  npm run dev" -ForegroundColor Yellow
    Write-Host "  2. Visit login page:  http://localhost:3000/login" -ForegroundColor Yellow
    Write-Host "  3. Login with:" -ForegroundColor Yellow
    Write-Host "     Email:    guru@test.id" -ForegroundColor Yellow
    Write-Host "     Password: Test@123" -ForegroundColor Yellow
    Write-Host "  4. Should redirect to: /guru dashboard" -ForegroundColor Yellow
    
    Write-Info "`n📝 Test Credentials:"
    Write-Host "  - guru@test.id / Test@123 (Guru)" -ForegroundColor Cyan
    Write-Host "  - admin@test.id / Test@123 (Admin)" -ForegroundColor Cyan
    
} catch {
    Write-Error "Setup failed: $_"
    exit 1
}
