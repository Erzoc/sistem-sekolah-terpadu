'use client';

import { useState } from 'react';
import { useCompletion } from '@ai-sdk/react'; // ← Ubah dari ai/react ke @ai-sdk/react

export default function RPPGeneratorPage() {
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    topic: '',
    duration: '2 x 45 menit',
    learningObjectives: '',
    materials: '',
    assessmentType: 'Formatif dan Sumatif'
  });

  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/generate-rpp',
    streamProtocol: 'text', // ← Tambahkan ini untuk compatibility
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await complete('', {
      body: formData,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generator RPP</h1>
        <p className="text-gray-600 mt-2">
          Generate Rencana Pelaksanaan Pembelajaran sesuai Kurikulum Merdeka
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Input Data Pembelajaran
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Matematika, Bahasa Indonesia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kelas <span className="text-red-500">*</span>
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Kelas</option>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                  <option key={n} value={n}>Kelas {n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topik/Materi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Teorema Pythagoras, Pantun"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durasi Pembelajaran
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2 x 45 menit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tujuan Pembelajaran (Opsional)
              </label>
              <textarea
                name="learningObjectives"
                value={formData.learningObjectives}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Siswa dapat memahami dan menerapkan teorema pythagoras"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materi/Alat (Opsional)
              </label>
              <input
                type="text"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Buku teks, proyektor, alat peraga"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Generating...' : '✨ Generate RPP'}
            </button>
          </form>
        </div>

        {/* Result Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Hasil RPP
          </h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Error</p>
              <p>{error.message}</p>
            </div>
          )}
          
          {!completion && !isLoading && !error && (
            <div className="text-center py-12 text-gray-400">
              <p>RPP akan muncul di sini setelah di-generate</p>
            </div>
          )}
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-pulse text-gray-500">
                <p>Sedang membuat RPP...</p>
              </div>
            </div>
          )}
          
          {completion && (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-md border border-gray-200 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">
                  {completion}
                </pre>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(completion);
                    alert('RPP berhasil disalin ke clipboard!');
                  }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  📋 Copy
                </button>
                
                <button
                  onClick={() => {
                    const blob = new Blob([completion], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `RPP-${formData.subject}-Kelas${formData.grade}.txt`;
                    a.click();
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  💾 Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
