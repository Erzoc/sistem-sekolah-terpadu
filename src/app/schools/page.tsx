import PlaceholderPage from "@/components/PlaceholderPage";

export default function SchoolsPage() {
  return (
    <PlaceholderPage
      title="Kelola Sekolah"
      description="Manajemen sekolah dalam sistem"
      icon="🏫"
      features={[
        "Tambah sekolah baru",
        "Edit informasi sekolah",
        "Lihat statistik per sekolah",
        "Assign admin ke sekolah",
        "Export data sekolah",
      ]}
    />
  );
}
