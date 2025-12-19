import PlaceholderPage from "@/components/PlaceholderPage";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Pengaturan"
      description="Konfigurasi sistem dan profil"
      icon="⚙️"
      features={[
        "Edit profil pengguna",
        "Ubah password",
        "Notifikasi preferences",
        "Tema (Light/Dark mode)",
        "Bahasa",
      ]}
    />
  );
}
