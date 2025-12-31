#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Automated Database Setup Script for Sistem Sekolah Terpadu
.DESCRIPTION
    Script ini mengotomatisasi seluruh proses setup database setelah FDX cleanup
.AUTHOR
    Senior Dev Architect - Teacher Toolbox
.VERSION
    1.0
.PARAMETER Phase
    Setup phase to run (1-6, atau 'all')
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('1','2','3','4','5','6','all')]
    [string]$Phase = 'all',
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBackup = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose = $false
)

# ════════════════════════════════════════════════════════════════
# COLOR DEFINITIONS & FORMATTING
# ════════════════════════════════════════════════════════════════

function Write-Status {
    param([string]$Message, [string]$Status)
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    switch ($Status) {
        "success" { Write-Host "[$timestamp] ✓ $Message" -ForegroundColor Green }
        "error"   { Write-Host "[$timestamp] ✗ $Message" -ForegroundColor Red }
        "warning" { Write-Host "[$timestamp] ⚠ $Message" -ForegroundColor Yellow }
        "info"    { Write-Host "[$timestamp] ℹ $Message" -ForegroundColor Cyan }
        "header"  { Write-Host "`n$Message" -ForegroundColor Magenta -BackgroundColor Black; Write-Host ("=" * 60) -ForegroundColor Magenta }
        default   { Write-Host "[$timestamp] • $Message" -ForegroundColor White }
    }
}

function Test-Prerequisites {
    Write-Status "Checking prerequisites..." "header"
    
    $prerequisites = @{
        'node'       = 'node --version'
        'npm'        = 'npm --version'
        'git'        = 'git --version'
        'powershell' = '$PSVersionTable.PSVersion'
    }
    
    $allPresent = $true
    
    foreach ($tool in $prerequisites.Keys) {
        try {
            $version = & cmd /c "($prerequisites[$tool])" 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Status "$tool : $version" "success"
            } else {
                Write-Status "$tool : NOT FOUND" "error"
                $allPresent = $false
            }
        } catch {
            Write-Status "$tool : ERROR ($($_.Exception.Message))" "error"
            $allPresent = $false
        }
    }
    
    if (-not $allPresent) {
        Write-Status "Please install missing prerequisites" "error"
        exit 1
    }
    
    Write-Status "All prerequisites met" "success"
}

# ════════════════════════════════════════════════════════════════
# PHASE 1: CLONE & SETUP DEPENDENCIES
# ════════════════════════════════════════════════════════════════

function Invoke-Phase1 {
    Write-Status "PHASE 1: Clone & Setup Dependencies" "header"
    
    # Check if we're in the repo
    if (-not (Test-Path "./package.json")) {
        Write-Status "package.json not found. Cloning repository..." "warning"
        
        git clone https://github.com/Erzoc/sistem-sekolah-terpadu.git
        if ($LASTEXITCODE -ne 0) {
            Write-Status "Failed to clone repository" "error"
            exit 1
        }
        
        cd sistem-sekolah-terpadu
        Write-Status "Repository cloned" "success"
    } else {
        Write-Status "Already in repository directory" "info"
    }
    
    # Check git status
    Write-Status "Current git status:" "info"
    git status --short
    
    git log --oneline -5 | ForEach-Object {
        Write-Status "  $_" "info"
    }
    
    # Install dependencies
    Write-Status "Installing npm dependencies..." "info"
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Dependencies installed successfully" "success"
    } else {
        Write-Status "Failed to install dependencies" "error"
        exit 1
    }
    
    # Verify key packages
    $keyPackages = @('next', 'drizzle-orm', 'prisma', 'tailwindcss')
    Write-Status "Verifying key packages..." "info"
    
    foreach ($pkg in $keyPackages) {
        npm list $pkg 2>&1 | Select-String $pkg -Quiet | ForEach-Object {
            Write-Status "$pkg : installed" "success"
        }
    }
}

# ════════════════════════════════════════════════════════════════
# PHASE 2: DATABASE INITIALIZATION
# ════════════════════════════════════════════════════════════════

