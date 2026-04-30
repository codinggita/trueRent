import React, { useEffect, useState } from 'react';
import { Shield, Home, AlertCircle, Plus, Layout, User, LogOut, MapPin, DollarSign, Trash2, Edit, Search, Filter, Eye, MoreVertical } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import propertyService from '../services/propertyService';
import { toast } from 'react-hot-toast';

const MyListings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser.user);
      fetchMyListings(currentUser.token);
    }
  }, [navigate]);

  const fetchMyListings = async (token) => {
    try {
      const data = await propertyService.getMyListings(token);
      if (data.success) {
        setProperties(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch properties', err);
      toast.error('Failed to load listings');
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

  const handleStatusToggle = async (property) => {
    try {
      const currentUser = authService.getCurrentUser();
      const updatedData = { ...property, isAvailable: !property.isAvailable };
      const res = await propertyService.updateProperty(property._id, updatedData, currentUser.token);
      if (res.success) {
        setProperties(properties.map(p => p._id === property._id ? { ...p, isAvailable: !p.isAvailable } : p));
        toast.success(p.isAvailable ? 'Marked as Rented' : 'Marked as Active');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Filter properties
  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || p.propertyType === filterType;
    let matchesStatus = true;
    if (filterStatus === 'Active') matchesStatus = p.isAvailable && !p.isFlagged;
    if (filterStatus === 'Rented') matchesStatus = !p.isAvailable;
    if (filterStatus === 'Flagged') matchesStatus = p.isFlagged;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-2 border-b border-gray-100">
          <Shield className="w-6 h-6 text-green-700" />
          <span className="font-bold text-xl text-gray-900">True<span className="text-green-700">Rent</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Layout className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/my-listings" className="flex items-center gap-3 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg font-medium">
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-gray-800">My Listings</h1>
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
        <div className="flex-1 overflow-auto p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Manage Properties</h2>
              <p className="text-gray-500">View and edit your published listings</p>
            </div>
            <Link 
              to="/add-property"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shrink-0 shadow-sm hover:shadow-md font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Listing
            </Link>
          </div>

          {/* Modern Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between transition-all duration-200">
            <div className="relative w-full lg:w-1/3">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search listings by title or location..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium whitespace-nowrap px-2">
                <Filter className="w-4 h-4 text-emerald-600" /> <span className="hidden sm:inline">Filters</span>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-40">
                  <select 
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 pr-10 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer hover:bg-gray-50"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                
                <div className="relative w-full sm:w-40">
                  <select 
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 pr-10 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer hover:bg-gray-50"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Rented">Rented</option>
                    <option value="Flagged">Flagged</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {(searchTerm || filterType !== 'All' || filterStatus !== 'All') && (
                <button 
                  onClick={() => { setSearchTerm(''); setFilterType('All'); setFilterStatus('All'); }}
                  className="text-xs font-medium text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors w-full sm:w-auto"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Property List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-green-700/30 border-t-green-700 rounded-full animate-spin"></div>
            </div>
          ) : properties.length > 0 ? (
            filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {filteredProperties.map((property) => (
                  <div key={property._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                    {/* Image Header */}
                    <div className="relative h-56 bg-gray-100 overflow-hidden">
                      {property.image || (property.images && property.images.length > 0) ? (
                        <img 
                          src={property.image || property.images[0]} 
                          alt={property.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      
                      {/* Status Badges */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                        {!property.isAvailable ? (
                          <span className="bg-gray-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            Rented
                          </span>
                        ) : property.isFlagged ? (
                          <span className="bg-red-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3" /> Suspicious
                          </span>
                        ) : (
                          <span className="bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            Active
                          </span>
                        )}
                        
                        {!property.isFlagged && (
                          <span className="bg-blue-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                            <Shield className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors" title={property.title}>{property.title}</h4>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                        <MapPin className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      <div className="flex items-center gap-4 mb-5">
                        <div className="bg-emerald-50/50 px-4 py-2 rounded-xl border border-emerald-100 flex-1">
                          <span className="text-xs text-emerald-600/80 font-semibold block uppercase tracking-wider mb-0.5">Price</span>
                          <span className="text-lg font-bold text-emerald-700">₹{property.price?.toLocaleString() || 'N/A'}<span className="text-xs text-emerald-600/70 font-medium">/mo</span></span>
                        </div>
                        <div className="bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100 flex-1">
                          <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider mb-0.5">Type</span>
                          <span className="text-sm font-semibold text-gray-700">{property.propertyType || 'Property'}</span>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">Updated recently</span>
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1.5 font-medium"><Eye className="w-4 h-4 text-gray-400" /> 24 Views</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex gap-3">
                      <button 
                        onClick={() => handleStatusToggle(property)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border shadow-sm ${property.isAvailable ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300' : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'}`}
                      >
                        {property.isAvailable ? 'Mark as Rented' : 'Mark as Active'}
                      </button>
                      <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 shadow-sm" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(property._id)}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all duration-200 shadow-sm" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <Search className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
                <p className="text-gray-500 max-w-sm mb-6">
                  We couldn't find any listings matching your search or filter criteria.
                </p>
                <button 
                  onClick={() => { setSearchTerm(''); setFilterType('All'); setFilterStatus('All'); }}
                  className="text-emerald-600 font-medium hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )
          ) : (
            /* Empty State */
            <div className="bg-white border border-gray-100 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <Home className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No listings yet</h3>
              <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                You haven't added any property listings yet. Start by adding your first listing to the TrueRent network to find verified tenants.
              </p>
              <Link 
                to="/add-property"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 font-medium text-lg shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Create First Listing
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyListings;
