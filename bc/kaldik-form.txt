'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Holiday {
    name: string;
    startDate: string;
    endDate: string;
    duration?: number;
}

interface FormData {
    academicYear: string;
    semester: '1' | '2';
    startDate: string;
    endDate: string;
    effectiveWeeks: number;
    holidays: Holiday[];
}

export default function KaldikManualForm() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        academicYear: '2025/2026',
        semester: '1',
        startDate: '',
        endDate: '',
        effectiveWeeks: 30,
        holidays: [],
    });

    const handleNext = () => {
        if (step === 1) {
            // Validate step 1
            if (!formData.startDate || !formData.endDate) {
                setError('Tanggal mulai dan berakhir wajib diisi');
                return;
            }
            setError('');
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/kaldik/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    academicYear: formData.academicYear,
                    semester: parseInt(formData.semester),
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    effectiveWeeks: formData.effectiveWeeks,
                    holidays: formData.holidays,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Gagal menyimpan');
                return;
            }
            console.log('Result:', result);  // ← ADD THIS
            console.log('Calendar ID:', result.calendarId);  // ← ADD THIS
            
            setSuccess(true);
            setTimeout(() => {
                router.push(`/guru/rpp/prota?calendarId=${result.calendarId}`);
            }, 2000);
        } catch (err) {
            setError('Terjadi kesalahan. Coba lagi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const progress = (step / 3) * 100;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">📅 Kaldik Manual</h1>
                <p className="text-gray-600">Input kalender akademik untuk membuat Prota</p>
            </div>

            {/* Progress */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Step {step} of 3</span>
                    <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {/* Steps */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">📋 Informasi Dasar</h2>

                        {/* Academic Year */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tahun Ajaran <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.academicYear}
                                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="2025/2026"
                            />
                        </div>

                        {/* Semester */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Semester <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="1"
                                        checked={formData.semester === '1'}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value as '1' })}
                                    />
                                    Semester 1
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="2"
                                        checked={formData.semester === '2'}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value as '2' })}
                                    />
                                    Semester 2
                                </label>
                            </div>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tanggal Mulai <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tanggal Berakhir <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>

                        {/* Effective Weeks */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Minggu Efektif <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.effectiveWeeks}
                                onChange={(e) => setFormData({ ...formData, effectiveWeeks: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg"
                                min="1"
                                max="52"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Holidays */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">📅 Hari Libur (Opsional)</h2>
                        <p className="text-gray-600">Anda bisa skip step ini jika tidak ada libur</p>

                        {formData.holidays.length > 0 && (
                            <div className="space-y-2">
                                {formData.holidays.map((h, i) => (
                                    <div key={i} className="p-3 bg-gray-50 rounded-lg flex justify-between">
                                        <div>
                                            <p className="font-medium">{h.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {h.startDate} - {h.endDate}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    holidays: formData.holidays.filter((_, idx) => idx !== i),
                                                })
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">✓ Review & Simpan</h2>

                        {success ? (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                <p className="text-green-800 font-medium">✓ Kalender berhasil disimpan!</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span>Tahun Ajaran:</span>
                                    <span className="font-medium">{formData.academicYear}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Semester:</span>
                                    <span className="font-medium">Semester {formData.semester}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Periode:</span>
                                    <span className="font-medium">
                                        {formData.startDate} - {formData.endDate}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Minggu Efektif:</span>
                                    <span className="font-medium">{formData.effectiveWeeks} minggu</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
                <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className="flex-1 px-4 py-3 border rounded-lg disabled:opacity-50"
                >
                    ← Kembali
                </button>

                {step < 3 ? (
                    <button onClick={handleNext} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg">
                        Lanjut →
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading || success}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : success ? '✓ Selesai' : 'Simpan & Lanjut'}
                    </button>
                )}
            </div>
        </div>
    );
}
