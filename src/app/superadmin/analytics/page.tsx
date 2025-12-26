import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/database/client';
import { usersTable } from '@/schemas';
import { sql, eq } from 'drizzle-orm';
import { TrendingUp, Users, School, Activity, Download } from 'lucide-react';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  // 1. Total users (simple count)
  const totalUsersResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(usersTable);
  const totalUsers = totalUsersResult[0]?.count || 0;

  // 2. Users by role
  const usersByRole = await db
    .select({
      role: usersTable.role,
      count: sql<number>`count(*)`,
    })
    .from(usersTable)
    .groupBy(usersTable.role);

  // 3. Users by status
  const usersByStatus = await db
    .select({
      status: usersTable.status,
      count: sql<number>`count(*)`,
    })
    .from(usersTable)
    .groupBy(usersTable.status);

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin_sekolah: 'Admin Sekolah',
    guru: 'Guru',
    siswa: 'Siswa',
    ortu: 'Orang Tua',
  };

  const activeCount = usersByStatus.find((s) => s.status === 'active')?.count || 0;
  const pendingCount = usersByStatus.find((s) => s.status === 'pending')?.count || 0;
  const guruCount = usersByRole.find((r) => r.role === 'guru')?.count || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600 mt-1">Platform usage statistics</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Total Users</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{totalUsers}</p>
          <p className="text-xs text-slate-500 mt-2">All registered</p>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Active Users</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{activeCount}</p>
          <p className="text-xs text-slate-500 mt-2">Status: Active</p>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Guru Accounts</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{guruCount}</p>
          <p className="text-xs text-slate-500 mt-2">Teacher accounts</p>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <School className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Pending</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{pendingCount}</p>
          <p className="text-xs text-slate-500 mt-2">Awaiting approval</p>
        </div>
      </div>

      {/* Charts - Simple Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Users by Role</h3>
          <div className="space-y-4">
            {usersByRole.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No data available</p>
            ) : (
              usersByRole.map((item) => {
                const total = usersByRole.reduce((sum, r) => sum + (r.count as number), 0);
                const percentage = total > 0 ? Math.round(((item.count as number) / total) * 100) : 0;

                return (
                  <div key={item.role}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        {roleLabels[item.role] || item.role}
                      </span>
                      <span className="text-sm text-slate-900 font-semibold">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Users by Status */}
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Users by Status</h3>
          <div className="space-y-4">
            {usersByStatus.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No data available</p>
            ) : (
              usersByStatus.map((item) => {
                const statusColors = {
                  active: 'from-green-500 to-emerald-500',
                  pending: 'from-yellow-500 to-orange-500',
                  inactive: 'from-gray-500 to-slate-500',
                };

                const total = usersByStatus.reduce((sum, s) => sum + (s.count as number), 0);
                const percentage = total > 0 ? Math.round(((item.count as number) / total) * 100) : 0;

                return (
                  <div key={item.status}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700 capitalize">
                        {item.status}
                      </span>
                      <span className="text-sm text-slate-900 font-semibold">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-3">
                      <div
                        className={`bg-gradient-to-r ${statusColors[item.status as keyof typeof statusColors] || 'from-gray-500 to-slate-500'} h-3 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-600 uppercase">Total Accounts</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalUsers}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 uppercase">Active Rate</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {totalUsers > 0 ? Math.round((activeCount / totalUsers) * 100) : 0}%
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-600 uppercase">Pending Approval</p>
            <p className="text-2xl font-bold text-orange-900 mt-1">{pendingCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
