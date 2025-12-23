import RppLibrary from '@/components/guru/rpp/rpp-library';

export const metadata = {
  title: 'Library RPP - Guru Pintar',
  description: 'Koleksi RPP yang sudah dibuat',
};

export default function RppLibraryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RppLibrary />
    </div>
  );
}
