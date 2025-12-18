import { db } from './client';
import { 
  tenantsTable, 
  usersTable, 
  academicYearsTable, 
  classesTable, 
  subjectsTable,
  teachersTable,
  studentsTable,
  teacherSubjectsTable,
  attendanceTable,
  teachingJournalTable,
  gradesTable,
  gradeAggregationsTable,
  disciplineRecordsTable,
  reportTemplatesTable,
  generatedReportsTable,
  tokenTransactionsTable,
} from '@/schemas';

async function testConnection() {
  try {
    console.log('🔍 Testing ALL 16 tables...\n');

    const tables = [
      { name: 'tenants', table: tenantsTable },
      { name: 'users', table: usersTable },
      { name: 'academic_years', table: academicYearsTable },
      { name: 'classes', table: classesTable },
      { name: 'subjects', table: subjectsTable },
      { name: 'teachers', table: teachersTable },
      { name: 'students', table: studentsTable },
      { name: 'teacher_subjects', table: teacherSubjectsTable },
      { name: 'attendance', table: attendanceTable },
      { name: 'teaching_journal', table: teachingJournalTable },
      { name: 'grades', table: gradesTable },
      { name: 'grade_aggregations', table: gradeAggregationsTable },
      { name: 'discipline_records', table: disciplineRecordsTable },
      { name: 'report_templates', table: reportTemplatesTable },
      { name: 'generated_reports', table: generatedReportsTable },
      { name: 'token_transactions', table: tokenTransactionsTable },
    ];

    for (const { name, table } of tables) {
      const rows = await db.select().from(table);
      console.log(`✅ ${name}: ${rows.length} rows`);
    }

    console.log('\n🎉 ALL 16 TABLES TEST PASSED!');
    console.log('💪 DATABASE SCHEMA 100% COMPLETE!');
  } catch (error) {
    console.error('❌ Test FAILED:', error);
    process.exit(1);
  }
}

testConnection();
