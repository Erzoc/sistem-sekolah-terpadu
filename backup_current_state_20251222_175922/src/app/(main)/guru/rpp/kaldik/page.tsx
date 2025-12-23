import KaldikManualForm from '@/components/guru/kaldik/kaldik-form';

export const metadata = {
  title: 'Kaldik Manual - Guru Pintar',
  description: 'Input kalender akademik manual untuk membuat Prota',
};

export default function KaldikManualPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <KaldikManualForm />
    </div>
  );
}