function Invoke-Phase2 {
    Write-Status "PHASE 2: Database Initialization" "header"
    
    # Backup existing database
    if (-not $SkipBackup -and (Test-Path "./dev.db")) {
        $timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
        $backupPath = "./dev.db.$timestamp.backup"
        
        Write-Status "Creating backup: $backupPath" "info"
        Copy-Item -Path "./dev.db" -Destination $backupPath -Force
        
        Write-Status "Backup created successfully" "success"
    }
    
    # Remove old database
    Write-Status "Cleaning old database files..." "info"
    
    if (Test-Path "./dev.db") {
        Remove-Item -Path "./dev.db" -Force -ErrorAction SilentlyContinue
        Write-Status "Old dev.db removed" "success"
    }
    
    # Clean cache directories
    @("./.wrangler", "./node_modules/.cache") | ForEach-Object {
        if (Test-Path $_) {
            Remove-Item -Path $_ -Recurse -Force -ErrorAction SilentlyContinue
            Write-Status "Cleaned: $_" "success"
        }
    }
    
    # Verify drizzle config
    Write-Status "Checking drizzle.config.ts..." "info"
    if (Test-Path "./drizzle.config.ts") {
        $content = Get-Content ./drizzle.config.ts -Raw
        Write-Status "Drizzle config found" "success"
    } else {
        Write-Status "Drizzle config not found!" "error"
        exit 1
    }
    
    # Run migrations
    Write-Status "Running Drizzle migrations..." "info"
    npm run db:push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Migrations completed successfully" "success"
    } else {
        Write-Status "Migration failed - check error above" "error"
        exit 1
    }
}

# ════════════════════════════════════════════════════════════════
# PHASE 3: SCHEMA VERIFICATION
# ════════════════════════════════════════════════════════════════

function Invoke-Phase3 {
    Write-Status "PHASE 3: Schema Verification" "header"
    
    # Generate Drizzle types
    Write-Status "Generating Drizzle types..." "info"
    npm run db:generate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Type generation completed" "success"
    } else {
        Write-Status "Type generation failed" "error"
        exit 1
    }
    
    # Check for Prisma schema additions
    if (Test-Path "./PRISMA_SCHEMA_ADDITIONS.sql") {
        Write-Status "Found PRISMA_SCHEMA_ADDITIONS.sql" "info"
        Write-Status "Review this file before applying" "warning"
    }
    
    # Verify database file exists
    if (Test-Path "./dev.db") {
        $dbSize = (Get-Item ./dev.db).Length / 1KB
        Write-Status "Database file created: ${dbSize}KB" "success"
    } else {
        Write-Status "Database file not created!" "error"
        exit 1
    }
}

# ════════════════════════════════════════════════════════════════
# PHASE 4: SEED INITIAL DATA
# ════════════════════════════════════════════════════════════════

function Invoke-Phase4 {
    Write-Status "PHASE 4: Seed Initial Data" "header"
    
    # Check for seed scripts
    Write-Status "Checking for seed scripts..." "info"
    
    if (Test-Path "./scripts") {
        $seedFiles = Get-ChildItem -Path "./scripts" -Filter "*.ts", "*.js" | Select-Object -ExpandProperty Name
        
        if ($seedFiles.Count -gt 0) {
            Write-Status "Found seed scripts:" "info"
            $seedFiles | ForEach-Object { Write-Status "  - $_" "info" }
        } else {
            Write-Status "No seed scripts found" "warning"
        }
    }
    
    # Try to run seed
    if (Test-Path "./scripts/seed.ts" -or (npm run | Select-String "seed" -Quiet)) {
        Write-Status "Running seed script..." "info"
        npm run seed
        
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Seed completed successfully" "success"
        } else {
            Write-Status "Seed script not available or failed" "warning"
        }
    } else {
        Write-Status "No seed script found - skipping" "warning"
    }
    
    Write-Status "You can open Prisma Studio to verify data:" "info"
    Write-Status "  npx prisma studio" "info"
}

# ════════════════════════════════════════════════════════════════
# PHASE 5: IMPORT FORM DATA
# ════════════════════════════════════════════════════════════════

