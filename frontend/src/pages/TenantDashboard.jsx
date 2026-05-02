import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, MapPin, Filter, ArrowRight, Home, Zap, Heart, Eye, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '../services/api';
import authService from '../services/authService';
import { RiskBadge } from '../components/fraud/RiskBadge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import DashboardLayout from '../components/DashboardLayout';
import { useDashboard } from '../context/DashboardContext';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser()?.user;
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({ verified: 0, flagged: 0, total: 0 });

  const {
    verifiedOnly, setVerifiedOnly,
    setQuickViewProperty,
    savedProperties, toggleSaved,
    demoMode,
  } = useDashboard();

  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties
  });

  const properties = propertiesData?.data || [];

  const verifiedProperties = properties.filter(p => (p.fraudScore || 0) <= 20 || p.isVerified);

  const displayProperties = properties.filter(p => {
    const matchesFilter = verifiedOnly ? ((p.fraudScore || 0) <= 20 || p.isVerified) : true;
    const matchesSearch =
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Animate stats in demo mode
  useEffect(() => {
    if (!demoMode) {
      setAnimatedStats({
        verified: verifiedProperties.length,
        flagged: properties.filter(p => (p.fraudScore || 0) >= 70).length,
        total: properties.length,
      });
      return;
    }
    const target = {
      verified: Math.max(verifiedProperties.length, 12),
      flagged: Math.max(properties.filter(p => (p.fraudScore || 0) >= 70).length, 3),
      total: Math.max(properties.length, 24),
    };
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setAnimatedStats({
        verified: Math.min(Math.ceil(target.verified * frame / 30), target.verified),
        flagged: Math.min(Math.ceil(target.flagged * frame / 30), target.flagged),
        total: Math.min(Math.ceil(target.total * frame / 30), target.total),
      });
      if (frame >= 30) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [demoMode, properties.length]);

  return (
    <DashboardLayout title="Discover Properties">
      <div className="space-y-8">

        {/* Demo Mode Banner */}
        {demoMode && (
          <div className="bg-yellow-400 text-yellow-900 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-lg shadow-yellow-200 animate-in slide-in-from-top-2 duration-300">
            <Zap className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold text-sm">Demo Mode Active 🎯</p>
              <p className="text-xs opacity-75">Stats are animated. Click "Verified Homes" to filter verified listings. Hover cards to Quick View!</p>
            </div>
          </div>
        )}

        {/* Verified Filter Banner */}
        {verifiedOnly && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-emerald-800 text-sm">Showing Verified & Safe Homes ✅</p>
                <p className="text-xs text-emerald-600">{verifiedProperties.length} verified properties found</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVerifiedOnly(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 px-3 py-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-gray-200"
              >
                All Listings
              </button>
              <button className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200">
                Verified Only
              </button>
            </div>
          </div>
        )}

        {/* Search & Hero Section */}
        <div className="bg-emerald-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-lg shadow-emerald-900/20">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
              Find your next home with <span className="text-emerald-200">AI Confidence</span>
            </h2>
            <p className="text-emerald-50 mb-8 text-lg opacity-90">
              Every listing is scanned for fraud patterns, price anomalies, and ownership verification.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl">
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

            {/* Quick Stats in demo mode */}
            {demoMode && (
              <div className="flex items-center gap-6 mt-6 animate-in fade-in duration-500">
                {[
                  { label: 'Total Listings', value: animatedStats.total, color: 'text-white' },
                  { label: 'Verified Safe', value: animatedStats.verified, color: 'text-emerald-200' },
                  { label: 'AI Flagged', value: animatedStats.flagged, color: 'text-red-300' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:flex items-center justify-center opacity-20 pointer-events-none">
            <Shield className="w-64 h-64" />
          </div>
        </div>

        {/* Toggle Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              {verifiedOnly ? 'Verified Homes' : 'Featured Listings'}
            </h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{displayProperties.length} found</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVerifiedOnly(false)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${!verifiedOnly ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              All Listings
            </button>
            <button
              onClick={() => setVerifiedOnly(true)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${verifiedOnly ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
            >
              <Shield className="w-3 h-3" /> Verified Only
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 4].map(i => (
                  <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : displayProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayProperties.map(property => (
                  <Card
                    key={property._id}
                    className="group overflow-hidden border-gray-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 rounded-3xl relative cursor-pointer"
                    onMouseEnter={() => setHoveredCard(property._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Image with hover overlay */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={property.images?.[0] || property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'}
                        alt={property.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === property._id ? 'scale-110' : 'scale-100'}`}
                      />
                      {/* Quick View Overlay */}
                      <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 ${hoveredCard === property._id ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                          onClick={() => setQuickViewProperty(property)}
                          className="flex items-center gap-2 bg-white text-gray-900 font-bold px-5 py-3 rounded-2xl hover:bg-emerald-50 transition-colors shadow-lg transform hover:scale-105"
                        >
                          <Eye className="w-4 h-4" /> Quick View
                        </button>
                      </div>
                      <div className="absolute top-4 left-4">
                        <RiskBadge score={property.fraudScore} />
                      </div>
                      {/* Save button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSaved(property._id); }}
                        className={`absolute top-4 right-4 p-2 rounded-xl transition-all ${savedProperties.includes(property._id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-500 hover:bg-white hover:text-red-500'}`}
                      >
                        <Heart className={`w-4 h-4 ${savedProperties.includes(property._id) ? 'fill-white' : ''}`} />
                      </button>
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

                      {/* Demo tooltip */}
                      {demoMode && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
                          <span className="text-sm">💡</span>
                          <p className="text-[10px] font-bold text-yellow-800">Click here to explore verified homes</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-[10px] border border-emerald-100">
                            {property.owner?.name?.[0] || 'O'}
                          </div>
                          <span className="text-xs font-bold text-gray-700">{property.owner?.name || 'Verified'}</span>
                        </div>
                        <button
                          onClick={() => navigate(`/property/${property._id}`)}
                          className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2 group/btn"
                        >
                          View Details <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
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
                <p className="text-gray-500 text-sm">
                  {verifiedOnly ? 'No verified homes match your search.' : 'Try adjusting your filters.'}
                </p>
                {verifiedOnly && (
                  <button
                    onClick={() => setVerifiedOnly(false)}
                    className="mt-4 text-sm font-bold text-emerald-600 hover:text-emerald-800 underline"
                  >
                    Show all listings
                  </button>
                )}
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
                  <div className="bg-emerald-500 h-full w-[92%] transition-all duration-1000" />
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  Completing your profile increases your chance of owner response by 3.4x.
                </p>
                <Button className="w-full bg-emerald-50 text-emerald-700 border-none hover:bg-emerald-100 font-bold text-xs py-3 rounded-xl">
                  Complete KYC
                </Button>
              </div>
            </div>

            {/* Verified Stats Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" /> Verified Listings
              </h3>
              <div className="text-4xl font-extrabold text-emerald-600 mb-1">
                {demoMode ? animatedStats.verified : verifiedProperties.length}
              </div>
              <p className="text-xs text-gray-400 mb-4">properties cleared by AI scan</p>
              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`w-full text-xs font-bold py-3 rounded-xl transition-all ${verifiedOnly ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
              >
                {verifiedOnly ? '✅ Viewing Verified Only' : 'Show Verified Only'}
              </button>
            </div>

            <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
              <Shield className="w-8 h-8 text-emerald-500 mb-4" />
              <h4 className="font-bold mb-2">Zero Fraud Policy</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                We've flagged 142 suspicious listings this week alone. Your safety is our product.
              </p>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;
