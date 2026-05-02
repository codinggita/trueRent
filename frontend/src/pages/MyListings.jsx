import React, { useEffect, useState } from 'react';
import { Shield, Home, AlertCircle, Plus, Layout, User, LogOut, MapPin, DollarSign, Trash2, Edit, Search, Filter, Eye, MoreVertical } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import propertyService from '../services/propertyService';
import { toast } from 'react-hot-toast';

import DashboardLayout from '../components/DashboardLayout';

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
        toast.success(!property.isAvailable ? 'Marked as Active' : 'Marked as Rented');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
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
    <DashboardLayout title="My Listings">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Properties</h2>
            <p className="text-gray-500">View and edit your published listings</p>
          </div>
          <Link 
            to="/add-property"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shrink-0 shadow-sm hover:shadow-md font-bold"
          >
            <Plus className="w-5 h-5" />
            Add New Listing
          </Link>
        </div>

        {/* Modern Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between transition-all duration-200">
          <div className="relative w-full lg:w-1/3">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search listings..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="flex gap-3 w-full sm:w-auto">
              <select 
                className="flex-1 sm:w-40 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
              </select>
              
              <select 
                className="flex-1 sm:w-40 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Rented">Rented</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>

            {(searchTerm || filterType !== 'All' || filterStatus !== 'All') && (
              <button 
                onClick={() => { setSearchTerm(''); setFilterType('All'); setFilterStatus('All'); }}
                className="text-xs font-bold text-gray-400 hover:text-red-600 px-3 py-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Property List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-200/50 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div key={property._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <img 
                    src={property.image || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'} 
                    alt={property.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4">
                    {!property.isAvailable ? (
                      <span className="bg-gray-900/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Rented</span>
                    ) : (
                      <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Active</span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors line-clamp-1">{property.title}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {property.location}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div className="text-emerald-600 font-extrabold text-lg">₹{property.price?.toLocaleString()}<span className="text-[10px] text-gray-400 font-medium">/mo</span></div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusToggle(property)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Toggle Status"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(property._id)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Home className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900">No listings found</h4>
            <p className="text-gray-500 text-sm">Try adding a new property to get started.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyListings;
