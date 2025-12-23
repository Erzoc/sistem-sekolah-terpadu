// src/components/schedule/ScheduleForm.tsx
'use client';

import React, { useState } from 'react';

interface ScheduleFormData {
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

interface ScheduleFormProps {
  initialData?: Partial<ScheduleFormData>;
  classes: Array<{ classId: string; className: string }>;
  subjects: Array<{ subjectId: string; subjectName: string }>;
  teachers: Array<{ teacherId: string; fullName: string }>;
  onSubmit: (data: ScheduleFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitButtonText?: string; // ← TAMBAHAN BARU
  mode?: 'create' | 'edit'; // ← TAMBAHAN BARU untuk auto-detect
}

const DAY_OPTIONS = [
  { value: 1, label: 'Senin' },
  { value: 2, label: 'Selasa' },
  { value: 3, label: 'Rabu' },
  { value: 4, label: 'Kamis' },
  { value: 5, label: 'Jumat' },
  { value: 6, label: 'Sabtu' },
  { value: 7, label: 'Minggu' },
];

export default function ScheduleForm({
  initialData,
  classes,
  subjects,
  teachers,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText, // Bisa di-set manual
  mode = 'create', // Default mode
}: ScheduleFormProps) {
  const [formData, setFormData] = useState<ScheduleFormData>({
    classId: initialData?.classId || '',
    subjectId: initialData?.subjectId || '',
    teacherId: initialData?.teacherId || '',
    dayOfWeek: initialData?.dayOfWeek || 1,
    startTime: initialData?.startTime || '08:00',
    endTime: initialData?.endTime || '09:30',
    room: initialData?.room || '',
  });

  // Auto-detect button text berdasarkan mode atau initialData
  const getButtonText = () => {
    if (submitButtonText) return submitButtonText; // Jika di-set manual, pakai itu
    if (mode === 'edit' || initialData) return 'Update Jadwal'; // Jika mode edit atau ada initialData
    return 'Simpan Jadwal'; // Default untuk create
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi waktu
    if (formData.startTime >= formData.endTime) {
      alert('⚠️ Waktu selesai harus lebih besar dari waktu mulai!');
      return;
    }
    
    onSubmit(formData);
  };

  const handleChange = (field: keyof ScheduleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-lg">
      {/* Header Form */}
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {mode === 'edit' ? '✏️ Edit Informasi Jadwal' : '➕ Tambah Jadwal Baru'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Isi semua field yang bertanda <span className="text-red-500">*</span> wajib
        </p>
      </div>

      {/* Class Select */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Kelas <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.classId}
          onChange={(e) => handleChange('classId', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
          disabled={isLoading}
        >
          <option value="">-- Pilih Kelas --</option>
          {classes.map((c) => (
            <option key={c.classId} value={c.classId}>
              {c.className}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Select */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mata Pelajaran <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.subjectId}
          onChange={(e) => handleChange('subjectId', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
          disabled={isLoading}
        >
          <option value="">-- Pilih Mata Pelajaran --</option>
          {subjects.map((s) => (
            <option key={s.subjectId} value={s.subjectId}>
              {s.subjectName}
            </option>
          ))}
        </select>
      </div>

      {/* Teacher Select */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Guru Pengajar <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.teacherId}
          onChange={(e) => handleChange('teacherId', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
          disabled={isLoading}
        >
          <option value="">-- Pilih Guru --</option>
          {teachers.map((t) => (
            <option key={t.teacherId} value={t.teacherId}>
              {t.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Day Select */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Hari <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-5 gap-2">
          {DAY_OPTIONS.slice(0, 5).map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => handleChange('dayOfWeek', day.value)}
              disabled={isLoading}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition ${
                formData.dayOfWeek === day.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ⏰ Waktu Mulai <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ⏰ Waktu Selesai <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Room Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📍 Ruangan (Opsional)
        </label>
        <input
          type="text"
          value={formData.room}
          onChange={(e) => handleChange('room', e.target.value)}
          placeholder="Contoh: Ruang 101, Lab Komputer, Aula"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Kosongkan jika tidak ada ruangan khusus
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Menyimpan...
            </span>
          ) : (
            getButtonText()
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Batal
          </button>
        )}
      </div>

      {/* Info Helper */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Tips:</strong> Pastikan tidak ada jadwal yang bentrok untuk kelas yang sama pada hari dan waktu yang sama.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
