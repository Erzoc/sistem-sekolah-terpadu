// Existing exports
export * from "./tenants";
export * from "./users";
export * from "./teachers";
export * from "./students";
export * from "./subjects";
export * from "./classes";
export * from "./academic_years";
export * from "./teacher_subjects";
export * from "./assignments";
export * from "./attendance";
export * from "./grades";
export * from './invites';

export { simpleCalendars, type SimpleCalendar, type NewSimpleCalendar } from './simple-calendars';
export { protaRecords, type ProtaRecord, type NewProtaRecord } from './prota-records';  // ← ADD THIS
export { prosemRecords, type ProsemRecord, type NewProsemRecord } from './prosem-records';  // ← ADD
export { rppRecords, type RppRecord, type NewRppRecord } from './rpp-records';

// 🆕 NEW PHASE 1 EXPORTS
export * from "./school_profiles";
export * from "./kaldik";
export * from "./prota";
export * from "./prosem";
export * from "./rpp_drafts";
export * from "./rpp_versions";
export * from './kaldik-files';

// Drizzle DB Instance
export { db } from "@/database/client";

