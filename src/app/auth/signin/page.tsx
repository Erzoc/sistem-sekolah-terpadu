"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (role: string) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        role,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
      } else {
        alert("Login gagal!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard SSTF
          </h1>
          <p className="text-gray-600">Pilih role untuk masuk</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleLogin("superadmin")}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔐</span>
            <span>Super Admin</span>
          </button>

          <button
            onClick={() => handleLogin("admin")}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-xl">👤</span>
            <span>Admin Sekolah</span>
          </button>

          <button
            onClick={() => handleLogin("guru")}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-xl">👨‍🏫</span>
            <span>Guru</span>
          </button>

          <button
            onClick={() => handleLogin("siswa")}
            disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-xl">🎓</span>
            <span>Siswa</span>
          </button>
        </div>

        {loading && (
          <div className="mt-4 text-center text-gray-600">
            <span className="inline-block animate-spin mr-2">⏳</span>
            Memproses login...
          </div>
        )}
      </div>
    </div>
  );
}
