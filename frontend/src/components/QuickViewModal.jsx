import React from 'react';
import { X, MapPin, Heart, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';

const QuickViewModal = () => {
  const navigate = useNavigate();
  const { quickViewProperty, setQuickViewProperty, savedProperties, toggleSaved } = useDashboard();

  if (!quickViewProperty) return null;

  const property = quickViewProperty;
  const isSaved = savedProperties.includes(property._id);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={property.images?.[0] || property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={() => setQuickViewProperty(null)}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-xl transition-colors backdrop-blur-sm"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          {/* Verified badge */}
          {(property.fraudScore || 0) < 30 && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
              <Shield className="w-3 h-3" /> Verified Safe
            </div>
          )}
          <div className="absolute bottom-0 left-0 p-5">
            <h3 className="text-white font-extrabold text-xl leading-tight">{property.title}</h3>
            <p className="text-emerald-300 font-extrabold text-2xl mt-1">₹{property.price?.toLocaleString()}<span className="text-sm font-normal text-white/70">/mo</span></p>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{property.location}</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{property.description}</p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => { navigate(`/property/${property._id}`); setQuickViewProperty(null); }}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all group"
            >
              View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => toggleSaved(property._id)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 ${
                isSaved
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={() => setQuickViewProperty(null)} />
    </div>
  );
};

export default QuickViewModal;
