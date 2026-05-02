import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <Header title={title} />
        <main className="flex-1 p-6 lg:p-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
