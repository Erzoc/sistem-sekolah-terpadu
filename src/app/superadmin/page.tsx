import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/database/client';
import { usersTable, tenantsTable, schoolProfilesTable } from '@/schemas';
import { eq, sql } from 'drizzle-orm';
import {
  Users,
  Shield,
  Building2,
  Activity,
  School,
  MapPin,
  User,
  Hash,
  Phone,
  Mail,
  Plus,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';

export default async function SuperAdminDashboard() {
  const session = await getServerSession(authOptions);

  // Fetch data
  const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(usersTable);
  const guruCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(usersTable)
    .where(eq(usersTable.role, 'guru'));
  const adminCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(usersTable)
    .where(eq(usersTable.role, 'admin_sekolah'));
  const totalSchools = await db.select({ count: sql<number>`count(*)` }).from(tenantsTable);

  const schoolProfiles = await db
    .select({
      profile: schoolProfilesTable,
      tenant: tenantsTable,
    })
    .from(schoolProfilesTable)
    .leftJoin(tenantsTable, eq(schoolProfilesTable.tenantId, tenantsTable.tenantId))
    .limit(5);

  // Get first school for detail sidebar
  const firstSchool = schoolProfiles[0];

  return (
    <div className="space-y-6">
      {/* Header - Compact */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {session?.user?.name || 'Super Administrator'} 👋
        </h1>
        <p className="text-sm text-slate-600 mt-1">Platform overview and system metrics</p>
      </div>

      {/* Main Layout: 70% Content + 30% Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN CONTENT - 70% (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards - Compact 2x2 Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Users */}
            <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 uppercase font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {totalUsers[0]?.count || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">+12% this month</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Guru Accounts */}
            <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 uppercase font-medium">Guru Accounts</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {guruCount[0]?.count || 0}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">+8% this week</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* School Admins */}
            <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 uppercase font-medium">School Admins</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {adminCount[0]?.count || 0}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">+3 new this month</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Total Schools */}
            <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 uppercase font-medium">Total Schools</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {totalSchools[0]?.count || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {totalSchools[0]?.count || 0} active
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <School className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* School Profiles - Compact List */}
          <div className="bg-white rounded-lg border">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-slate-900">School Profiles</h2>
              <Link
                href="/superadmin/tenants"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="divide-y">
              {schoolProfiles.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <School className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-sm">No schools registered yet</p>
                </div>
              ) : (
                schoolProfiles.map((item) => (
                  <div
                    key={item.profile.profileId}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <School className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{item.tenant?.schoolName}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-600 flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {item.tenant?.npsn}
                            </span>
                            <span className="text-xs text-slate-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.tenant?.city}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            </div>
            <div className="divide-y">
              {[
                {
                  icon: UserPlus,
                  color: 'text-blue-600 bg-blue-50',
                  text: 'New teacher registered',
                  school: 'YPI NH',
                  time: '5 minutes ago',
                },
                {
                  icon: CheckCircle2,
                  color: 'text-green-600 bg-green-50',
                  text: 'School profile approved',
                  school: 'YPI NH',
                  time: '1 hour ago',
                },
                {
                  icon: Settings,
                  color: 'text-purple-600 bg-purple-50',
                  text: 'System settings updated',
                  school: 'Super Admin',
                  time: '3 hours ago',
                },
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${activity.color} rounded-lg`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{activity.text}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-600">{activity.school}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDEBAR - 30% (1 column) */}
        <div className="space-y-6">
          {/* Quick Actions - Now Above the Fold! */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-5 text-white">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/superadmin/tenants/new"
                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <div className="p-2 bg-white/20 rounded-lg">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Add New School</span>
              </Link>
              <Link
                href="/superadmin/users"
                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <div className="p-2 bg-white/20 rounded-lg">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Invite User</span>
              </Link>
              <Link
                href="/superadmin/settings"
                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <div className="p-2 bg-white/20 rounded-lg">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">System Settings</span>
              </Link>
            </div>
          </div>

          {/* School Detail - Compact */}
          {firstSchool && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Your School Detail</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-blue-600 uppercase font-medium">School Name</p>
                  <p className="text-sm font-semibold text-blue-900 mt-0.5">
                    {firstSchool.tenant?.schoolName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-medium">NPSN</p>
                    <p className="text-sm font-semibold text-blue-900 mt-0.5">
                      {firstSchool.tenant?.npsn}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-medium">Status</p>
                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded mt-0.5">
                      Active
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-blue-600 uppercase font-medium">Location</p>
                  <p className="text-sm text-blue-800 mt-0.5">
                    {firstSchool.tenant?.city}, {firstSchool.tenant?.province}
                  </p>
                </div>

                <Link
                  href={`/superadmin/tenants/${firstSchool.tenant?.tenantId}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors mt-4"
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          )}

          {/* System Stats - Mini */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              System Health
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">CPU Usage</span>
                  <span className="font-semibold text-slate-900">42%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">Memory</span>
                  <span className="font-semibold text-slate-900">68%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">Database</span>
                  <span className="font-semibold text-slate-900">24.5 MB</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
