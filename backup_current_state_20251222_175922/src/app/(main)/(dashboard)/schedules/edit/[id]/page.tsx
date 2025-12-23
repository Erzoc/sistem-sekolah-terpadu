// src/app/(dashboard)/schedules/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScheduleForm from '@/components/schedule/ScheduleForm';

interface Schedule {
    scheduleId: string;
    classId: string;
    subjectId: string;
    teacherId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string;
}

export default function EditSchedulePage() {
    const params = useParams();
    const router = useRouter();
    const scheduleId = params.id as string;

    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, [scheduleId]);

    const fetchData = async () => {
        try {
            // Fetch schedule data
            const scheduleRes = await fetch(`/api/schedules/${scheduleId}`);
            const scheduleData = await scheduleRes.json();

            if (!scheduleData.success) {
                alert('Jadwal tidak ditemukan');
                router.push('/schedules');
                return;
            }

            setSchedule(scheduleData.data);

            // Fetch master data
            const masterRes = await fetch('/api/test-data');
            const masterData = await masterRes.json();

            if (masterData.success) {
                setTeachers(masterData.data.teachers || []);
                setClasses(masterData.data.classes || []);
                setSubjects(masterData.data.subjects || []);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            alert('Gagal memuat data');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleSubmit = async (formData: any) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/schedules/${scheduleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                alert('✅ Jadwal berhasil diupdate!');
                router.push('/schedules');
            } else {
                alert('❌ Gagal mengupdate jadwal: ' + data.error);
            }
        } catch (err) {
            console.error('Error updating schedule:', err);
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

    if (!schedule) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    Jadwal tidak ditemukan
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
                <h1 className="text-3xl font-bold text-gray-800">Edit Jadwal</h1>
                <p className="text-gray-600 mt-1">
                    Update informasi jadwal pelajaran
                </p>
            </div>

            {/* Form */}
      // Di bagian render ScheduleForm
            <ScheduleForm
                initialData={{
                    classId: schedule.classId,
                    subjectId: schedule.subjectId,
                    teacherId: schedule.teacherId,
                    dayOfWeek: schedule.dayOfWeek,
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                    room: schedule.room || '',
                }}
                classes={classes}
                subjects={subjects}
                teachers={teachers}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
                isLoading={loading}
                mode="edit" // ← TAMBAHKAN INI
            />
        </div>
    );
}
