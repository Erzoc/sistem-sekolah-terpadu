/**
 * BaseService - Abstract base class for all services
 * Provides common CRUD operations with multi-tenant support
 * 
 * Usage:
 * export class MyService extends BaseService<MyType> {
 *   constructor() {
 *     super(myRepository, myTable);
 *   }
 * }
 */

import { db } from '@/database/client';
import { eq } from 'drizzle-orm';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';

export abstract class BaseService<T> {
  protected repository: any;
  protected table: SQLiteTable<any>;

  constructor(repository: any, table: SQLiteTable<any>) {
    this.repository = repository;
    this.table = table;
  }

  /**
   * Get all records, optionally filtered by tenantId
   */
  async getAll(tenantId?: string): Promise<T[]> {
    const records = await this.repository.findAll();
    
    if (tenantId) {
      return records.filter((r: any) => r.tenantId === tenantId);
    }
    
    return records;
  }

  /**
   * Get single record by ID with optional tenant verification
   */
  async getById(id: string, tenantId?: string): Promise<T | null> {
    const record = await this.repository.findById(id);
    
    // Verify tenant ownership if tenantId provided
    if (tenantId && (record as any)?.tenantId !== tenantId) {
      return null;
    }
    
    return record;
  }

  /**
   * Create new record with optional tenantId
   */
  async create(data: any, tenantId?: string): Promise<T> {
    const recordData = tenantId ? { ...data, tenantId } : data;
    return this.repository.create(recordData);
  }

  /**
   * Update existing record with tenant verification
   */
  async update(id: string, data: any, tenantId?: string): Promise<T> {
  const existing = await this.getById(id, tenantId);
  if (!existing) {
    throw new Error('Record not found or access denied');
  }

  const pkField = this.getPrimaryKeyField();
  
  const updated = await db
    .update(this.table)
    .set({ 
      ...data, 
      updatedAt: new Date() 
    } as any)
    .where(eq((this.table as any)[pkField], id))
    .returning();
  
  return updated[0] as T;  // ⬅ FIX: Cast as T
}

  /**
   * Delete record with tenant verification
   */
  async delete(id: string, tenantId?: string): Promise<void> {
    // Verify record exists and belongs to tenant
    const existing = await this.getById(id, tenantId);
    if (!existing) {
      throw new Error('Record not found or access denied');
    }

    // Get primary key field name from table
    const pkField = this.getPrimaryKeyField();
    
    // Perform delete
    await db
      .delete(this.table)
      .where(eq((this.table as any)[pkField], id));
  }

  /**
   * Get primary key field name from table schema
   * Override this if your PK field has different naming convention
   */
  protected getPrimaryKeyField(): string {
  // Override this method in child classes for explicit PK field
  // Default: assumes pattern like studentId, teacherId, etc.
  return 'id';  // Safe default
}

  /**
   * Count records with optional tenant filter
   */
  async count(tenantId?: string): Promise<number> {
    const records = await this.getAll(tenantId);
    return records.length;
  }

  /**
   * Check if record exists
   */
  async exists(id: string, tenantId?: string): Promise<boolean> {
    const record = await this.getById(id, tenantId);
    return record !== null;
  }
}
