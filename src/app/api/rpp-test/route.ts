// src/app/api/rpp-test/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appTemplate } from '@/lib/db/schema';

export async function GET() {
  try {
    // Simple test: Get template
    const template = await db.select().from(appTemplate).limit(1);
    
    return NextResponse.json({
      status: 'success',
      message: 'RPP MVP Database Ready!',
      data: {
        template: template[0] || null,
        tablesCreated: [
          'rpp_pertemuan',
          'rpp_edit_history', 
          'batch_jobs',
          'batch_failed_items',
          'app_template',
          'template_test_logs'
        ],
        timestamp: new Date().toISOString(),
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
}
