'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import DeleteModal from './components/DeleteModal';

interface User {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  tenantId: string;
  phone?: string;
  nip?: string;
  nisn?: string;
  lastLogin?: any;
  createdAt: any;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/superadmin/users?search=${search}`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setShowUserModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    fetchUsers();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            User Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage all platform users
          </p>
        </div>

        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or NIP..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <UserTable
        users={users}
        loading={loading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {/* Modals */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          onClose={handleModalClose}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteModal
          user={selectedUser}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
