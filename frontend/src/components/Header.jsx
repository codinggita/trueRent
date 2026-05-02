import React from 'react';
import { Bell, Search, Menu, User, ChevronDown } from 'lucide-react';
import authService from '../services/authService';

const Header = ({ title }) => {
  const user = authService.getCurrentUser()?.user;

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 transition-all outline-none w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer group">
          <div className="flex flex-col items-end hidden sm:flex">
             <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{user?.name || 'User'}</span>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role || 'Member'}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-emerald-200 transition-all">
             <img 
               src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
               alt="Avatar" 
             />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Header;
