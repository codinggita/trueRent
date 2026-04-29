import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Shield, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="glass-card p-6 md:col-span-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                  <p className="text-gray-400 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors border border-dark-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-dark-700 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Account Status</p>
                <p className="flex items-center gap-2 text-primary font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Active
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Joined</p>
                <p className="text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="glass-card p-6 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-primary w-6 h-6" />
              <h3 className="text-lg font-semibold text-white">Security</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Auth Method</span>
                <span className="bg-dark-700 px-2 py-1 rounded text-xs text-white">
                  {user?.googleId ? 'Google OAuth' : 'Password'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">2FA Status</span>
                <span className="text-gray-500 text-sm">Disabled</span>
              </li>
            </ul>
            <button className="w-full mt-6 btn-secondary py-2 text-sm">
              Manage Security
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick fix for missing Mail icon in imports
import { Mail } from 'lucide-react';

export default Dashboard;
