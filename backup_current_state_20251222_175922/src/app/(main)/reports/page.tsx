import PlaceholderPage from "@/components/PlaceholderPage";

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Laporan"
      description="Laporan dan analisis data"
      icon="📈"
      features={[
        "Laporan nilai per kelas",
        "Laporan kehadiran",
        "Laporan prestasi siswa",
        "Export laporan ke Excel/PDF",
        "Visualisasi data dengan chart",
      ]}
    />
  );
}
