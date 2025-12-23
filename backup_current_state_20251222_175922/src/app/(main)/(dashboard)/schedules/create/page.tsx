// src/app/(dashboard)/schedules/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScheduleForm from '@/components/schedule/ScheduleForm';

interface Teacher {
  teacherId: string;
  fullName: string;
}

interface Class {
  classId: string;
  className: string;
}

interface Subject {
  subjectId: string;
  subjectName: string;
}

export default function CreateSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const res = await fetch('/api/test-data');
      const data = await res.json();

      if (data.success) {
        setTeachers(data.data.teachers || []);
        setClasses(data.data.classes || []);
        setSubjects(data.data.subjects || []);
      }
    } catch (err) {
      console.error('Error fetching master data:', err);
      alert('Gagal memuat data master');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Jadwal berhasil ditambahkan!');
        router.push('/schedules');
      } else {
        alert('❌ Gagal menambahkan jadwal: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating schedule:', err);
      alert('Terjadi kesalahan saat menyimpan');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Kembali
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Tambah Jadwal Baru</h1>
        <p className="text-gray-600 mt-1">Isi form di bawah untuk menambahkan jadwal pelajaran</p>
      </div>

      {/* Form */}
      <ScheduleForm
        classes={classes}
        subjects={subjects}
        teachers={teachers}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={loading}
        mode="create"
      />
    </div>
  );
}
