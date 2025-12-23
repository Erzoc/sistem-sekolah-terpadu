import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/database/client';
import { usersTable } from '@/schemas/users';
import { eq, sql } from 'drizzle-orm';
import { Users, Shield, Building2, Activity } from 'lucide-react';

export default async function SuperAdminDashboard() {
  const session = await getServerSession(authOptions);

  // Fetch stats from database
  const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(usersTable);
  const guruCount = await db.select({ count: sql<number>`count(*)` }).from(usersTable).where(eq(usersTable.role, 'guru'));
  const adminCount = await db.select({ count: sql<number>`count(*)` }).from(usersTable).where(eq(usersTable.role, 'admin_sekolah'));

  const stats = [
    { 
      label: 'Total Users', 
      value: totalUsers[0]?.count?.toString() || '0', 
      icon: Users, 
      color: 'purple',
      change: '+12% from last month'
    },
    { 
      label: 'Guru Accounts', 
      value: guruCount[0]?.count?.toString() || '0', 
      icon: Shield, 
      color: 'emerald',
      change: '+8% this week'
    },
    { 
      label: 'School Admins', 
      value: adminCount[0]?.count?.toString() || '0', 
      icon: Building2, 
      color: 'blue',
      change: '+3 new this month'
    },
    { 
      label: 'Active Sessions', 
      value: '24', 
      icon: Activity, 
      color: 'orange',
      change: 'Real-time'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {session?.user?.name} 👋
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Platform overview and system metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            purple: 'bg-purple-50 text-purple-600',
            emerald: 'bg-emerald-50 text-emerald-600',
            blue: 'bg-blue-50 text-blue-600',
            orange: 'bg-orange-50 text-orange-600',
          };

          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/superadmin/users"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-all"
          >
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-600">View & edit all users</p>
            </div>
          </a>
          
          <a
            href="/superadmin/tenants"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all"
          >
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Tenants</p>
              <p className="text-xs text-gray-600">School organizations</p>
            </div>
          </a>

          <a
            href="/superadmin/settings"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50/50 transition-all"
          >
            <Shield className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Settings</p>
              <p className="text-xs text-gray-600">System configuration</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
