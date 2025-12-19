import PlaceholderPage from "@/components/PlaceholderPage";

export default function SchedulePage() {
  return (
    <PlaceholderPage
      title="Jadwal"
      description="Jadwal pelajaran & kegiatan"
      icon="📅"
      features={[
        "Lihat jadwal harian",
        "Lihat jadwal mingguan",
        "Filter per kelas/guru",
        "Export jadwal ke PDF",
        "Notifikasi jadwal mendatang",
      ]}
    />
  );
}
