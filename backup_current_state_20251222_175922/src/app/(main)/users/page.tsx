import PlaceholderPage from "@/components/PlaceholderPage";

export default function UsersPage() {
  return (
    <PlaceholderPage
      title="Kelola Users"
      description="Manajemen pengguna sistem"
      icon="👥"
      features={[
        "Tambah user baru (Admin, Guru, Siswa)",
        "Edit profil user",
        "Reset password",
        "Assign role & permissions",
        "Export daftar user",
      ]}
    />
  );
}
