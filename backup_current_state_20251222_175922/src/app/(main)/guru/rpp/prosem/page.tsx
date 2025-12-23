import ProsemGeneratorForm from '@/components/guru/prosem/prosem-generator-form';

export const metadata = {
  title: 'Prosem Generator - Guru Pintar',
  description: 'Generate Program Semester dari Prota',
};

export default function ProsemGeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProsemGeneratorForm />
    </div>
  );
}
