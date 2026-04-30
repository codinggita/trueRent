import React, { useState } from 'react';
import { Search, Shield, MapPin, DollarSign, Filter, Star, AlertTriangle, ArrowRight, Home, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '../services/api';
import authService from '../services/authService';
import { RiskBadge } from '../components/fraud/RiskBadge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const TenantDashboard = () => {
  const user = authService.getCurrentUser()?.user;
  const [searchQuery, setSearchQuery] = useState('');

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties
  });

  const filteredProperties = properties?.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Welcome back, <span className="text-emerald-600">{user?.name}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover verified properties with AI-powered fraud protection. Your safety is our institutional priority.
            </p>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by city, neighborhood, or building..."
                className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-2 right-2">
                <button className="h-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl font-medium transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Featured Listings
              </h2>
              <span className="text-sm font-medium text-gray-500">{filteredProperties.length} properties found</span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"></div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map(property => (
                  <Card key={property._id} className="group overflow-hidden border-gray-100 hover:border-emerald-100 hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <RiskBadge score={property.fraudScore} />
                      </div>
                      <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                        <Star className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {property.title}
                        </h3>
                        <span className="text-emerald-600 font-bold">₹{property.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {property.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Home className="w-4 h-4" /> Apartment
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                            {property.owner?.name?.[0] || 'O'}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{property.owner?.name || 'Verified Owner'}</span>
                        </div>
                        <button className="text-emerald-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                          View Details <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No properties found</h3>
                <p className="text-gray-500">Try adjusting your search filters or city.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card className="bg-emerald-600 text-white border-none overflow-hidden relative">
              <div className="relative z-10 p-6">
                <Shield className="w-10 h-10 mb-4 text-emerald-200 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Verified Only</h3>
                <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
                  Every property on TrueRent undergoes an 18-point AI verification process.
                </p>
                <button className="w-full bg-white text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-900/20">
                  How it works
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/50 rounded-full blur-3xl"></div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Trust Profile</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Identity Score</span>
                  <span className="font-bold text-emerald-600">92/100</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[92%] transition-all"></div>
                </div>
                <p className="text-xs text-gray-400">Complete your KYC to unlock direct owner messaging.</p>
                <Button className="w-full variant-outline border-emerald-100 text-emerald-600 hover:bg-emerald-50">
                  Verify Identity
                </Button>
              </div>
            </Card>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <div className="flex items-center gap-3 text-red-700 font-bold mb-2">
                <AlertTriangle className="w-5 h-5" />
                Found something?
              </div>
              <p className="text-sm text-red-600 mb-4 leading-relaxed">
                Report suspicious activity and help us keep the community safe.
              </p>
              <button className="text-sm font-bold text-red-700 hover:underline">
                Report Fraudulent Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
