'use client';

interface User {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

interface RecentUsersProps {
  users: User[];
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin_sekolah: 'Admin Sekolah',
  guru: 'Guru',
  siswa: 'Siswa',
  ortu: 'Orang Tua',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

export default function RecentUsers({ users }: RecentUsersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
      <div className="space-y-3">
        {users.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No recent users</p>
        ) : (
          users.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {roleLabels[user.role] || user.role}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[user.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
