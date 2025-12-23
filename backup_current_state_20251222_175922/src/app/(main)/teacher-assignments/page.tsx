// ============================================
// PAGE: TEACHER ASSIGNMENTS (Penugasan Guru)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { TeacherAssignment, Teacher, Subject, Class } from '@/lib/types';
import * as XLSX from 'xlsx';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<TeacherAssignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Partial<TeacherAssignment>>({});

  // Multi-select states
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);

  // Fetch all data
  useEffect(() => {
    fetchAssignments();
    fetchTeachers();
    fetchSubjects();
    fetchClasses();
  }, []);

  // Filter assignments
  useEffect(() => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subjectNames.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        a.classNames.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm]);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/v1/teacher-assignments');
      const data = await res.json();
      setAssignments(data.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/v1/teachers');
      const data = await res.json();
      setTeachers(data.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/v1/subjects');
      const data = await res.json();
      setSubjects(data.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/v1/classes');
      const data = await res.json();
      setClasses(data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get selected teacher
    const selectedTeacher = teachers.find(t => t.id === currentAssignment.teacherId);
    if (!selectedTeacher) {
      alert('Pilih guru terlebih dahulu');
      return;
    }

    // Get subject names
    const subjectNames = subjects
      .filter(s => selectedSubjects.includes(s.id))
      .map(s => s.name);

    // Get class names
    const classNames = classes
      .filter(c => selectedClasses.includes(c.id))
      .map(c => `${c.grade} - ${c.name}`);

    const assignmentData = {
      ...currentAssignment,
      teacherName: selectedTeacher.name,
      subjectIds: selectedSubjects,
      subjectNames,
      classIds: selectedClasses,
      classNames,
    };

    try {
      const url = '/api/v1/teacher-assignments';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData),
      });

      if (res.ok) {
        fetchAssignments();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus penugasan ini?')) return;

    try {
      const res = await fetch(`/api/v1/teacher-assignments?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchAssignments();
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const openModal = (assignment?: TeacherAssignment) => {
    if (assignment) {
      setIsEditMode(true);
      setCurrentAssignment(assignment);
      setSelectedSubjects(assignment.subjectIds);
      setSelectedClasses(assignment.classIds);
    } else {
      setIsEditMode(false);
      setCurrentAssignment({ academicYear: '2024/2025' });
      setSelectedSubjects([]);
      setSelectedClasses([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAssignment({});
    setSelectedSubjects([]);
    setSelectedClasses([]);
  };

  // Multi-select handlers
  const toggleSubject = (subjectId: number) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const toggleClass = (classId: number) => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const selectAllClasses = (level: string) => {
    const levelClasses = classes
      .filter(c => c.level === level)
      .map(c => c.id);
    
    const allSelected = levelClasses.every(id => selectedClasses.includes(id));
    
    if (allSelected) {
      setSelectedClasses(prev => prev.filter(id => !levelClasses.includes(id)));
    } else {
      setSelectedClasses(prev => [...new Set([...prev, ...levelClasses])]);
    }
  };

  // Export to Excel
  const handleExport = () => {
    const exportData = filteredAssignments.map(a => ({
      'Nama Guru': a.teacherName,
      'Mata Pelajaran': a.subjectNames.join(', '),
      'Kelas': a.classNames.join(', '),
      'Jumlah Mapel': a.subjectIds.length,
      'Jumlah Kelas': a.classIds.length,
      'Tahun Ajaran': a.academicYear,
      'Catatan': a.notes || '',
      'Tanggal Dibuat': new Date(a.createdAt).toLocaleDateString('id-ID'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teacher Assignments');
    XLSX.writeFile(wb, `Penugasan_Guru_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Stats
  const stats = {
    totalAssignments: assignments.length,
    totalTeachers: new Set(assignments.map(a => a.teacherId)).size,
    totalSubjects: assignments.reduce((sum, a) => sum + a.subjectIds.length, 0),
    totalClasses: assignments.reduce((sum, a) => sum + a.classIds.length, 0),
  };

  // Group classes by level
  const classesByLevel = {
    'SMP/MTs': classes.filter(c => c.level === 'SMP/MTs'),
    'SMA/MA': classes.filter(c => c.level === 'SMA/MA'),
    'SD/MI': classes.filter(c => c.level === 'SD/MI'),
  };

  // Group subjects by category
  const subjectsByCategory = {
    'PAI': subjects.filter(s => s.category === 'PAI'),
    'Umum': subjects.filter(s => s.category === 'Umum'),
    'Seni & Budaya': subjects.filter(s => s.category === 'Seni & Budaya'),
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Penugasan Guru</h1>
        <p className="text-gray-600 mt-1">Kelola penugasan guru ke mata pelajaran dan kelas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-blue-600 text-sm font-medium">Total Penugasan</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{stats.totalAssignments}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-green-600 text-sm font-medium">Guru Aktif</div>
          <div className="text-2xl font-bold text-green-700 mt-1">{stats.totalTeachers}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-purple-600 text-sm font-medium">Total Mapel Diajar</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">{stats.totalSubjects}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-orange-600 text-sm font-medium">Total Kelas Diajar</div>
          <div className="text-2xl font-bold text-orange-700 mt-1">{stats.totalClasses}</div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <input
            type="text"
            placeholder="Cari guru, mata pelajaran, atau kelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Tambah Penugasan
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Guru</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Pelajaran</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas yang Diajar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tahun Ajaran</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Belum ada penugasan guru
                </td>
              </tr>
            ) : (
              filteredAssignments.map((assignment, index) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{assignment.teacherName}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {assignment.subjectNames.map((subject, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {assignment.subjectIds.length} mata pelajaran
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {assignment.classNames.slice(0, 3).map((className, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {className}
                        </span>
                      ))}
                      {assignment.classNames.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{assignment.classNames.length - 3} lainnya
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {assignment.classIds.length} kelas
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{assignment.academicYear}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{assignment.notes || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => openModal(assignment)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? 'Edit Penugasan Guru' : 'Tambah Penugasan Guru'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Teacher Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Guru *
                  </label>
                  <select
                    value={currentAssignment.teacherId || ''}
                    onChange={(e) => setCurrentAssignment({ ...currentAssignment, teacherId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Pilih Guru --</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.position}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Multi-Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mata Pelajaran yang Diajar * ({selectedSubjects.length} dipilih)
                  </label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-50">
                    {Object.entries(subjectsByCategory).map(([category, categorySubjects]) => (
                      <div key={category} className="mb-4">
                        <div className="font-medium text-gray-700 mb-2">{category}</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {categorySubjects.map(subject => (
                            <label
                              key={subject.id}
                              className={`flex items-center p-2 rounded cursor-pointer hover:bg-white transition ${
                                selectedSubjects.includes(subject.id) ? 'bg-green-100 border-2 border-green-500' : 'bg-white border'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedSubjects.includes(subject.id)}
                                onChange={() => toggleSubject(subject.id)}
                                className="mr-2"
                              />
                              <span className="text-sm">{subject.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Class Multi-Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kelas yang Diajar * ({selectedClasses.length} dipilih)
                  </label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-50">
                    {Object.entries(classesByLevel).map(([level, levelClasses]) => (
                      levelClasses.length > 0 && (
                        <div key={level} className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-gray-700">{level}</div>
                            <button
                              type="button"
                              onClick={() => selectAllClasses(level)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              {levelClasses.every(c => selectedClasses.includes(c.id)) ? 'Hapus Semua' : 'Pilih Semua'}
                            </button>
                          </div>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {levelClasses.map(classItem => (
                              <label
                                key={classItem.id}
                                className={`flex items-center p-2 rounded cursor-pointer hover:bg-white transition ${
                                  selectedClasses.includes(classItem.id) ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedClasses.includes(classItem.id)}
                                  onChange={() => toggleClass(classItem.id)}
                                  className="mr-2"
                                />
                                <span className="text-xs">
                                  <div className="font-medium">{classItem.grade}</div>
                                  <div className="text-gray-600">{classItem.name}</div>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tahun Ajaran *
                  </label>
                  <input
                    type="text"
                    value={currentAssignment.academicYear || ''}
                    onChange={(e) => setCurrentAssignment({ ...currentAssignment, academicYear: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2024/2025"
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan
                  </label>
                  <textarea
                    value={currentAssignment.notes || ''}
                    onChange={(e) => setCurrentAssignment({ ...currentAssignment, notes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Catatan tambahan tentang penugasan ini..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  disabled={selectedSubjects.length === 0 || selectedClasses.length === 0}
                >
                  {isEditMode ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
