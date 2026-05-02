import React from 'react';
import { X, User, Home, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useDashboard } from '../context/DashboardContext';

const ProfileModal = () => {
  const navigate = useNavigate();
  const { profileModalOpen, setProfileModalOpen } = useDashboard();
  const user = authService.getCurrentUser()?.user;

  if (!profileModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white">
          <button
            onClick={() => setProfileModalOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=fff&color=10b981&size=128`}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">{user?.name || 'Guest User'}</h3>
              <div className="inline-flex items-center gap-1.5 mt-1 bg-white/20 rounded-full px-3 py-1">
                <User className="w-3 h-3" />
                <span className="text-xs font-bold uppercase tracking-wider">{user?.role || 'User'}</span>
              </div>
            </div>
          </div>
          <p className="text-emerald-100 text-xs mt-3 opacity-80">{user?.email || 'user@truerent.com'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px bg-gray-100">
          <div className="bg-white p-5 flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900">12</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saved Homes</span>
          </div>
          <div className="bg-white p-5 flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900">38</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Viewed</span>
          </div>
        </div>

        {/* CTA */}
        <div className="p-6">
          <button
            onClick={() => { navigate('/profile'); setProfileModalOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 group"
          >
            Go to Profile
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={() => setProfileModalOpen(false)} />
    </div>
  );
};

export default ProfileModal;
