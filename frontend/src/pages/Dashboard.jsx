import React from 'react';
import { Shield, Home, AlertCircle, Plus, Layout, User, LogOut, MapPin, DollarSign, Trash2, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProperties, getMyListings, deleteProperty, getOverview } from '../services/api';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import { RiskBadge } from '../components/fraud/RiskBadge';
import { useSocket } from '../hooks/useSocket';
import { Eye, FileText, CheckCircle2 } from 'lucide-react';

import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = authService.getCurrentUser()?.user;

  React.useEffect(() => {
    if (user?.role === 'tenant') {
      navigate('/tenant-dashboard');
    }
  }, [user, navigate]);

  // Initialize Real-time alerts
  useSocket();

  // Queries
  const { data: propertiesData, isLoading: loading } = useQuery({
    queryKey: ['my-properties'],
    queryFn: getMyListings
  });

  const { data: overviewData } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: getOverview
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Listing removed.');
    },
    onError: () => toast.error('Failed to delete listing.')
  });

  if (!user) return null;

  const properties = propertiesData?.data || [];
  
  // Owner specific stats calculations
  const totalListings = properties.length;
  const activeListings = properties.filter(p => !p.isFlagged).length;
  const flaggedListings = properties.filter(p => (p.fraudScore || 0) >= 70).length;
  const verifiedListings = properties.filter(p => (p.fraudScore || 0) < 30).length;
  const totalViews = properties.reduce((acc, p) => acc + (p.views || Math.floor(Math.random() * 100)), 0);

  return (
    <DashboardLayout title="Platform Overview">
      <div className="space-y-10">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Listings', value: totalListings, icon: <Home className="w-6 h-6" />, color: 'blue' },
            { label: 'Active', value: activeListings, icon: <CheckCircle2 className="w-6 h-6" />, color: 'emerald' },
            { label: 'AI Flagged', value: flaggedListings, icon: <AlertTriangle className="w-6 h-6" />, color: 'red' },
            { label: 'Total Views', value: totalViews, icon: <Eye className="w-6 h-6" />, color: 'purple' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className={`w-14 h-14 bg-${stat.color}-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(stat.icon, { className: `w-7 h-7 text-${stat.color}-600` })}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-gray-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/add-property" className="relative overflow-hidden flex items-center gap-6 p-8 bg-gray-900 rounded-[32px] text-white hover:bg-emerald-600 transition-all duration-500 shadow-2xl group">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-xl mb-1">Add New Property</h4>
              <p className="text-white/60 text-sm">List a new apartment or villa for AI scanning.</p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
          </Link>

          <Link to="/fraud-reports" className="flex items-center gap-6 p-8 bg-white border border-gray-100 rounded-[32px] hover:border-emerald-300 transition-all duration-500 shadow-sm hover:shadow-xl group">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-gray-900 mb-1">Fraud Reports</h4>
              <p className="text-gray-500 text-sm">Check flagged activity and safety trends.</p>
            </div>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
               <TrendingUp className="w-6 h-6 text-emerald-600" /> Recent Listings
            </h3>
            <Link to="/my-listings" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors">View All →</Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[32px]"></div>)}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 3).map((property) => (
                <div key={property._id} className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group">
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={property.image || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                       <RiskBadge score={property.fraudScore || 0} />
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-1 truncate">{property.title}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
                       <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {property.location}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="text-emerald-600 font-black text-xl">₹{property.price?.toLocaleString()}</div>
                      <Link to={`/property/${property._id}`} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-[40px] p-20 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Home className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No active listings</h3>
              <p className="text-gray-500 max-w-sm mb-8">
                Start adding property listings to see the AI fraud detection system in action.
              </p>
              <Link to="/add-property" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all">
                Create First Listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
