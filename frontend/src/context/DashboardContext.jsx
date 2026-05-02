import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [language, setLanguage] = useState('English');
  const [demoMode, setDemoMode] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [demoNotifications, setDemoNotifications] = useState([]);
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);

  // Demo mode: inject animated notifications
  useEffect(() => {
    if (!demoMode) { setDemoNotifications([]); return; }
    const msgs = [
      { id: 1, type: 'verified', text: '3 new verified homes added in Bandra West', time: 'Just now' },
      { id: 2, type: 'alert', text: '1 suspicious listing flagged by AI', time: '2 min ago' },
      { id: 3, type: 'message', text: 'Owner "Raj Mehta" responded to your enquiry', time: '5 min ago' },
    ];
    msgs.forEach((m, i) => {
      setTimeout(() => setDemoNotifications(prev => [...prev, m]), i * 800);
    });
  }, [demoMode]);

  const toggleSaved = (id) => {
    setSavedProperties(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const closeAll = () => {
    setSettingsOpen(false);
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <DashboardContext.Provider value={{
      settingsOpen, setSettingsOpen,
      profileDropdownOpen, setProfileDropdownOpen,
      profileModalOpen, setProfileModalOpen,
      notificationsOpen, setNotificationsOpen,
      darkMode, setDarkMode,
      notifications, setNotifications,
      language, setLanguage,
      demoMode, setDemoMode,
      verifiedOnly, setVerifiedOnly,
      demoNotifications,
      quickViewProperty, setQuickViewProperty,
      savedProperties, toggleSaved,
      closeAll,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};
