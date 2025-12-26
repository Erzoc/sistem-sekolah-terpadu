import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/database/client';
import { usersTable, tenantsTable } from '@/schemas';
import { sql, eq } from 'drizzle-orm';
import {
  Users,
  Shield,
  GraduationCap,
  UserCog,
  Search,
  Filter,
  Download,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default async function UsersManagementPage() {
  const session = await getServerSession(authOptions);

  // Fetch all users with tenant info
  const users = await db
    .select({
      user: usersTable,
      tenant: tenantsTable,
    })
    .from(usersTable)
    .leftJoin(tenantsTable, eq(usersTable.tenantId, tenantsTable.tenantId));

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.user.status === 'active').length;
  const guruCount = users.filter((u) => u.user.role === 'guru').length;
  const siswaCount = users.filter((u) => u.user.role === 'siswa').length;

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin_sekolah: 'Admin Sekolah',
    guru: 'Guru',
    siswa: 'Siswa',
    ortu: 'Orang Tua',
  };

  const roleBadgeColors: Record<string, string> = {
    super_admin: 'bg-purple-100 text-purple-700',
    admin_sekolah: 'bg-blue-100 text-blue-700',
    guru: 'bg-green-100 text-green-700',
    siswa: 'bg-amber-100 text-amber-700',
    ortu: 'bg-pink-100 text-pink-700',
  };

  const statusBadgeColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    inactive: 'bg-slate-100 text-slate-700',
  };

  const statusIcons: Record<string, any> = {
    active: CheckCircle2,
    pending: Clock,
    inactive: XCircle,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen User</h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola semua user yang terdaftar di sekolah Anda
          </p>
        </div>
        <Link
          href="/superadmin/users/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Tambah User
        </Link>
      </div>

      {/* Stats Cards - Compact 4 Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-slate-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
          <p className="text-xs text-slate-600 mt-1">Total User</p>
        </div>

        <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-slate-500">Aktif</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeUsers}</p>
          <p className="text-xs text-slate-600 mt-1">User Aktif</p>
        </div>

        <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-slate-500">Guru</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{guruCount}</p>
          <p className="text-xs text-slate-600 mt-1">Akun Guru</p>
        </div>

        <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-slate-500">Siswa</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{siswaCount}</p>
          <p className="text-xs text-slate-600 mt-1">Akun Siswa</p>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px]">
            <option value="">Semua Role</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin_sekolah">Admin Sekolah</option>
            <option value="guru">Guru</option>
            <option value="siswa">Siswa</option>
            <option value="ortu">Orang Tua</option>
          </select>

          {/* Status Filter */}
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px]">
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Telepon
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  NIP/NISN
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Tidak ada user ditemukan</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Tambahkan user pertama untuk memulai
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((item) => {
                  const StatusIcon = statusIcons[item.user.status || 'pending'];
                  return (
                    <tr key={item.user.userId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {item.user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{item.user.fullName}</p>
                            <p className="text-xs text-slate-500">{item.tenant?.schoolName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">{item.user.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            roleBadgeColors[item.user.role]
                          }`}
                        >
                          {roleLabels[item.user.role] || item.user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusBadgeColors[item.user.status || 'pending']
                          }`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {item.user.status === 'active'
                            ? 'Aktif'
                            : item.user.status === 'pending'
                            ? 'Pending'
                            : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {item.user.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">{item.user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-700">
                          {item.user.nip || item.user.nisn || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors group"
                            title="More"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">
                Menampilkan <span className="font-medium">{users.length}</span> dari{' '}
                <span className="font-medium">{totalUsers}</span> user
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium">
                1
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                2
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                3
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
