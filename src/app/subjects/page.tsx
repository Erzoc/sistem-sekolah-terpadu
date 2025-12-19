import PlaceholderPage from "@/components/PlaceholderPage";

export default function SubjectsPage() {
  return (
    <PlaceholderPage
      title="Mata Pelajaran"
      description="Manajemen mata pelajaran"
      icon="📖"
      features={[
        "Tambah mata pelajaran baru",
        "Edit detail mapel",
        "Assign guru pengampu",
        "Set kurikulum & KKM",
        "Export daftar mapel",
      ]}
    />
  );
}
