import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, ChevronDown, User, Settings, BarChart2, List, LogOut, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useDashboard } from '../context/DashboardContext';

const SUGGESTIONS = [
  { label: 'Bandra West, Mumbai', type: 'location' },
  { label: 'Powai, Mumbai', type: 'location' },
  { label: 'Koramangala, Bangalore', type: 'location' },
  { label: 'Connaught Place, Delhi', type: 'location' },
  { label: 'Salt Lake, Kolkata', type: 'location' },
  { label: 'Verified apartments', type: 'popular' },
  { label: '2BHK under ₹30,000', type: 'popular' },
  { label: 'Fully furnished flats', type: 'popular' },
];

const NOTIFICATIONS_DATA = [
  { id: 1, icon: '🏠', text: '3 new verified homes added near you', time: '2m ago', unread: true },
  { id: 2, icon: '⚠️', text: 'AI flagged a suspicious listing you viewed', time: '15m ago', unread: true },
  { id: 3, icon: '💬', text: 'Owner "Raj Mehta" accepted your enquiry', time: '1h ago', unread: false },
  { id: 4, icon: '🔔', text: 'Your profile was viewed 12 times today', time: '3h ago', unread: false },
];

const Header = ({ title }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser()?.user;
  const {
    setSettingsOpen,
    profileDropdownOpen, setProfileDropdownOpen,
    notificationsOpen, setNotificationsOpen,
    demoMode, setDemoMode,
    demoNotifications,
    closeAll,
  } = useDashboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notifList, setNotifList] = useState(NOTIFICATIONS_DATA);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifList.filter(n => n.unread).length + demoNotifications.length;

  const filteredSuggestions = searchQuery.length > 0
    ? SUGGESTIONS.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : SUGGESTIONS;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { authService.logout(); navigate('/login'); };

  const markAllRead = () => {
    setNotifList(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-20 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Demo Mode Toggle */}
        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
            demoMode
              ? 'bg-yellow-400 text-yellow-900 border-yellow-300 shadow-md shadow-yellow-200 animate-pulse'
              : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-700'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          {demoMode ? 'Demo ON' : 'Demo Mode'}
        </button>

        {/* Search Bar */}
        <div className="hidden lg:block relative" ref={searchRef}>
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search locations, properties..."
            className="pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 transition-all outline-none w-64"
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
          />
          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {searchQuery === '' && (
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Popular Areas</p>
                </div>
              )}
              {filteredSuggestions.slice(0, 6).map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setSearchQuery(s.label); setShowSuggestions(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left group"
                >
                  <span className="text-base">{s.type === 'location' ? '📍' : '🔥'}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-emerald-700">{s.label}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{s.type}</p>
                  </div>
                </button>
              ))}
              {filteredSuggestions.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-4">No results found</p>
              )}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileDropdownOpen(false); }}
            className="relative p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <Bell className={`w-5 h-5 ${demoMode ? 'text-yellow-500 animate-bounce' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                <button onClick={markAllRead} className="text-[10px] text-emerald-600 font-bold hover:text-emerald-800">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {/* Demo notifications first */}
                {demoNotifications.map(n => (
                  <div key={`demo-${n.id}`} className="flex items-start gap-3 px-4 py-3 bg-yellow-50 border-b border-yellow-100 animate-in fade-in duration-300">
                    <span className="text-lg">🎯</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-yellow-900">{n.text}</p>
                      <p className="text-[10px] text-yellow-600 mt-0.5">{n.time} · Demo Mode</p>
                    </div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1 shrink-0" />
                  </div>
                ))}
                {notifList.map(n => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${n.unread ? 'bg-blue-50/30' : ''}`}>
                    <span className="text-lg">{n.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100">
                <button className="w-full text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative flex items-center gap-3 pl-4 border-l border-gray-100" ref={profileRef}>
          <button
            onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); setNotificationsOpen(false); }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{user?.name || 'User'}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role || 'Member'}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-emerald-300 transition-all">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                alt="Avatar"
              />
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-all ${profileDropdownOpen ? 'rotate-180 text-emerald-500' : 'group-hover:text-emerald-500'}`} />
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Avatar Header */}
              <div className="px-4 py-4 border-b border-gray-50 flex items-center gap-3 bg-gradient-to-br from-emerald-50 to-white">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-200">
                  <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10b981&color=fff`} alt="" className="w-full h-full" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">{user?.role}</p>
                </div>
              </div>
              {[
                { icon: <User className="w-4 h-4" />, label: 'View Profile', action: () => { navigate('/profile'); setProfileDropdownOpen(false); } },
                { icon: <Settings className="w-4 h-4" />, label: 'Settings', action: () => { setSettingsOpen(true); setProfileDropdownOpen(false); } },
                { icon: <List className="w-4 h-4" />, label: user?.role === 'owner' ? 'My Listings' : 'Saved Homes', action: () => { navigate(user?.role === 'owner' ? '/my-listings' : '/tenant-dashboard'); setProfileDropdownOpen(false); } },
                { icon: <BarChart2 className="w-4 h-4" />, label: 'Fraud Reports', action: () => { navigate('/fraud-reports'); setProfileDropdownOpen(false); } },
              ].map((item, i) => (
                <button key={i} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group">
                  <span className="text-gray-400 group-hover:text-emerald-600 transition-colors">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
                </button>
              ))}
              <div className="border-t border-gray-100 mt-1">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left group">
                  <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
