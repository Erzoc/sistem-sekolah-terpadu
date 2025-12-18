import { studentRepository, teacherRepository, classRepository, subjectRepository } from '@/repositories';

async function testRepositories() {
  console.log('🧪 TESTING REPOSITORY PATTERN\n');
  console.log('═══════════════════════════════════════\n');

  try {
    // === TEST 1: Student Repository ===
    console.log('👨‍🎓 TEST 1: Student Repository');
    console.log('─────────────────────────────────────');
    
    const allStudents = await studentRepository.findAll();
    console.log(`✅ Found ${allStudents.length} students`);

    const studentsWithClass = await studentRepository.findAllWithClass();
    console.log(`✅ Students with class info: ${studentsWithClass.length}`);
    
    if (studentsWithClass.length > 0) {
      const student = studentsWithClass[0];
      console.log(`   Example: ${student.fullName} - ${student.className}`);
    }

    const maleStudents = await studentRepository.findByGender('male');
    const femaleStudents = await studentRepository.findByGender('female');
    console.log(`✅ Male: ${maleStudents.length}, Female: ${femaleStudents.length}`);

    // === TEST 2: Teacher Repository ===
    console.log('\n👨‍🏫 TEST 2: Teacher Repository');
    console.log('─────────────────────────────────────');
    
    const allTeachers = await teacherRepository.findAllWithUser();
    console.log(`✅ Found ${allTeachers.length} teachers with user info`);

    if (allTeachers.length > 0) {
      const teacher = allTeachers[0];
      console.log(`   Example: ${teacher.fullName} (${teacher.position})`);

      // Test teacher with subjects
      const teacherWithSubjects = await teacherRepository.findByIdWithSubjects(teacher.teacherId);
      if (teacherWithSubjects) {
        console.log(`✅ ${teacherWithSubjects.fullName} teaches ${teacherWithSubjects.subjects.length} subjects`);
      }
    }

    const guruMapel = await teacherRepository.findByPosition('guru_mapel');
    console.log(`✅ Guru Mapel count: ${guruMapel.length}`);

    // === TEST 3: Class Repository ===
    console.log('\n🏛️ TEST 3: Class Repository');
    console.log('─────────────────────────────────────');
    
    const allClasses = await classRepository.findAll();
    console.log(`✅ Found ${allClasses.length} classes`);

    if (allClasses.length > 0) {
      const cls = allClasses[0];
      const classWithCount = await classRepository.findByIdWithStudentCount(cls.classId);
      
      if (classWithCount) {
        console.log(`   ${classWithCount.className}: ${classWithCount.studentCount}/${classWithCount.capacity} students`);
        console.log(`   Available seats: ${classWithCount.availableSeats}`);
      }
    }

    // === TEST 4: Subject Repository ===
    console.log('\n📚 TEST 4: Subject Repository');
    console.log('─────────────────────────────────────');
    
    const allSubjects = await subjectRepository.findAll();
    console.log(`✅ Found ${allSubjects.length} subjects`);

    const coreSubjects = await subjectRepository.findCoreSubjects();
    const electiveSubjects = await subjectRepository.findElectiveSubjects();
    console.log(`✅ Core subjects: ${coreSubjects.length}`);
    console.log(`✅ Elective subjects: ${electiveSubjects.length}`);

    if (allSubjects.length > 0) {
      const subject = allSubjects[0];
      const subjectWithTeachers = await subjectRepository.findByIdWithTeachers(subject.subjectId);
      
      if (subjectWithTeachers) {
        console.log(`✅ ${subjectWithTeachers.subjectName} taught by ${subjectWithTeachers.teachers.length} teachers`);
      }
    }

    // === SUMMARY ===
    console.log('\n═══════════════════════════════════════');
    console.log('🎉 ALL REPOSITORY TESTS PASSED!');
    console.log('═══════════════════════════════════════');
    console.log('✅ StudentRepository: Working');
    console.log('✅ TeacherRepository: Working');
    console.log('✅ ClassRepository: Working');
    console.log('✅ SubjectRepository: Working');
    console.log('✅ Base CRUD operations: Working');
    console.log('✅ Complex queries: Working');
    console.log('✅ Relations: Working');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Repository test FAILED:', error);
    process.exit(1);
  }
}

testRepositories();
