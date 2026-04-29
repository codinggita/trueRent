import React, { useEffect, useState } from 'react';
import { Shield, Home, AlertCircle, Plus, Layout, User, LogOut, MapPin, DollarSign, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import propertyService from '../services/propertyService';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser.user);
      fetchProperties(currentUser.token);
    }
  }, [navigate]);

  const fetchProperties = async (token) => {
    try {
      const data = await propertyService.getProperties();
      if (data.success) {
        // Filter properties for the current user if they are an owner
        // For now, let's show all or just owner's depending on role
        // As per PRD, "View properties" is general
        setProperties(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch properties', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const currentUser = authService.getCurrentUser();
        await propertyService.deleteProperty(id, currentUser.token);
        setProperties(properties.filter(p => p._id !== id));
        toast.success('Listing removed.');
      } catch (err) {
        toast.error('Failed to delete listing.');
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-gray-100">
          <Shield className="w-6 h-6 text-green-700" />
          <span className="font-bold text-xl text-gray-900">True<span className="text-green-700">Rent</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg font-medium">
            <Layout className="w-5 h-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
            My Listings
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <AlertCircle className="w-5 h-5" />
            Fraud Reports
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <User className="w-5 h-5" />
            Profile
          </a>
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
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-gray-800">Welcome back, {user.name}</h1>
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              {user.role}
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-500">Manage your rental listings and security status</p>
            </div>
            <Link 
              to="/add-property"
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Listing
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Listings</p>
              <h3 className="text-3xl font-bold text-gray-900">{properties.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Active Queries</p>
              <h3 className="text-3xl font-bold text-gray-900">0</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-green-600">
              <p className="text-sm font-medium text-gray-500 mb-1">Security Status</p>
              <h3 className="text-xl font-bold text-green-700">All Systems Green</h3>
            </div>
          </div>

          {/* Property List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-green-700/30 border-t-green-700 rounded-full animate-spin"></div>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {properties.map((property) => (
                <div key={property._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                  <div className="w-full md:w-48 bg-gray-100 flex items-center justify-center border-r border-gray-100">
                    <Home className="w-12 h-12 text-gray-300" />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-gray-900">{property.title}</h4>
                      <div className="flex gap-2">
                        {property.isFlagged && (
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Suspicious Listing
                          </span>
                        )}
                        <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">
                          Active
                        </span>
                        {user.id === property.owner._id && (
                          <button 
                            onClick={() => handleDelete(property._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {property.price.toLocaleString()}/mo
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {property.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No listings found</h3>
              <p className="text-gray-500 max-w-sm">
                You haven't added any property listings yet. Start by adding your first listing to the TrueRent network.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
