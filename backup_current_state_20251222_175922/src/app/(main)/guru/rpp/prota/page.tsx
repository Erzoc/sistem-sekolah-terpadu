import ProtaGeneratorForm from '@/components/guru/prota/prota-generator-form';

export const metadata = {
  title: 'Prota Generator - Guru Pintar',
  description: 'Generate Program Tahunan dari Kaldik',
};

export default function ProtaGeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProtaGeneratorForm />
    </div>
  );
}
