import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Shield, Layout, Home, AlertCircle, User, LogOut, Settings, ChevronRight
} from 'lucide-react';
import authService from '../services/authService';
import { useDashboard } from '../context/DashboardContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser()?.user;
  const { setSettingsOpen, setProfileModalOpen, verifiedOnly, setVerifiedOnly } = useDashboard();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: user?.role === 'tenant' ? '/tenant-dashboard' : '/dashboard',
      icon: <Layout className="w-5 h-5" />
    },
    {
      label: user?.role === 'tenant' ? 'Verified Homes' : 'My Listings',
      path: user?.role === 'tenant' ? '/tenant-dashboard' : '/my-listings',
      icon: <Home className="w-5 h-5" />,
      isVerified: user?.role === 'tenant',
    },
    {
      label: 'Fraud Reports',
      path: '/fraud-reports',
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: <User className="w-5 h-5" />
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col fixed h-full z-30 transition-all duration-300 shadow-sm shadow-gray-200/50">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-50/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900">True<span className="text-emerald-600">Rent</span></span>
      </div>

      {/* Verified Homes Banner (Tenant Only) */}
      {user?.role === 'tenant' && (
        <div className="mx-4 mt-4">
          {verifiedOnly ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Filter Active</p>
                <p className="text-xs text-emerald-800 font-semibold">Verified Homes ✅</p>
              </div>
              <button
                onClick={() => setVerifiedOnly(false)}
                className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold underline"
              >
                All
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setVerifiedOnly(true); navigate('/tenant-dashboard'); }}
              className="w-full flex items-center justify-between bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl px-4 py-2.5 text-xs font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all group shadow-md shadow-emerald-200"
            >
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Verified Homes</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            onClick={item.isVerified ? () => setVerifiedOnly(false) : undefined}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Secondary Actions */}
      <div className="p-4 space-y-2 border-t border-gray-50/50">
        {/* Settings opens slide-in drawer */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>

      {/* User Info — click opens mini profile modal */}
      <button
        onClick={() => setProfileModalOpen(true)}
        className="p-6 border-t border-gray-50 bg-gray-50/30 hover:bg-emerald-50/30 transition-colors group text-left w-full"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-emerald-300 transition-colors">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10b981&color=fff`}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">{user?.name || 'John Doe'}</p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">{user?.role || 'User'}</p>
          </div>
          <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
        </div>
      </button>
    </aside>
  );
};

export default Sidebar;
