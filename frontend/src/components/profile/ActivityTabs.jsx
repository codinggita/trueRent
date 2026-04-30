import React, { useState } from 'react';
import { Tabs } from '../ui/Tabs';
import { Card } from '../ui/Card';
import { Home, AlertCircle, Bookmark } from 'lucide-react';

export function ActivityTabs({ listings, reports, saved }) {
  const [activeTab, setActiveTab] = useState('listings');

  const tabs = [
    { id: 'listings', label: 'My Listings' },
    { id: 'reports', label: 'Fraud Reports' },
    { id: 'saved', label: 'Saved Properties' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'listings':
        return (
          <div className="space-y-4 animate-in fade-in">
            {listings && listings.length > 0 ? (
              listings.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.status}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">${item.price}/mo</span>
                </div>
              ))
            ) : (
              <EmptyState icon={<Home className="w-8 h-8 text-gray-400" />} text="You haven't posted any listings yet." />
            )}
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-4 animate-in fade-in">
            {reports && reports.length > 0 ? (
              reports.map(item => (
                <div key={item.id} className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.propertyTitle}</h4>
                      <p className="text-sm text-gray-600 mt-1">Reported on {item.date}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState icon={<AlertCircle className="w-8 h-8 text-gray-400" />} text="You haven't submitted any reports." />
            )}
          </div>
        );
      case 'saved':
        return (
          <div className="space-y-4 animate-in fade-in">
            {saved && saved.length > 0 ? (
              saved.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">View</button>
                </div>
              ))
            ) : (
              <EmptyState icon={<Bookmark className="w-8 h-8 text-gray-400" />} text="You haven't saved any properties." />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Your Activity</h3>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-6 min-h-[300px]">
        {renderContent()}
      </div>
    </Card>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="text-center py-12 flex flex-col items-center justify-center">
      <div className="bg-gray-50 p-4 rounded-full mb-3">
        {icon}
      </div>
      <p className="text-gray-500">{text}</p>
    </div>
  );
}
