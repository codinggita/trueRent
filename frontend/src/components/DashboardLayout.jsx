import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SettingsDrawer from './SettingsDrawer';
import ProfileModal from './ProfileModal';
import QuickViewModal from './QuickViewModal';
const DashboardLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <Header title={title} />
        <main className="flex-1 p-6 lg:p-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>

      {/* Global Overlays */}
      <SettingsDrawer />
      <ProfileModal />
      <QuickViewModal />
    </div>
  );
};

export default DashboardLayout;
