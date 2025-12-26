'use client';

import { useEffect, useState } from 'react';
import { ClipboardIcon, LinkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Invite {
  inviteId: string;
  inviteCode: string;
  role: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function InviteCodesList() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'code' | 'link' | null>(null);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const response = await fetch('/api/admin/invites/list', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setInvites(data.invites);
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setCopiedType('code');
    setTimeout(() => {
      setCopiedId(null);
      setCopiedType(null);
    }, 2000);
  };

  const copyLink = async (code: string, id: string) => {
    const baseUrl = window.location.origin;
    const fullLink = `${baseUrl}/register?invite=${code}`;
    await navigator.clipboard.writeText(fullLink);
    setCopiedId(id);
    setCopiedType('link');
    setTimeout(() => {
      setCopiedId(null);
      setCopiedType(null);
    }, 2000);
  };

  const getStatusBadge = (invite: Invite) => {
    const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
    const isFullyUsed = invite.usedCount >= invite.maxUses;

    if (!invite.isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">Nonaktif</span>;
    }
    if (isExpired) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">Kadaluarsa</span>;
    }
    if (isFullyUsed) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">Penuh</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">Aktif</span>;
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (invites.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada kode undangan. Buat kode undangan pertama Anda!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Kode</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Penggunaan</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Berlaku Sampai</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite) => (
            <tr key={invite.inviteId} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <code className="font-mono text-sm font-semibold text-gray-900">
                  {invite.inviteCode}
                </code>
              </td>
              <td className="py-3 px-4">
                <span className="capitalize">{invite.role.replace('_', ' ')}</span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className="font-medium">
                  {invite.usedCount} / {invite.maxUses}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {invite.expiresAt
                  ? new Date(invite.expiresAt).toLocaleDateString('id-ID')
                  : 'Tidak ada batas'}
              </td>
              <td className="py-3 px-4">{getStatusBadge(invite)}</td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  {/* Copy Code Button */}
                  <button
                    onClick={() => copyCode(invite.inviteCode, invite.inviteId)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    title="Copy kode saja"
                  >
                    {copiedId === invite.inviteId && copiedType === 'code' ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">OK</span>
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="w-4 h-4" />
                        Kode
                      </>
                    )}
                  </button>

                  {/* Copy Link Button */}
                  <button
                    onClick={() => copyLink(invite.inviteCode, invite.inviteId)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                    title="Copy link registrasi lengkap"
                  >
                    {copiedId === invite.inviteId && copiedType === 'link' ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">OK</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        Link
                      </>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
