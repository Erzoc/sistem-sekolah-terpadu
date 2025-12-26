'use client';

interface RegistrationTrend {
  date: string;
  count: number;
}

interface RoleDistribution {
  role: string;
  count: number;
}

interface ChartsProps {
  registrationTrend: RegistrationTrend[];
  usersByRole: RoleDistribution[];
}

export default function Charts({ registrationTrend, usersByRole }: ChartsProps) {
  const maxCount = Math.max(...registrationTrend.map((d) => d.count), 1);

  const roleColors: Record<string, string> = {
    super_admin: 'bg-purple-500',
    admin_sekolah: 'bg-blue-500',
    guru: 'bg-green-500',
    siswa: 'bg-yellow-500',
    ortu: 'bg-pink-500',
  };

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin_sekolah: 'Admin Sekolah',
    guru: 'Guru',
    siswa: 'Siswa',
    ortu: 'Orang Tua',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Registration Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Registration (Last 7 Days)
        </h3>
        <div className="space-y-3">
          {registrationTrend.map((item) => (
            <div key={item.date} className="flex items-center">
              <span className="text-sm text-gray-600 w-24">
                {new Date(item.date).toLocaleDateString('id-ID', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <div className="flex-1 ml-4">
                <div className="bg-gray-200 rounded-full h-8 relative">
                  <div
                    className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  >
                    {item.count > 0 && (
                      <span className="text-xs font-medium text-white">{item.count}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User by Role</h3>
        <div className="space-y-4">
          {usersByRole.map((item) => (
            <div key={item.role}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {roleLabels[item.role] || item.role}
                </span>
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className={`${roleColors[item.role] || 'bg-gray-500'} h-3 rounded-full`}
                  style={{
                    width: `${
                      (item.count /
                        usersByRole.reduce((sum, r) => sum + r.count, 0)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
