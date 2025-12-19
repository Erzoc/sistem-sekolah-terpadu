import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="text-center text-white px-4">
        <h1 className="text-6xl font-bold mb-4">
          Dashboard Guru
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Sistem Manajemen Sekolah Multi-Tenant
        </p>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Login ke Dashboard
          </Link>
          
          <div className="mt-8 text-sm opacity-75">
            <p>🏫 Multi-tenant architecture</p>
            <p>🔐 Role-based access control</p>
            <p>📊 Comprehensive school management</p>
          </div>
        </div>
      </div>
    </div>
  );
}
