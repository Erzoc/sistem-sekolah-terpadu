"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

type FormData = {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  npsn: string;
  principalName: string;
  principalNip: string;
  logoUrl: string;
};

export default function SetupSchoolProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    schoolAddress: "",
    schoolPhone: "",
    schoolEmail: "",
    npsn: "",
    principalName: "",
    principalNip: "",
    logoUrl: "",
  });

  // Fetch existing profile jika ada
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!session?.user?.tenantId) return;
        
        const response = await fetch(
          `/api/school-profile?tenantId=${session.user.tenantId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.profile) {
            setFormData(data.profile);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [session?.user?.tenantId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.tenantId) {
      toast.error("Session tidak valid");
      return;
    }

    if (!formData.schoolName.trim()) {
      toast.error("Nama sekolah harus diisi");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/school-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tenantId: session.user.tenantId,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan profil");
      }

      toast.success("✅ Profil sekolah berhasil disimpan!");
      
      // Redirect ke dashboard setelah 1 detik
      setTimeout(() => {
        router.push("/guru");
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("❌ Gagal menyimpan profil. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="text-gray-600 mt-4">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/guru"
          className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-4 inline-block"
        >
          ← Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Setup Profil Sekolah</h1>
        <p className="text-gray-600 mt-2">
          Data ini akan digunakan sebagai kop surat untuk semua dokumen RPP, Prota, dan
          Prosem yang Anda buat.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          {/* Section 1: Identitas Sekolah */}
          <fieldset className="mb-8 pb-8 border-b border-gray-200">
            <legend className="text-lg font-bold text-gray-900 mb-6">
              📋 Identitas Sekolah
            </legend>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Sekolah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Contoh: SMA Negeri 1 Jakarta"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Sekolah
                </label>
                <textarea
                  name="schoolAddress"
                  value={formData.schoolAddress}
                  onChange={handleChange}
                  placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Pusat"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  name="schoolPhone"
                  value={formData.schoolPhone}
                  onChange={handleChange}
                  placeholder="Contoh: (021) 1234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Sekolah
                </label>
                <input
                  type="email"
                  name="schoolEmail"
                  value={formData.schoolEmail}
                  onChange={handleChange}
                  placeholder="Contoh: info@smansatu.sch.id"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NPSN (Nomor Pokok Sekolah Nasional)
                </label>
                <input
                  type="text"
                  name="npsn"
                  value={formData.npsn}
                  onChange={handleChange}
                  placeholder="Contoh: 20109876"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </fieldset>

          {/* Section 2: Data Kepala Sekolah */}
          <fieldset className="mb-8">
            <legend className="text-lg font-bold text-gray-900 mb-6">
              👤 Data Kepala Sekolah
            </legend>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  name="principalName"
                  value={formData.principalName}
                  onChange={handleChange}
                  placeholder="Contoh: Drs. Ahmad Sutrisno, M.Pd."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  name="principalNip"
                  value={formData.principalNip}
                  onChange={handleChange}
                  placeholder="Contoh: 196801012000011001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Logo Sekolah (opsional)
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="Contoh: https://example.com/logo.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Logo akan ditampilkan di kop surat dokumen
                </p>
              </div>
            </div>
          </fieldset>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/guru"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "💾 Simpan Profil"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