function Invoke-Phase5 {
    Write-Status "PHASE 5: Import Form Data" "header"
    
    $dataFiles = @(
        "rpp-form.txt",
        "rpp-library.txt", 
        "prota-form.txt",
        "prosem-form.txt",
        "kaldik-form.txt",
        "kaldik-list.txt",
        "data-sekolah-input.html"
    )
    
    Write-Status "Checking data files..." "info"
    
    foreach ($file in $dataFiles) {
        $path = "./data-import/$file"
        if (Test-Path $path) {
            $size = (Get-Item $path).Length / 1KB
            Write-Status "$file: found (${size}KB)" "success"
        } else {
            Write-Status "$file: not found" "warning"
        }
    }
    
    # Check for import script
    if (Test-Path "./scripts/import-data.ts" -or Test-Path "./scripts/import-data.js") {
        Write-Status "Running data import..." "info"
        npm run import:data
        
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Data import completed" "success"
        } else {
            Write-Status "Data import failed" "warning"
        }
    } else {
        Write-Status "Import script not found - manual import may be needed" "warning"
    }
}

# ════════════════════════════════════════════════════════════════
# PHASE 6: BUILD & TEST
# ════════════════════════════════════════════════════════════════

function Invoke-Phase6 {
    Write-Status "PHASE 6: Build & Test" "header"
    
    # Build project
    Write-Status "Building Next.js application..." "info"
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Build completed successfully" "success"
    } else {
        Write-Status "Build failed - check errors above" "error"
        exit 1
    }
    
    # Offer to start dev server
    Write-Status "Setup complete! Ready to start development server" "success"
    Write-Status "`nTo start the dev server, run:" "info"
    Write-Status "  npm run dev" "info"
    Write-Status "`nServer will be available at: http://localhost:3000" "info"
}

# ════════════════════════════════════════════════════════════════
# ENVIRONMENT SETUP
# ════════════════════════════════════════════════════════════════

function Setup-Environment {
    Write-Status "Setting up environment variables..." "header"
    
    if (-not (Test-Path "./.env.local")) {
        Write-Status "Creating .env.local file..." "info"
        
        # Generate secret
        $secret = openssl rand -base64 32 2>$null
        if (-not $secret) {
            $secret = [System.Convert]::ToBase64String(([byte[]]@(1..32) | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 256) }))
        }
        
        $envContent = @"
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="$secret"
NEXTAUTH_URL="http://localhost:3000"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Logging
LOG_LEVEL="debug"

# Application
ENVIRONMENT="development"
"@
        
        Set-Content -Path "./.env.local" -Value $envContent
        Write-Status ".env.local created successfully" "success"
    } else {
        Write-Status ".env.local already exists" "info"
    }
}

# ════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ════════════════════════════════════════════════════════════════

function Main {
    Clear-Host
    
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║     SISTEM SEKOLAH TERPADU - Database Setup Automation      ║" -ForegroundColor Cyan
    Write-Host "║                  After FDX Cleanup v1.0                      ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host "`n"
    
    # Check prerequisites
    Test-Prerequisites
    
    # Setup environment
    Setup-Environment
    
    # Execute phases
    $phasesToRun = @()
    
    if ($Phase -eq 'all') {
        $phasesToRun = @('1','2','3','4','5','6')
    } else {
        $phasesToRun = @($Phase)
    }
    
    foreach ($p in $phasesToRun) {
        switch ($p) {
            '1' { Invoke-Phase1 }
            '2' { Invoke-Phase2 }
            '3' { Invoke-Phase3 }
            '4' { Invoke-Phase4 }
            '5' { Invoke-Phase5 }
            '6' { Invoke-Phase6 }
        }
        Write-Host "`n"
    }
    
    # Final summary
    Write-Status "DATABASE SETUP COMPLETED SUCCESSFULLY!" "header"
    Write-Status "Database file: ./dev.db" "success"
    Write-Status "Environment file: ./.env.local" "success"
    Write-Status "`nNext steps:" "info"
    Write-Status "1. Review .env.local configuration" "info"
    Write-Status "2. Run: npm run dev" "info"
    Write-Status "3. Open: http://localhost:3000" "info"
}

# Run main
Main
