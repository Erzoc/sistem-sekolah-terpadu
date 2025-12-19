import PlaceholderPage from "@/components/PlaceholderPage";

export default function GradesPage() {
  return (
    <PlaceholderPage
      title="Input Nilai"
      description="Input dan kelola nilai siswa"
      icon="📝"
      features={[
        "Input nilai harian",
        "Input nilai UTS & UAS",
        "Edit nilai yang sudah diinput",
        "Import nilai dari Excel",
        "Export rekap nilai",
      ]}
    />
  );
}
