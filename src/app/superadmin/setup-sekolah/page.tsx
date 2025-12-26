'use client';

import { useState } from 'react';
import {
  School,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Award,
  Calendar,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Hash,
  FileText,
} from 'lucide-react';

// Data Indonesia
const PROVINCES = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi', 'Sumatera Selatan',
  'Bengkulu', 'Lampung', 'Kepulauan Bangka Belitung', 'Kepulauan Riau',
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur',
  'Banten', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur',
  'Kalimantan Utara', 'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan',
  'Sulawesi Tenggara', 'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara',
  'Papua', 'Papua Barat',
];

export default function SetupSekolahPage() {
  const [formData, setFormData] = useState({
    namaSekolah: 'YPI NH',
    npsn: '802836',
    nss: '',
    jenjang: 'SMA',
    status: 'swasta',
    akreditasi: 'A',
    provinsi: 'Sumatera Utara',
    kabupaten: 'Medan',
    kecamatan: '',
    kelurahan: '',
    alamat: 'Jl Pertahanan SUMATERA UTARA',
    kodePos: '',
    telepon: '021 6536782',
    email: 'infoypi@sch.id',
    website: '',
    fax: '',
    namaKepsek: 'Salmiah, S.Pdi',
    nipKepsek: '198273934',
    tahunBerdiri: '',
    visi: '',
    misi: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSaveStatus('success');
    setIsSaving(false);

    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Setup Profil Sekolah</h1>
        <p className="text-sm text-slate-600 mt-1">
          Konfigurasikan identitas dan informasi sekolah
        </p>
      </div>

      {/* Main Layout: Form (Left) + Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM SECTION - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. IDENTITAS SEKOLAH */}
          <div className="bg-white rounded-lg border">
            <div className="flex items-center gap-3 p-4 border-b bg-slate-50">
              <div className="p-2 bg-blue-50 rounded-lg">
                <School className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Identitas Sekolah</h2>
                <p className="text-xs text-slate-600">Data identitas sekolah</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Sekolah */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Sekolah <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="namaSekolah"
                      value={formData.namaSekolah}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: SMA Negeri 1 Jakarta"
                    />
                  </div>
                </div>

                {/* NPSN */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    NPSN <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="npsn"
                      value={formData.npsn}
                      onChange={handleChange}
                      maxLength={8}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8 digit"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Nomor Pokok Sekolah Nasional (8 digit)</p>
                </div>

                {/* NSS */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    NSS
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="nss"
                      value={formData.nss}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nomor Statistik Sekolah"
                    />
                  </div>
                </div>

                {/* Jenjang */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Jenjang <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jenjang"
                    value={formData.jenjang}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Jenjang</option>
                    <option value="TK">TK</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="SMK">SMK</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Status</option>
                    <option value="negeri">Negeri</option>
                    <option value="swasta">Swasta</option>
                  </select>
                </div>

                {/* Akreditasi */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Akreditasi
                  </label>
                  <select
                    name="akreditasi"
                    value={formData.akreditasi}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Akreditasi</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="belum">Belum Terakreditasi</option>
                  </select>
                </div>

                {/* Tahun Berdiri */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tahun Berdiri
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      name="tahunBerdiri"
                      value={formData.tahunBerdiri}
                      onChange={handleChange}
                      min="1900"
                      max="2099"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: 1990"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. LOKASI SEKOLAH */}
          <div className="bg-white rounded-lg border">
            <div className="flex items-center gap-3 p-4 border-b bg-slate-50">
              <div className="p-2 bg-green-50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Lokasi Sekolah</h2>
                <p className="text-xs text-slate-600">Alamat lengkap sekolah</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Provinsi */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Provinsi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="provinsi"
                    value={formData.provinsi}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Provinsi</option>
                    {PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kabupaten/Kota */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kabupaten/Kota <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="kabupaten"
                    value={formData.kabupaten}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: Jakarta Selatan"
                  />
                </div>

                {/* Kecamatan */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    name="kecamatan"
                    value={formData.kecamatan}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: Kebayoran Baru"
                  />
                </div>

                {/* Kelurahan/Desa */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kelurahan/Desa
                  </label>
                  <input
                    type="text"
                    name="kelurahan"
                    value={formData.kelurahan}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: Senayan"
                  />
                </div>

                {/* Alamat Lengkap */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jalan, nomor, RT/RW, dll"
                    />
                  </div>
                </div>

                {/* Kode Pos */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    name="kodePos"
                    value={formData.kodePos}
                    onChange={handleChange}
                    maxLength={5}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5 digit"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. KONTAK */}
          <div className="bg-white rounded-lg border">
            <div className="flex items-center gap-3 p-4 border-b bg-slate-50">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Informasi Kontak</h2>
                <p className="text-xs text-slate-600">Data kontak sekolah</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Telepon */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Telepon <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="021 1234567"
                    />
                  </div>
                </div>

                {/* Fax */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fax
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="fax"
                      value={formData.fax}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="021 7654321"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="sekolah@example.com"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://sekolah.sch.id"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. KEPALA SEKOLAH */}
          <div className="bg-white rounded-lg border">
            <div className="flex items-center gap-3 p-4 border-b bg-slate-50">
              <div className="p-2 bg-amber-50 rounded-lg">
                <User className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Kepala Sekolah</h2>
                <p className="text-xs text-slate-600">Data kepala sekolah</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Kepsek */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Kepala Sekolah
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="namaKepsek"
                      value={formData.namaKepsek}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dr. Ahmad Subarjo, S.Pd, M.Pd"
                    />
                  </div>
                </div>

                {/* NIP Kepsek */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    NIP Kepala Sekolah
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="nipKepsek"
                      value={formData.nipKepsek}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="196701011990031001"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. VISI MISI */}
          <div className="bg-white rounded-lg border">
            <div className="flex items-center gap-3 p-4 border-b bg-slate-50">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Visi & Misi</h2>
                <p className="text-xs text-slate-600">Visi dan misi sekolah</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Visi */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Visi Sekolah
                </label>
                <textarea
                  name="visi"
                  value={formData.visi}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Visi sekolah..."
                />
              </div>

              {/* Misi */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Misi Sekolah
                </label>
                <textarea
                  name="misi"
                  value={formData.misi}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1. ..."
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Data berhasil disimpan!</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Gagal menyimpan data</span>
              </div>
            )}
            {saveStatus === 'idle' && <div></div>}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* PREVIEW SECTION - 1 column */}
        <div className="space-y-6">
          {/* Live Preview - SOFT & PROFESSIONAL */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden sticky top-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <School className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Live Preview</h3>
                  <p className="text-xs text-slate-600">Tampilan data yang akan disimpan</p>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-5 space-y-4">
              {/* School Profile Card */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                    <School className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-lg truncate">
                      {formData.namaSekolah || 'Nama Sekolah'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {formData.jenjang && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                          {formData.jenjang}
                        </span>
                      )}
                      {formData.status && (
                        <span className="px-2 py-0.5 bg-slate-500 text-white text-xs font-medium rounded capitalize">
                          {formData.status}
                        </span>
                      )}
                      {formData.akreditasi && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded">
                          Akreditasi {formData.akreditasi}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1 font-medium">NPSN</p>
                  <p className="font-semibold text-slate-900">{formData.npsn || '-'}</p>
                </div>
                {formData.nss && (
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1 font-medium">NSS</p>
                    <p className="font-semibold text-slate-900">{formData.nss}</p>
                  </div>
                )}
                {formData.tahunBerdiri && (
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 col-span-2">
                    <p className="text-xs text-slate-600 mb-1 font-medium">Tahun Berdiri</p>
                    <p className="font-semibold text-slate-900">{formData.tahunBerdiri}</p>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-700 font-medium mb-1">Lokasi</p>
                    <p className="text-sm font-semibold text-green-900">
                      {formData.kabupaten || 'Kabupaten/Kota'}, {formData.provinsi || 'Provinsi'}
                    </p>
                    {formData.kecamatan && (
                      <p className="text-xs text-green-700 mt-1">Kec. {formData.kecamatan}</p>
                    )}
                  </div>
                </div>
                {formData.alamat && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-800 leading-relaxed">{formData.alamat}</p>
                    {formData.kodePos && (
                      <p className="text-xs text-green-700 mt-1">Kode Pos: {formData.kodePos}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Kepala Sekolah */}
              {formData.namaKepsek && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-amber-700 font-medium mb-1">Kepala Sekolah</p>
                      <p className="font-semibold text-amber-900">{formData.namaKepsek}</p>
                      {formData.nipKepsek && (
                        <p className="text-xs text-amber-700 mt-1">NIP: {formData.nipKepsek}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 space-y-2">
                <p className="text-xs text-purple-700 font-medium mb-2">Kontak</p>

                {formData.telepon && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-purple-900">{formData.telepon}</span>
                  </div>
                )}

                {formData.email && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-purple-900 truncate">{formData.email}</span>
                  </div>
                )}

                {formData.website && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center flex-shrink-0">
                      <Globe className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-purple-900 truncate">{formData.website}</span>
                  </div>
                )}
              </div>

              {/* Validation Status */}
              <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Data Valid & Siap Disimpan</span>
              </div>
            </div>
          </div>

          {/* Tips - Soft Design */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-900 text-sm mb-2">Panduan Pengisian</p>
                <ul className="text-xs text-blue-800 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Field bertanda (*) wajib diisi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>NPSN harus 8 digit angka</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Pastikan data sesuai dengan Dapodik</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Email akan digunakan untuk notifikasi sistem</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
