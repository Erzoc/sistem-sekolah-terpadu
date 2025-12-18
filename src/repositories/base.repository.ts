import { db } from '@/database/client';
import { eq, SQL } from 'drizzle-orm';
import { SQLiteTable } from 'drizzle-orm/sqlite-core';

/**
 * Base Repository with generic CRUD operations
 * All repositories extend this class
 */
export class BaseRepository<T extends SQLiteTable> {
  constructor(protected table: T) {}

  /**
   * Get all records
   */
  async findAll() {
    return await db.select().from(this.table);
  }

  /**
   * Find record by ID
   */
  async findById(id: string | number, idColumn: any) {
    const results = await db
      .select()
      .from(this.table)
      .where(eq(idColumn, id))
      .limit(1);
    
    return results[0] || null;
  }

  /**
   * Find records by condition
   */
  async findByCondition(condition: SQL) {
    return await db.select().from(this.table).where(condition);
  }

  /**
   * Create new record
   */
  async create(data: any) {
    const result = await db.insert(this.table).values(data).returning();
    return result[0];
  }

  /**
   * Create multiple records
   */
  async createMany(data: any[]) {
    return await db.insert(this.table).values(data).returning();
  }

  /**
   * Update record by ID
   */
  async updateById(id: string | number, idColumn: any, data: any) {
    const result = await db
      .update(this.table)
      .set(data)
      .where(eq(idColumn, id))
      .returning();
    
    return result[0] || null;
  }

  /**
   * Delete record by ID
   */
  async deleteById(id: string | number, idColumn: any) {
    const result = await db
      .delete(this.table)
      .where(eq(idColumn, id))
      .returning();
    
    return result[0] || null;
  }

  /**
   * Count records
   */
  async count(condition?: SQL) {
    const query = db.select().from(this.table);
    
    if (condition) {
      query.where(condition);
    }
    
    const results = await query;
    return results.length;
  }

  /**
   * Check if record exists
   */
  async exists(condition: SQL): Promise<boolean> {
    const results = await db
      .select()
      .from(this.table)
      .where(condition)
      .limit(1);
    
    return results.length > 0;
  }
}
