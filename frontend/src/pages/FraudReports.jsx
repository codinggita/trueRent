import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { FraudTable } from '../components/fraud/FraudTable';
import { ReportModal } from '../components/fraud/ReportModal';
import { StatsCard } from '../components/profile/StatsCard';
import { Button } from '../components/ui/Button';

// Mock Data
const initialReports = [
  { id: 1, title: 'Luxury Condo Downtown', owner: 'John Smith', riskScore: 85, status: 'Pending', date: 'Oct 24, 2023', location: 'New York, NY', description: 'Beautiful luxury condo for a very low price. Must pay deposit upfront.', reporterMessage: 'They asked me to wire money before seeing the place.', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'] },
  { id: 2, title: 'Cozy Studio near Campus', owner: 'Sarah Connor', riskScore: 45, status: 'Resolved', date: 'Oct 23, 2023', location: 'Austin, TX', description: 'Great location for students.', reporterMessage: 'The images look like stock photos.', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'] },
  { id: 3, title: 'Spacious 3BR House', owner: 'Mike Johnson', riskScore: 92, status: 'Pending', date: 'Oct 22, 2023', location: 'Chicago, IL', description: 'Just moved out of the country, need to rent ASAP.', reporterMessage: 'Owner claims to be out of the country and cannot show the house.', images: [] },
  { id: 4, title: 'Modern Loft in Arts District', owner: 'Emily Davis', riskScore: 12, status: 'Resolved', date: 'Oct 20, 2023', location: 'Los Angeles, CA', description: 'Verified listing with all amenities.', reporterMessage: 'Just wanted to make sure this is legit.', images: ['https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&w=400&q=80'] },
  { id: 5, title: 'Beachfront Villa', owner: 'Robert Wilson', riskScore: 78, status: 'Pending', date: 'Oct 19, 2023', location: 'Miami, FL', description: 'Amazing views, cheap price.', reporterMessage: 'Found the exact same images on a different website for a house in California.', images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=400&q=80'] },
];

export default function FraudReports() {
  const [reports, setReports] = useState(initialReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats
  const totalReports = reports.length;
  const highRisk = reports.filter(r => r.riskScore >= 71).length;
  const pending = reports.filter(r => r.status === 'Pending').length;
  const resolved = reports.filter(r => r.status === 'Resolved').length;

  // Handlers
  const handleView = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleAction = (action, id) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        if (action === 'safe') return { ...r, status: 'Resolved', riskScore: Math.min(r.riskScore, 30) };
        if (action === 'fraud') return { ...r, status: 'Resolved', riskScore: 99 };
      }
      return r;
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this report?')) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  // Filtering Logic
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          report.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filter === 'High') return report.riskScore >= 71;
    if (filter === 'Medium') return report.riskScore >= 41 && report.riskScore <= 70;
    if (filter === 'Low') return report.riskScore <= 40;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fraud Reports</h1>
            <p className="text-gray-500 mt-1">Monitor and resolve suspicious property listings.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search listings or owners..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                <select 
                  className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow cursor-pointer"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="All">All Risk Levels</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
              </div>
              
              {(searchQuery || filter !== 'All') && (
                <Button variant="ghost" onClick={() => { setSearchQuery(''); setFilter('All'); }} className="px-3">
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Reports" value={totalReports} icon={<ShieldAlert className="w-6 h-6 text-blue-600" />} />
          <StatsCard title="High Risk" value={highRisk} icon={<AlertTriangle className="w-6 h-6 text-red-600" />} colorClass="text-red-600" />
          <StatsCard title="Pending Review" value={pending} icon={<Clock className="w-6 h-6 text-yellow-600" />} colorClass="text-yellow-600" />
          <StatsCard title="Resolved" value={resolved} icon={<CheckCircle className="w-6 h-6 text-green-600" />} colorClass="text-green-600" />
        </div>

        {/* Main Table Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <FraudTable 
            reports={filteredReports} 
            onView={handleView}
            onMarkSafe={(id) => handleAction('safe', id)}
            onFlagFraud={(id) => handleAction('fraud', id)}
            onDelete={handleDelete}
          />
        </div>

      </div>

      {/* Modal Integration */}
      <ReportModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport}
        onAction={handleAction}
      />
    </div>
  );
}
