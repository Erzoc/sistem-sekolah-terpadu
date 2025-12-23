'use client';

import { FormEvent, useState } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

type AIProvider = 'gemini' | 'openai';

export default function RPPGeneratorPage() {
  const [mapel, setMapel] = useState('');
  const [kelas, setKelas] = useState('');
  const [materiPokok, setMateriPokok] = useState('');
  const [aiProvider, setAiProvider] = useState<AIProvider>('gemini');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRPP, setGeneratedRPP] = useState<string | null>(null);
  const [usedProvider, setUsedProvider] = useState<string>('');

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGeneratedRPP(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-rpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapel, kelas, materiPokok, aiProvider }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal generate RPP');
      }

      const result = await response.json();
      setGeneratedRPP(result.data.content);
      setUsedProvider(result.data.aiProvider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!generatedRPP) return;

    try {
      const lines = generatedRPP.split('\n').filter((line) => line.trim());

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: `RPP - ${mapel}`,
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: `Kelas: ${kelas}`,
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: `Materi: ${materiPokok}`,
                spacing: { after: 400 },
              }),
              ...lines.map(
                (line) =>
                  new Paragraph({
                    children: [new TextRun(line)],
                    spacing: { after: 100 },
                  })
              ),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RPP_${mapel}_${kelas}_${Date.now()}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading:', err);
      alert('Gagal download file');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Generate RPP dengan AI</h1>
      <p className="text-gray-600 mb-6">
        Pilih AI yang ingin digunakan dan isi form di bawah
      </p>

      <form onSubmit={handleGenerate} className="space-y-4 mb-8">
        {/* AI Provider Selector */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="block text-sm font-semibold mb-3">
            Pilih AI Provider:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="aiProvider"
                value="gemini"
                checked={aiProvider === 'gemini'}
                onChange={(e) => setAiProvider(e.target.value as AIProvider)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                <strong>Gemini</strong> (Gratis, Google)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="aiProvider"
                value="openai"
                checked={aiProvider === 'openai'}
                onChange={(e) => setAiProvider(e.target.value as AIProvider)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                <strong>OpenAI</strong> (Berbayar, GPT-4)
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Mata Pelajaran *
          </label>
          <input
            type="text"
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            placeholder="Contoh: Matematika"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kelas *</label>
          <input
            type="text"
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            placeholder="Contoh: X IPA 1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Materi Pokok *
          </label>
          <textarea
            required
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={materiPokok}
            onChange={(e) => setMateriPokok(e.target.value)}
            placeholder="Contoh: Trigonometri - Sinus, Cosinus, Tangen"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading
            ? `Generating dengan ${aiProvider === 'gemini' ? 'Gemini' : 'OpenAI'}... (10-30 detik)`
            : `Generate RPP dengan ${aiProvider === 'gemini' ? 'Gemini (Gratis)' : 'OpenAI (Premium)'}`}
        </button>
      </form>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          ❌ {error}
        </div>
      )}

      {generatedRPP && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Hasil Generate</h2>
              <p className="text-sm text-gray-600">
                Dibuat dengan:{' '}
                <strong>
                  {usedProvider === 'gemini' ? 'Google Gemini' : 'OpenAI GPT'}
                </strong>
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700"
            >
              📥 Download .docx
            </button>
          </div>

          <div className="border rounded-md p-6 bg-gray-50 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
            {generatedRPP}
          </div>
        </div>
      )}
    </div>
  );
}
