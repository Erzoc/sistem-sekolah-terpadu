'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success('API Key copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/guru" className="hover:text-gray-900">Dashboard</Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Settings</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-gray-600" />
          </div>
          Pengaturan Guru Pintar
        </h1>
      </div>

      <div className="grid gap-6">
        {/* AI Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🤖 Konfigurasi AI</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Provider
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option selected>OpenRouter (Free - Meta Llama 70B Chat)</option>
                <option>OpenAI API (GPT-4)</option>
                <option>Google Gemini</option>
              </select>
              <p className="text-sm text-gray-600 mt-2">
                ✅ OpenRouter menggunakan model FREE yang powerful untuk generate RPP berkualitas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  defaultValue={apiKey}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  disabled
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (Kreativitas AI)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.7"
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-1">
                0 = Deterministik | 0.7 = Seimbang (Default) | 1 = Kreatif
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enable AI untuk RPP Generating
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-700">Gunakan AI untuk 5 pertemuan pertama</span>
              </label>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✨ Feature Toggles</h2>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium text-gray-900">Kaldik (Calendar)</p>
                <p className="text-sm text-gray-600">Input kalender akademik</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium text-gray-900">Prota (Annual Program)</p>
                <p className="text-sm text-gray-600">Breakdown tahunan per CP</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium text-gray-900">Prosem (Semester Program)</p>
                <p className="text-sm text-gray-600">Breakdown minggu per minggu</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium text-gray-900">RPP Generator with AI</p>
                <p className="text-sm text-gray-600">Auto-generate RPP dengan OpenRouter</p>
              </div>
            </label>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">📋 Workflow Rekomendasi</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. <strong>Kaldik</strong> → Input kalender akademik (tanggal, semester, libur)</li>
            <li>2. <strong>Prota</strong> → Breakdown CP/KD untuk seluruh tahun</li>
            <li>3. <strong>Prosem</strong> → Breakdown Prota per minggu</li>
            <li>4. <strong>RPP</strong> → Generate RPP dengan AI (atau manual)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
