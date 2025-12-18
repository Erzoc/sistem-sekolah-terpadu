// Export all repositories
export * from './base.repository';
export * from './student.repository';
export * from './teacher.repository';
export * from './class.repository';
export * from './subject.repository';

// Re-export singleton instances for easy import
export { studentRepository } from './student.repository';
export { teacherRepository } from './teacher.repository';
export { classRepository } from './class.repository';
export { subjectRepository } from './subject.repository';
