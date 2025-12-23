import RppGeneratorForm from '@/components/guru/rpp/rpp-generator-form';

export const metadata = {
  title: 'RPP Generator - Guru Pintar',
  description: 'Generate Rencana Pelaksanaan Pembelajaran',
};

export default function RppGeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RppGeneratorForm />
    </div>
  );
}
