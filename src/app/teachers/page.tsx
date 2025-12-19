"use client";

import { useState, useEffect, useRef } from "react";
import { exportToExcel, importFromExcel, downloadTemplate } from "@/lib/exportUtils";

interface Teacher {
  id: number;
  nip: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  status: string;
  joinDate: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    nip: "",
    name: "",
    email: "",
    phone: "",
    subject: "",
    status: "active",
    joinDate: "",
  });

  // Fetch teachers
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/teachers?search=${search}`);
      const data = await res.json();
      setTeachers(data.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [search]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingTeacher ? "PUT" : "POST";
    const body = editingTeacher
      ? { ...formData, id: editingTeacher.id }
      : formData;

    try {
      const res = await fetch("/api/v1/teachers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        alert(result.message);
        setShowModal(false);
        setEditingTeacher(null);
        resetForm();
        fetchTeachers();
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
      alert("Gagal menyimpan data");
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus guru ini?")) return;

    try {
      const res = await fetch(`/api/v1/teachers?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        alert(result.message);
        fetchTeachers();
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Gagal menghapus data");
    }
  };

  // Handle edit
  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      nip: teacher.nip,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
      status: teacher.status,
      joinDate: teacher.joinDate,
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      nip: "",
      name: "",
      email: "",
      phone: "",
      subject: "",
      status: "active",
      joinDate: "",
    });
  };

  // Export to Excel
  const handleExport = () => {
    const exportData = teachers.map((teacher) => ({
      NIP: teacher.nip,
      Nama: teacher.name,
      Email: teacher.email,
      Telepon: teacher.phone,
      "Mata Pelajaran": teacher.subject,
      Status: teacher.status === "active" ? "Aktif" : "Nonaktif",
      "Tanggal Bergabung": teacher.joinDate,
    }));

    exportToExcel(exportData, "Data_Guru", "Guru");
  };

  // Download template
  const handleDownloadTemplate = () => {
    const headers = [
      "NIP",
      "Nama",
      "Email",
      "Telepon",
      "Mata Pelajaran",
      "Tanggal Bergabung",
    ];
    downloadTemplate(headers, "Template_Import_Guru", "Template");
  };

  // Handle import
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromExcel(file);

      if (data.length === 0) {
        alert("File Excel kosong!");
        return;
      }

      // Send to API
      const res = await fetch("/api/v1/teachers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teachers: data }),
      });

      const result = await res.json();

      if (result.successCount > 0) {
        alert(
          `Import berhasil!\n\nBerhasil: ${result.successCount}\nGagal: ${result.errorCount}\n\n${
            result.errors.length > 0
              ? "Error:\n" + result.errors.join("\n")
              : ""
          }`
        );
        fetchTeachers();
        setShowImportModal(false);
      } else {
        alert("Import gagal!\n\n" + result.errors.join("\n"));
      }
    } catch (error) {
      console.error("Error importing:", error);
      alert("Gagal membaca file Excel!");
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Guru</h1>
          <p className="text-gray-600 mt-1">
            Kelola data guru dan pengampu mata pelajaran
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          >
            <span>📤</span>
            Import Excel
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          >
            <span>📥</span>
            Export Excel
          </button>
          <button
            onClick={() => {
              setEditingTeacher(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          >
            <span>➕</span>
            Tambah Guru
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Cari guru (nama, NIP, atau mata pelajaran)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Guru</p>
          <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Guru Aktif</p>
          <p className="text-2xl font-bold text-green-600">
            {teachers.filter((t) => t.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Mata Pelajaran</p>
          <p className="text-2xl font-bold text-blue-600">
            {new Set(teachers.map((t) => t.subject)).size}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin text-4xl mb-2">⏳</div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Tidak ada data guru</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    NIP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Telepon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mata Pelajaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {teacher.nip}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {teacher.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {teacher.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {teacher.subject}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          teacher.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {teacher.status === "active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingTeacher ? "Edit Guru" : "Tambah Guru Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIP
                </label>
                <input
                  type="text"
                  required
                  value={formData.nip}
                  onChange={(e) =>
                    setFormData({ ...formData, nip: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telepon
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Bergabung
                </label>
                <input
                  type="date"
                  required
                  value={formData.joinDate}
                  onChange={(e) =>
                    setFormData({ ...formData, joinDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTeacher(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingTeacher ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Import Data Guru dari Excel
            </h2>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  📋 Langkah-langkah:
                </p>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Download template Excel</li>
                  <li>Isi data guru sesuai kolom</li>
                  <li>Upload file yang sudah diisi</li>
                </ol>
              </div>

              <button
                onClick={handleDownloadTemplate}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <span>⬇️</span>
                Download Template Excel
              </button>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File Excel:
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImport}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Format: .xlsx atau .xls
                </p>
              </div>

              <button
                onClick={() => setShowImportModal(false)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
