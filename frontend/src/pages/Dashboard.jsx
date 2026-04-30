import React from 'react';
import { Shield, Home, AlertCircle, Plus, Layout, User, LogOut, MapPin, DollarSign, Trash2, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProperties, deleteProperty, getOverview } from '../services/api';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import { RiskBadge } from '../components/fraud/RiskBadge';
import { useSocket } from '../hooks/useSocket';

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
    queryKey: ['properties'],
    queryFn: getProperties
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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return null;

  const properties = propertiesData?.data || [];
  const stats = overviewData?.data || { totalReports: 0, highRiskCount: 0, totalProperties: 0 };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-2 border-b border-gray-100">
          <Shield className="w-6 h-6 text-green-700" />
          <span className="font-bold text-xl text-gray-900">True<span className="text-green-700">Rent</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg font-medium transition-all">
            <Layout className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/my-listings" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
            My Listings
          </Link>
          <Link to="/fraud-reports" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <AlertCircle className="w-5 h-5" />
            Fraud Reports
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <User className="w-5 h-5" />
            Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-gray-800">Welcome back, {user.name}</h1>
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              {user.role}
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>
              <p className="text-gray-500">Intelligent monitoring of property listings and fraud risk.</p>
            </div>
            <Link 
              to="/add-property"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <Plus className="w-5 h-5" />
              New Listing
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Properties</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalProperties}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Fraud Score</p>
              <h3 className="text-3xl font-bold text-gray-900">12.4</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">High Risk Detected</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.highRiskCount}</h3>
            </div>
            <div className="bg-emerald-600 p-6 rounded-2xl border border-emerald-500 shadow-lg text-white hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">Security Status</p>
              <h3 className="text-xl font-bold text-white">Active Protection</h3>
            </div>
          </div>

          {/* Recent Listings Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-emerald-600" /> Recent Market Activity
            </h3>
            
            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-200/50 animate-pulse rounded-2xl"></div>)}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {properties.map((property) => (
                  <div key={property._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all group border-l-4 border-l-transparent hover:border-l-emerald-500">
                    <div className="w-full md:w-72 h-52 md:h-auto bg-gray-100 relative shrink-0">
                      {property.image || property.images?.[0] ? (
                        <img src={property.image || property.images?.[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                           <Home className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                         <RiskBadge score={property.fraudScore || 0} />
                      </div>
                    </div>
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                             <h4 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{property.title}</h4>
                             <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-emerald-600" /> {property.location}
                             </p>
                          </div>
                          {user.id === property.owner?._id && (
                            <button 
                              onClick={() => deleteMutation.mutate(property._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6">
                           <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-sm font-bold">
                              ₹{property.price?.toLocaleString()}/mo
                           </div>
                           <div className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-100 text-sm">
                              {property.propertyType}
                           </div>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
                          {property.description}
                        </p>

                        {property.isFlagged && property.riskReasons?.length > 0 && (
                          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                             <p className="text-xs font-bold text-red-800 flex items-center gap-1.5 mb-1">
                                <AlertCircle className="w-3.5 h-3.5" /> AI Analysis Flag:
                             </p>
                             <p className="text-xs text-red-700 italic">"{property.riskReasons[0]}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-3xl p-20 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Home className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Market is currently empty</h3>
                <p className="text-gray-500 max-w-sm">
                  Start adding property listings to see the AI fraud detection system in action.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
