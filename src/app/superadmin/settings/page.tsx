'use client';

import { useState } from 'react';
import {
  Settings,
  Mail,
  Shield,
  Database,
  Activity,
  Save,
  RefreshCw,
  Download,
  Upload,
  Bell,
  Globe,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

type Tab = 'general' | 'email' | 'security' | 'database' | 'logs';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const tabs = [
    { id: 'general' as Tab, name: 'General', icon: Globe },
    { id: 'email' as Tab, name: 'Email', icon: Mail },
    { id: 'security' as Tab, name: 'Security', icon: Shield },
    { id: 'database' as Tab, name: 'Database', icon: Database },
    { id: 'logs' as Tab, name: 'System Logs', icon: Activity },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSaveStatus('success');
    setIsSaving(false);

    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-600 mt-1">Manage platform configuration and preferences</p>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  General Configuration
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  Basic platform information and branding settings
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Platform Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Teacher Toolbox"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Platform Domain */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Platform Domain
                  </label>
                  <input
                    type="text"
                    defaultValue="teachertoolbox.id"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Admin Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@teachertoolbox.id"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Support Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    defaultValue="support@teachertoolbox.id"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Site Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Site Description
                </label>
                <textarea
                  rows={3}
                  defaultValue="Platform untuk membantu guru mengelola RPP, Kaldik, dan administrasi sekolah"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Maintenance Mode</p>
                  <p className="text-sm text-slate-600">
                    Enable to show maintenance page to users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* EMAIL SETTINGS */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Email Configuration
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  SMTP settings and email template management
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SMTP Host */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    placeholder="smtp.gmail.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* SMTP Port */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    placeholder="587"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* SMTP Username */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    placeholder="your-email@gmail.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* SMTP Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email Templates */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Email Templates</h3>
                <div className="space-y-3">
                  {[
                    'Welcome Email',
                    'Password Reset',
                    'Invite Code',
                    'User Approved',
                  ].map((template) => (
                    <div
                      key={template}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="font-medium text-slate-900">{template}</span>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        Edit Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Email */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">Send Test Email</p>
                  <p className="text-sm text-blue-700">Verify SMTP configuration</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send Test
                </button>
              </div>
            </div>
          )}

          {/* SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Security Configuration
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  Authentication and access control settings
                </p>
              </div>

              {/* Session Timeout */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="60"
                  className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Users will be logged out after this period of inactivity
                </p>
              </div>

              {/* Password Policy */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Password Policy</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Minimum password length', value: '8 characters' },
                    { label: 'Require uppercase letters', enabled: true },
                    { label: 'Require numbers', enabled: true },
                    { label: 'Require special characters', enabled: false },
                  ].map((policy, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{policy.label}</p>
                        {'value' in policy && (
                          <p className="text-sm text-slate-600">{policy.value}</p>
                        )}
                      </div>
                      {'enabled' in policy && (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={policy.enabled}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-900">Two-Factor Authentication</p>
                      <p className="text-sm text-amber-700">
                        Require 2FA for admin accounts
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* DATABASE MANAGEMENT */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Database Management
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  Backup, restore, and optimize database
                </p>
              </div>

              {/* Database Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 uppercase mb-1">Database Size</p>
                  <p className="text-2xl font-bold text-slate-900">24.5 MB</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 uppercase mb-1">Total Tables</p>
                  <p className="text-2xl font-bold text-slate-900">15</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 uppercase mb-1">Last Backup</p>
                  <p className="text-2xl font-bold text-slate-900">2h ago</p>
                </div>
              </div>

              {/* Backup & Restore */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border rounded-lg">
                  <Database className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Create Backup
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Download a complete backup of your database
                  </p>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Create Backup
                  </button>
                </div>

                <div className="p-6 border rounded-lg">
                  <Upload className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Restore Database
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Upload and restore from a backup file
                  </p>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload Backup
                  </button>
                </div>
              </div>

              {/* Optimize Database */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Optimize Database</p>
                      <p className="text-sm text-green-700">
                        Clean up and optimize tables for better performance
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Optimize Now
                  </button>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-900">Important Warning</p>
                    <p className="text-sm text-red-700 mt-1">
                      Always create a backup before performing database operations. Restore
                      operations will overwrite existing data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">System Logs</h2>
                <p className="text-sm text-slate-600 mb-6">Monitor system activity and errors</p>
              </div>

              {/* Log Filters */}
              <div className="flex gap-3">
                {['All', 'Info', 'Warning', 'Error'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === 'All'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Logs List */}
              <div className="border rounded-lg divide-y">
                {[
                  {
                    type: 'info',
                    message: 'User "Super Administrator" logged in',
                    time: '2 minutes ago',
                  },
                  {
                    type: 'success',
                    message: 'Database backup completed successfully',
                    time: '1 hour ago',
                  },
                  {
                    type: 'warning',
                    message: 'High memory usage detected (85%)',
                    time: '3 hours ago',
                  },
                  {
                    type: 'error',
                    message: 'Failed to send email to user@example.com',
                    time: '5 hours ago',
                  },
                ].map((log, index) => {
                  const typeColors = {
                    info: 'bg-blue-100 text-blue-700',
                    success: 'bg-green-100 text-green-700',
                    warning: 'bg-yellow-100 text-yellow-700',
                    error: 'bg-red-100 text-red-700',
                  };

                  return (
                    <div key={index} className="p-4 hover:bg-slate-50">
                      <div className="flex items-start gap-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            typeColors[log.type as keyof typeof typeColors]
                          }`}
                        >
                          {log.type.toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900">{log.message}</p>
                          <p className="text-xs text-slate-500 mt-1">{log.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Export Logs */}
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                Export Logs (Last 30 Days)
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="border-t p-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Settings saved successfully!</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
