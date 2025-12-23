import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Users, BookOpen, FileText, ClipboardList, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function GuruDashboard() {
  const session = await getServerSession(authOptions);

  const stats = [
    { label: 'Kelas Aktif', value: '3', icon: Users, color: 'blue', trend: '+2 dari bulan lalu' },
    { label: 'Total Siswa', value: '87', icon: BookOpen, color: 'emerald', trend: 'Aktif semester ini' },
    { label: 'RPP Tersimpan', value: '12', icon: FileText, color: 'purple', trend: '8 sudah di-review' },
    { label: 'Soal Dibuat', value: '45', icon: ClipboardList, color: 'orange', trend: '15 minggu ini' },
  ];

  const quickLinks = [
    { title: 'Kaldik', description: 'Kelola kalender didik', icon: Calendar, href: '/guru/rpp/kaldik', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', iconBg: 'bg-blue-500', text: 'text-blue-600' },
    { title: 'Prota', description: 'Program tahunan', icon: BookOpen, href: '/guru/rpp/prota', bg: 'from-green-50 to-green-100', border: 'border-green-200', iconBg: 'bg-green-500', text: 'text-green-600' },
    { title: 'Prosem', description: 'Program semester', icon: FileText, href: '/guru/rpp/prosem', bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', iconBg: 'bg-purple-500', text: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-semibold text-gray-900">Dashboard</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session?.user?.name || 'Guru'} 👋</h1>
        <p className="text-gray-600 mt-1">Platform overview and system metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', purple: 'bg-purple-50 text-purple-600', orange: 'bg-orange-50 text-orange-600' };
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  {stat.trend}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Akses Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.title} href={link.href} className={`bg-gradient-to-br ${link.bg} rounded-xl p-6 border ${link.border} hover:shadow-md transition-all group`}>
                <div className={`w-12 h-12 ${link.iconBg} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{link.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{link.description}</p>
                <div className="flex items-center text-sm font-medium gap-2 group-hover:translate-x-1 transition-transform">
                  <span className={link.text}>Buka</span>
                  <ArrowRight className={`w-4 h-4 ${link.text}`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
