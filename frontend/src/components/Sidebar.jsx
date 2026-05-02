import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Layout, 
  Home, 
  AlertCircle, 
  User, 
  LogOut, 
  Settings,
  Bell
} from 'lucide-react';
import authService from '../services/authService';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser()?.user;

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
      icon: <Home className="w-5 h-5" /> 
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

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </NavLink>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>

      {/* User Info Quick View */}
      <div className="p-6 border-t border-gray-50 bg-gray-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
             <img 
               src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10b981&color=fff`} 
               alt={user?.name} 
               className="w-full h-full object-cover"
             />
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'John Doe'}</p>
             <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
