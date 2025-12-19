import PlaceholderPage from "@/components/PlaceholderPage";

export default function ClassesPage() {
  return (
    <PlaceholderPage
      title="Kelola Kelas"
      description="Manajemen kelas dan jadwal"
      icon="📚"
      features={[
        "Buat kelas baru",
        "Assign wali kelas",
        "Tambah siswa ke kelas",
        "Atur jadwal pelajaran",
        "Lihat daftar siswa per kelas",
      ]}
    />
  );
}
