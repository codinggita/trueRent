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
        if (data.data.length === 0) {
          const demoProperties = [
            {
              _id: 'demo1',
              title: "Modern 2BHK with Balcony",
              description: "Spacious 2BHK featuring a private balcony and modular kitchen. Located in a quiet residential area.",
              price: 45000,
              location: "Bandra West, Mumbai",
              propertyType: "Apartment",
              bedrooms: 2,
              bathrooms: 2,
              furnishing: "Semi-Furnished",
              area: 950,
              amenities: ["Gym", "Parking", "CCTV", "Garden"],
              images: [
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"
              ],
              image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
              isAvailable: true,
              isFlagged: false,
              owner: { _id: authService.getCurrentUser()?.user?.id },
              createdAt: "2026-04-29T18:10:00.000Z",
              updatedAt: "2026-04-29T18:10:00.000Z",
              __v: 0
            },
            {
              _id: 'demo2',
              title: "Luxury Penthouse Suite",
              description: "High-end penthouse with a sea view. Premium interiors and state-of-the-art smart home features.",
              price: 120000,
              location: "Worli, Mumbai",
              propertyType: "Penthouse",
              bedrooms: 3,
              bathrooms: 3,
              furnishing: "Fully Furnished",
              area: 1800,
              amenities: ["Swimming Pool", "Clubhouse", "Intercom", "Power Backup"],
              images: [
                "https://images.unsplash.com/photo-1600607687940-47a04b629571?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
              ],
              image: "https://images.unsplash.com/photo-1600607687940-47a04b629571?auto=format&fit=crop&w=800&q=80",
              isAvailable: true,
              isFlagged: false,
              owner: { _id: authService.getCurrentUser()?.user?.id },
              createdAt: "2026-04-29T18:15:20.000Z",
              updatedAt: "2026-04-29T18:15:20.000Z",
              __v: 0
            },
            {
              _id: 'demo3',
              title: "Cozy 1RK for Students",
              description: "Budget-friendly 1RK close to university campus and local markets. Includes gas connection.",
              price: 12000,
              location: "Powai, Mumbai",
              propertyType: "Studio",
              bedrooms: 0,
              bathrooms: 1,
              furnishing: "Unfurnished",
              area: 350,
              amenities: ["Water Supply", "Security", "Fire Alarm"],
              images: [
                "https://images.unsplash.com/photo-1536376074432-8d63d592bfde?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80"
              ],
              image: "https://images.unsplash.com/photo-1536376074432-8d63d592bfde?auto=format&fit=crop&w=800&q=80",
              isAvailable: true,
              isFlagged: false,
              owner: { _id: authService.getCurrentUser()?.user?.id },
              createdAt: "2026-04-29T18:20:45.000Z",
              updatedAt: "2026-04-29T18:20:45.000Z",
              __v: 0
            }
          ];
          setProperties(demoProperties);
        } else {
          setProperties(data.data);
        }
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
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg font-medium">
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Listing
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Listings</p>
              <h3 className="text-3xl font-bold text-gray-900">{properties.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <Layout className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Queries</p>
              <h3 className="text-3xl font-bold text-gray-900">0</h3>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl border border-emerald-600 shadow-md text-white hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-emerald-100 uppercase tracking-wider mb-1">Security Status</p>
              <h3 className="text-xl font-bold text-white">All Systems Green</h3>
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
                <div key={property._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-full md:w-64 h-56 md:h-auto bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {property.image ? (
                      <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Home className="w-12 h-12 text-gray-300" />
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {property.isFlagged && (
                        <span className="bg-red-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3" />
                          Suspicious
                        </span>
                      )}
                      <span className="bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{property.title}</h4>
                        {user.id === property.owner?._id && (
                          <button 
                            onClick={() => handleDelete(property._id)}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shadow-sm bg-white border border-gray-100"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5">
                        <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          {property.location}
                        </span>
                        <span className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-emerald-700 font-medium">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          {property.price?.toLocaleString() || 'N/A'}/mo
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {property.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Home className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No listings found</h3>
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
