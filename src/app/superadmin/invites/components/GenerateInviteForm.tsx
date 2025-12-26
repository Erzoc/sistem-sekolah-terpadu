'use client';

import { useState } from 'react';
import { CheckCircleIcon, ClipboardIcon, LinkIcon } from '@heroicons/react/24/outline';

type InviteRole = 'guru' | 'siswa' | 'ortu' | 'admin_sekolah';

export default function GenerateInviteForm() {
  const [role, setRole] = useState<InviteRole>('guru');
  const [maxUses, setMaxUses] = useState(1);
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'code' | 'link' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedCode(null);

    try {
      const response = await fetch('/api/admin/invites/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          role,
          maxUses,
          expiresInDays,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal generate kode undangan');
      }

      setGeneratedCode(data.invite.code);
      console.log('✅ Invite code generated:', data.invite.code);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode);
      setCopiedType('code');
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const copyFullLink = async () => {
    if (generatedCode) {
      const baseUrl = window.location.origin;
      const fullLink = `${baseUrl}/register?invite=${generatedCode}`;
      await navigator.clipboard.writeText(fullLink);
      setCopiedType('link');
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const getFullLink = () => {
    if (!generatedCode) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?invite=${generatedCode}`;
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as InviteRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
              <option value="ortu">Orang Tua</option>
              <option value="admin_sekolah">Admin Sekolah</option>
            </select>
          </div>

          {/* Max Uses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maksimal Penggunaan
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={maxUses}
              onChange={(e) => setMaxUses(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Berapa kali kode bisa digunakan
            </p>
          </div>

          {/* Expires In Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Berlaku (Hari)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kode berlaku selama berapa hari
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Kode Undangan'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message with Code & Link */}
      {generatedCode && (
        <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-3">
                Kode Undangan Berhasil Dibuat! 🎉
              </h3>

              {/* Invite Code */}
              <div className="bg-white p-4 rounded-lg border border-green-300 mb-3">
                <label className="text-xs font-medium text-gray-600 mb-2 block">
                  Kode Undangan:
                </label>
                <div className="flex items-center justify-between gap-4">
                  <code className="text-xl font-mono font-bold text-gray-900">
                    {generatedCode}
                  </code>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <ClipboardIcon className="w-5 h-5" />
                    {copiedType === 'code' ? 'Tersalin!' : 'Copy Kode'}
                  </button>
                </div>
              </div>

              {/* Full Registration Link */}
              <div className="bg-white p-4 rounded-lg border border-green-300 mb-3">
                <label className="text-xs font-medium text-gray-600 mb-2 block">
                  Link Registrasi Lengkap:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-200 overflow-x-auto">
                    <code className="text-sm text-gray-700 whitespace-nowrap">
                      {getFullLink()}
                    </code>
                  </div>
                  <button
                    onClick={copyFullLink}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0"
                  >
                    <LinkIcon className="w-5 h-5" />
                    {copiedType === 'link' ? '✓ Tersalin!' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 text-sm mb-2">
                  📲 Cara Membagikan:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Klik "Copy Link" dan kirim via WhatsApp/Email</li>
                  <li>• User tinggal klik link untuk langsung registrasi</li>
                  <li>• Kode dapat digunakan <strong>{maxUses}x</strong>, berlaku <strong>{expiresInDays} hari</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
