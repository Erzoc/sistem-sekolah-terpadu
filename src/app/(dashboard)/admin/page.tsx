'use client';

import { useSession } from 'next-auth/react';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Super Admin Dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Selamat datang, {user?.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tenants"
          value="12"
          icon="🏢"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Users"
          value="1,234"
          icon="👥"
          color="bg-green-500"
        />
        <StatCard
          title="Total Schools"
          value="45"
          icon="🏫"
          color="bg-purple-500"
        />
        <StatCard
          title="Active Sessions"
          value="89"
          icon="🔐"
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <ActivityItem
            action="New tenant registered"
            details="SMK Negeri 1 Jakarta"
            time="2 hours ago"
          />
          <ActivityItem
            action="User created"
            details="admin@school5.com"
            time="3 hours ago"
          />
          <ActivityItem
            action="System update"
            details="Version 2.1.0 deployed"
            time="5 hours ago"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton label="Add Tenant" icon="➕" />
          <QuickActionButton label="Manage Users" icon="👥" />
          <QuickActionButton label="View Reports" icon="📊" />
          <QuickActionButton label="Settings" icon="⚙️" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ action, details, time }: any) {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{action}</p>
        <p className="text-xs text-gray-500">{details}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}

function QuickActionButton({ label, icon }: any) {
  return (
    <button className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
