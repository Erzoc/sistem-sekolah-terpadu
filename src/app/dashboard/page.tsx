"use client";

import { useSession } from "next-auth/react";
import SuperadminDashboard from "@/components/dashboard/SuperadminDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import GuruDashboard from "@/components/dashboard/GuruDashboard";
import SiswaDashboard from "@/components/dashboard/SiswaDashboard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  // Render dashboard based on role
  const renderDashboard = () => {
    switch (role) {
      case "superadmin":
        return <SuperadminDashboard />;
      case "admin":
        return <AdminDashboard />;
      case "guru":
        return <GuruDashboard />;
      case "siswa":
        return <SiswaDashboard />;
      default:
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">Role tidak dikenali: {role}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2">
          Selamat Datang, {session?.user?.name}! 👋
        </h2>
        <p className="text-blue-100">
          Anda login sebagai{" "}
          <span className="font-bold">{role?.toUpperCase()}</span>
        </p>
      </div>

      {/* Role-based Dashboard */}
      {renderDashboard()}
    </div>
  );
}
