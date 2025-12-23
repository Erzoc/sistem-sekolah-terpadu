// src/app/(dashboard)/schedules/import/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ImportResult {
  totalProcessed: number;
  totalValid: number;
  totalInserted: number;
  totalFailed: number;
  validationErrors?: any[];
  insertErrors?: any[];
}

export default function ImportSchedulePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        setError('File harus berformat Excel (.xlsx atau .xls)');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch('/api/schedules/template');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Template_Import_Jadwal.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Gagal download template');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat download template');
      console.error(err);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Pilih file Excel terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/schedules/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
        
        if (data.data.totalInserted > 0) {
          setTimeout(() => {
            router.push('/schedules');
          }, 3000);
        }
      } else {
        setError(data.error || 'Import gagal');
        if (data.errors) {
          setResult({
            totalProcessed: data.totalProcessed || 0,
            totalValid: 0,
            totalInserted: 0,
            totalFailed: data.totalErrors || 0,
            validationErrors: data.errors,
          });
        }
      }
    } catch (err: any) {
      setError('Terjadi kesalahan: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Kembali
        </button>
        <h1 className="text-3xl font-bold text-gray-800">📊 Import Jadwal dari Excel</h1>
        <p className="text-gray-600 mt-1">Upload file Excel untuk import banyak jadwal sekaligus</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">📝 Cara Import:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
          <li>Download template Excel dengan klik tombol "Download Template" di bawah</li>
          <li>Isi data jadwal sesuai format yang ada di template</li>
          <li>Pastikan nama Kelas, Mata Pelajaran, dan Guru sesuai dengan data di sistem</li>
          <li>Hari ditulis dengan format: Senin, Selasa, Rabu, Kamis, Jumat</li>
          <li>Waktu ditulis dengan format: HH:mm (contoh: 08:00, 14:30)</li>
          <li>Upload file Excel yang sudah diisi</li>
          <li>Klik "Import Jadwal" dan tunggu proses selesai</li>
        </ol>
      </div>

      {/* Download Template Button */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">1️⃣ Download Template</h3>
        <p className="text-sm text-gray-600 mb-4">
          Download template Excel untuk melihat format yang benar
        </p>
        <button
          onClick={handleDownloadTemplate}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <span>📥</span>
          Download Template Excel
        </button>
      </div>

      {/* Upload File */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">2️⃣ Upload File Excel</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={loading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="text-5xl">📁</div>
            <div>
              <p className="text-gray-700 font-medium">
                {file ? file.name : 'Klik untuk pilih file Excel'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Format: .xlsx atau .xls (Maksimal 5MB)
              </p>
            </div>
          </label>
        </div>

        {file && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleImport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>⬆️</span>
                  <span>Import Jadwal</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Import Result */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">📊 Hasil Import</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.totalProcessed}</div>
              <div className="text-sm text-gray-600">Total Diproses</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{result.totalInserted}</div>
              <div className="text-sm text-gray-600">Berhasil</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{result.totalFailed}</div>
              <div className="text-sm text-gray-600">Gagal</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{result.totalValid}</div>
              <div className="text-sm text-gray-600">Valid</div>
            </div>
          </div>

          {result.totalInserted > 0 && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              ✅ Berhasil import {result.totalInserted} jadwal! Redirect ke halaman jadwal dalam 3 detik...
            </div>
          )}

          {/* Validation Errors */}
          {result.validationErrors && result.validationErrors.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-700 mb-2">❌ Error Validasi:</h4>
              <div className="bg-red-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {result.validationErrors.map((err, idx) => (
                  <div key={idx} className="text-sm text-red-700 mb-2 pb-2 border-b border-red-200 last:border-0">
                    <strong>Baris {err.row}:</strong> {err.message}
                    <div className="text-xs text-red-600 mt-1">
                      Field: {err.field}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
