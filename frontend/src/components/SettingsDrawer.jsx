import React from 'react';
import { X, Moon, Bell, Globe, LogOut, User, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useDashboard } from '../context/DashboardContext';

const SettingsDrawer = () => {
  const navigate = useNavigate();
  const { settingsOpen, setSettingsOpen, darkMode, setDarkMode, notifications, setNotifications, language, setLanguage } = useDashboard();

  const handleLogout = () => { authService.logout(); navigate('/login'); };

  return (
    <>
      {/* Blur overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300 ${settingsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSettingsOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${settingsOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="font-bold text-gray-900 text-lg">Settings</h2>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Profile Settings */}
          <section>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Account</p>
            <button
              onClick={() => { navigate('/profile'); setSettingsOpen(false); }}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-emerald-50 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Profile Settings</p>
                  <p className="text-[10px] text-gray-400">Edit name, email, phone</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </button>
          </section>

          {/* Preferences */}
          <section>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Preferences</p>
            <div className="space-y-3">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Moon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Dark Mode 🌙</p>
                    <p className="text-[10px] text-gray-400">Coming soon</p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${darkMode ? 'bg-indigo-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${darkMode ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Bell className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Notifications</p>
                    <p className="text-[10px] text-gray-400">Push & email alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${notifications ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${notifications ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Language</p>
                    <p className="text-[10px] text-gray-400">Select your language</p>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-400 transition-colors"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Gujarati</option>
                  <option>Marathi</option>
                </select>
              </div>
            </div>
          </section>

          {/* Security */}
          <section>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Security</p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-bold text-emerald-800">Account Protected</p>
              </div>
              <p className="text-[10px] text-emerald-600 leading-relaxed">
                Your account is secured with JWT authentication and encrypted password storage.
              </p>
            </div>
          </section>
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;
