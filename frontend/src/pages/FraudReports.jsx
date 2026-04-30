import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, AlertTriangle, CheckCircle, Clock, TrendingUp, BarChart2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReports, getOverview, getTrends, updateReport, deleteReport } from '../services/api';
import { demoReports, demoOverview, demoTrends } from '../data/demoReports';
import { FraudTable } from '../components/fraud/FraudTable';
import { ReportModal } from '../components/fraud/ReportModal';
import { StatsCard } from '../components/profile/StatsCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useSocket } from '../hooks/useSocket';
import { toast } from 'react-hot-toast';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';

export default function FraudReports() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize Real-time alerts
  useSocket();

  // Queries
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: getReports
  });

  const { data: overviewData } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: getOverview
  });

  const { data: trendsData } = useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: getTrends
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateReport(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Report status updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report removed');
    }
  });

  // Handlers
  const handleView = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleAction = (action, id) => {
    const status = action === 'safe' ? 'Dismissed' : 'Resolved';
    updateMutation.mutate({ id, status });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this report?')) {
      deleteMutation.mutate(id);
    }
  };

  // Data Merging & Calculations
  const liveReports = reportsData?.data || [];
  const reports = liveReports.length > 0 ? liveReports : demoReports;
  
  const liveOverview = overviewData?.data;
  const stats = liveOverview ? liveOverview : demoOverview;
  
  const liveTrends = trendsData?.data || [];
  const trends = liveTrends.length > 0 ? liveTrends : demoTrends;

  // Dynamic Risk Distribution Calculation
  const highRiskCount = reports.filter(r => (r.property?.fraudScore || 0) >= 70).length;
  const mediumRiskCount = reports.filter(r => (r.property?.fraudScore || 0) >= 40 && (r.property?.fraudScore || 0) < 70).length;
  const lowRiskCount = reports.filter(r => (r.property?.fraudScore || 0) < 40).length;
  const totalItems = reports.length || 1;

  // Filtering Logic
  const filteredReports = reports.filter(report => {
    const propertyTitle = report.property?.title || '';
    const ownerName = report.property?.owner?.name || '';
    
    const matchesSearch = propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    const riskScore = report.property?.fraudScore || 0;
    if (filter === 'High') return riskScore >= 70;
    if (filter === 'Medium') return riskScore >= 40 && riskScore < 70;
    if (filter === 'Low') return riskScore < 40;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fraud Analytics & Reports</h1>
            <p className="text-gray-500 mt-1">Real-time monitoring and AI-assisted fraud resolution.</p>
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
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <Card className="lg:col-span-2 min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Report Trends
              </h3>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Last 7 Days</span>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#9ca3af'}}
                    dy={10}
                    tickFormatter={(str) => str.split('-').slice(1).join('/')}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#9ca3af'}}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reports" 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Distribution Chart */}
          <Card className="min-h-[300px] flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <BarChart2 className="w-5 h-5 text-purple-600" /> Risk Distribution
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="space-y-4 w-full">
                {[
                  { level: 'High', count: highRiskCount, color: 'bg-red-500' },
                  { level: 'Medium', count: mediumRiskCount, color: 'bg-yellow-500' },
                  { level: 'Low', count: lowRiskCount, color: 'bg-emerald-500' }
                ].map((item) => {
                   const percentage = (item.count / totalItems) * 100;
                   
                   return (
                     <div key={item.level} className="space-y-1">
                       <div className="flex justify-between text-xs font-medium text-gray-600">
                         <span>{item.level} Risk</span>
                         <span>{item.count} Reports</span>
                       </div>
                       <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                         <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                       </div>
                     </div>
                   );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Reports" value={stats.totalReports} icon={<ShieldAlert className="w-6 h-6 text-blue-600" />} />
          <StatsCard title="High Risk" value={stats.highRiskCount} icon={<AlertTriangle className="w-6 h-6 text-red-600" />} colorClass="text-red-600" />
          <StatsCard title="Pending Review" value={stats.totalReports - stats.resolvedCount} icon={<Clock className="w-6 h-6 text-yellow-600" />} colorClass="text-yellow-600" />
          <StatsCard title="Resolved" value={stats.resolvedCount} icon={<CheckCircle className="w-6 h-6 text-green-600" />} colorClass="text-green-600" />
        </div>

        {/* Main Table Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {reportsLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200/50 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : (
            <FraudTable 
              reports={filteredReports.map(r => ({
                id: r._id,
                title: r.property?.title || 'Unknown Listing',
                owner: r.property?.owner?.name || 'Anonymous',
                riskScore: r.property?.fraudScore || 0,
                status: r.status,
                date: new Date(r.createdAt).toLocaleDateString(),
                description: r.property?.description,
                reporterMessage: r.description,
                images: r.property?.images || []
              }))} 
              onView={handleView}
              onMarkSafe={(id) => handleAction('safe', id)}
              onFlagFraud={(id) => handleAction('fraud', id)}
              onDelete={handleDelete}
            />
          )}
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
