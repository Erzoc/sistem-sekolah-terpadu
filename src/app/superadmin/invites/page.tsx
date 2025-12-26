import GenerateInviteForm from './components/GenerateInviteForm';
import InviteCodesList from './components/InviteCodesList';

export const metadata = {
  title: 'Kelola Kode Undangan - SuperAdmin',
  description: 'Generate dan kelola kode undangan untuk user baru',
};

export default function InvitesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kode Undangan</h1>
        <p className="mt-2 text-gray-600">
          Generate kode undangan untuk mengundang guru, siswa, atau admin baru ke sekolah
        </p>
      </div>

      {/* Generate Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Generate Kode Undangan Baru
        </h2>
        <GenerateInviteForm />
      </div>

      {/* Invites List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Daftar Kode Undangan
        </h2>
        <InviteCodesList />
      </div>
    </div>
  );
}
