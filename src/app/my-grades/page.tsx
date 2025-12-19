import PlaceholderPage from "@/components/PlaceholderPage";

export default function MyGradesPage() {
  return (
    <PlaceholderPage
      title="Nilai Saya"
      description="Lihat nilai dan rapor"
      icon="📊"
      features={[
        "Lihat nilai per mata pelajaran",
        "Lihat rata-rata nilai",
        "Download rapor",
        "Grafik perkembangan nilai",
        "Perbandingan dengan rata-rata kelas",
      ]}
    />
  );
}
