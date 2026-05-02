import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, MapPin, DollarSign, Filter, Star, AlertTriangle, ArrowRight, Home, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '../services/api';
import authService from '../services/authService';
import { RiskBadge } from '../components/fraud/RiskBadge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

import DashboardLayout from '../components/DashboardLayout';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser()?.user;
  const [searchQuery, setSearchQuery] = useState('');

  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties
  });

  const properties = propertiesData?.data || [];

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Discover Properties">
      <div className="space-y-8">
        {/* Search & Hero Section */}
        <div className="bg-emerald-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-lg shadow-emerald-900/20">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
              Find your next home with <span className="text-emerald-200">AI Confidence</span>
            </h2>
            <p className="text-emerald-50 mb-8 text-lg opacity-90">
              Every listing is scanned for fraud patterns, price anomalies, and ownership verification.
            </p>
            
            <div className="relative group max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-300" />
              </div>
              <input
                type="text"
                placeholder="Search by city, neighborhood, or building..."
                className="block w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Decorative illustration-like element */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:flex items-center justify-center opacity-20 pointer-events-none">
            <Shield className="w-64 h-64" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Featured Listings
              </h3>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filteredProperties.length} found</span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 4].map(i => (
                  <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-gray-100"></div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map(property => (
                  <Card key={property._id} className="group overflow-hidden border-gray-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 rounded-3xl">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={property.images?.[0] || property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <RiskBadge score={property.fraudScore} />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {property.title}
                        </h4>
                        <div className="text-emerald-600 font-extrabold text-lg whitespace-nowrap">
                           ₹{property.price?.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-4 h-4 text-emerald-500" /> {property.location}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-[10px] border border-emerald-100">
                            {property.owner?.name?.[0] || 'O'}
                          </div>
                          <span className="text-xs font-bold text-gray-700">{property.owner?.name || 'Verified'}</span>
                        </div>
                        <button
                          onClick={() => navigate(`/property/${property._id}`)}
                          className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2 group"
                        >
                          View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-gray-900">No properties found</h4>
                <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Trust Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-400 uppercase">Profile Strength</span>
                  <span className="text-emerald-600">92%</span>
                </div>
                <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100">
                  <div className="bg-emerald-500 h-full w-[92%] transition-all duration-1000"></div>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  Completing your profile increases your chance of owner response by 3.4x.
                </p>
                <Button className="w-full bg-emerald-50 text-emerald-700 border-none hover:bg-emerald-100 font-bold text-xs py-3 rounded-xl">
                  Complete KYC
                </Button>
              </div>
            </div>

            <div className="bg-dark-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
               <Shield className="w-8 h-8 text-emerald-500 mb-4" />
               <h4 className="font-bold mb-2">Zero Fraud Policy</h4>
               <p className="text-xs text-gray-400 leading-relaxed mb-4">
                 We've flagged 142 suspicious listings this week alone. Your safety is our product.
               </p>
               <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;
