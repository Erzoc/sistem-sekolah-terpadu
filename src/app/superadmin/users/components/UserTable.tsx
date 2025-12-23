'use client';

import { Edit2, Trash2, Shield, User } from 'lucide-react';

interface User {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  tenantId: string;
  phone?: string;
  nip?: string;
  createdAt: any;
}

interface Props {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading users...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <div className="text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No users found</p>
        </div>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      super_admin: 'bg-purple-100 text-purple-700',
      admin_sekolah: 'bg-blue-100 text-blue-700',
      guru: 'bg-emerald-100 text-emerald-700',
      siswa: 'bg-orange-100 text-orange-700',
      ortu: 'bg-gray-100 text-gray-700',
    };
    return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-emerald-100 text-emerald-700',
      inactive: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">NIP</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Phone</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.nip || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.phone || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit user"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
