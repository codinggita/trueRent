import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, MapPin, Shield, Phone, Mail, AlertTriangle, CheckCircle,
  Calendar, Bed, Bath, Square, MessageCircle, Map, Video, Tag,
  Building2, ExternalLink, ChevronLeft, ChevronRight, X, ZoomIn, Armchair, Home, Ruler,
} from 'lucide-react';
import { getProperty } from '../services/api';
import { RiskBadge } from '../components/fraud/RiskBadge';
import DashboardLayout from '../components/DashboardLayout';

const PRICE_LABEL = { monthly: '/mo', yearly: '/yr', daily: '/day' };
const formatPrice = (p, t) => ({
  formatted: `₹${p?.toLocaleString('en-IN') ?? '0'}`,
  label: PRICE_LABEL[t] || '/mo',
});
const cleanPhone = (ph) => (ph || '').replace(/\D/g, '');
const maskPhone = (ph) => {
  if (!ph) return null;
  const digits = ph.replace(/\D/g, '');
  if (digits.length < 4) return ph;
  return digits.slice(0, 2) + '••••••' + digits.slice(-2);
};
const getRiskColor = (s) => {
  if (s == null) return 'emerald';
  return s >= 70 ? 'red' : s >= 40 ? 'yellow' : 'emerald';
};
const getRiskLabel = (s) => {
  if (s == null) return 'Verified';
  return s >= 70 ? 'High Risk' : s >= 40 ? 'Medium Risk' : 'Low Risk';
};

/* ── Fullscreen Lightbox ── */
const Lightbox = ({ images, index, onClose, onPrev, onNext }) => (
  <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
    <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white z-10">
      <X className="w-7 h-7" />
    </button>
    <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full p-2 text-white z-10">
      <ChevronLeft className="w-6 h-6" />
    </button>
    <button onClick={(e) => { e.stopPropagation(); onNext(); }}
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full p-2 text-white z-10">
      <ChevronRight className="w-6 h-6" />
    </button>
    <img src={images[index]} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl" onClick={(e) => e.stopPropagation()} />
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
      {images.map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/30'}`} />
      ))}
    </div>
  </div>
);

/* ── Skeleton ── */
const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-80 bg-gray-100 rounded-3xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-8 bg-gray-100 rounded-xl w-3/4" />
        <div className="h-4 bg-gray-100 rounded-xl w-1/2" />
        <div className="h-32 bg-gray-100 rounded-2xl" />
      </div>
      <div className="space-y-4">
        <div className="h-48 bg-gray-100 rounded-3xl" />
        <div className="h-32 bg-gray-100 rounded-3xl" />
      </div>
    </div>
  </div>
);

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id),
    enabled: !!id,
  });

  const property = data?.data || data;
  const phone = property?.owner?.phone;
  const { formatted: priceFmt, label: priceLbl } = formatPrice(property?.price, property?.priceType);

  const images = property?.images?.length > 0
    ? property.images
    : property?.image ? [property.image]
    : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80'];

  const whatsappUrl = phone
    ? `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(`Hi, I'm interested in "${property?.title}" on TrueRent.`)}`
    : null;
  const mapUrl = property?.coordinates?.lat
    ? `https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}`
    : property?.location ? `https://www.google.com/maps/search/${encodeURIComponent(property.location)}` : null;

  const prevImg = useCallback(() => setActiveImg(i => (i - 1 + images.length) % images.length), [images.length]);
  const nextImg = useCallback(() => setActiveImg(i => (i + 1) % images.length), [images.length]);

  if (isError) {
    return (
      <DashboardLayout title="Property Details">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-500 mb-8">This listing doesn't exist or has been removed.</p>
          <button onClick={() => navigate(-1)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const riskC = getRiskColor(property?.fraudScore);

  return (
    <DashboardLayout title="Property Details">
      {lightbox && (
        <Lightbox images={images} index={activeImg} onClose={() => setLightbox(false)} onPrev={prevImg} onNext={nextImg} />
      )}

      <div className="space-y-6">
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Listings
        </button>

        {isLoading ? <Skeleton /> : (
          <div className="space-y-6">

            {/* ═══ IMAGE GALLERY ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden" style={{ maxHeight: '420px' }}>
              {/* Main image */}
              <div className="md:col-span-3 relative group cursor-pointer overflow-hidden" onClick={() => setLightbox(true)}>
                <img src={images[activeImg]} alt={property?.title}
                  className="w-full h-full object-cover min-h-[280px] md:min-h-[420px] transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" /> View Gallery
                </div>
                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImg(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImg(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
                {/* Risk badge */}
                <div className="absolute top-4 left-4"><RiskBadge score={property?.fraudScore} /></div>
                {/* Image counter */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {activeImg + 1}/{images.length}
                </div>
              </div>

              {/* Thumbnail strip (right side) */}
              <div className="hidden md:flex flex-col gap-3 overflow-hidden">
                {images.slice(0, 4).map((img, i) => (
                  <button key={i} onClick={() => { setActiveImg(i); }}
                    className={`relative flex-1 min-h-0 overflow-hidden rounded-none transition-all ${activeImg === i ? 'ring-2 ring-emerald-400 ring-inset' : 'opacity-70 hover:opacity-100'}`}>
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 3 && images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                        +{images.length - 4} more
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile thumbnail scroll */}
            {images.length > 1 && (
              <div className="flex md:hidden gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-emerald-500 shadow-md' : 'border-transparent opacity-60'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ═══ HEADER: Title + Price + Actions ═══ */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                {/* Left: title block */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {property?.propertyType && (
                      <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {property.propertyType}
                      </span>
                    )}
                    {property?.furnishing && (
                      <span className="bg-gray-50 text-gray-600 text-[11px] font-bold px-2.5 py-1 rounded-full border border-gray-200 capitalize">
                        {property.furnishing}
                      </span>
                    )}
                    {property?.isAvailable !== false && (
                      <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-100">● Available</span>
                    )}
                  </div>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5">{property?.title}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{property?.location}</span>
                    {property?.neighborhood && (
                      <span className="text-gray-300 mx-1">·</span>
                    )}
                    {property?.neighborhood && (
                      <span className="text-emerald-600 font-semibold">{property.neighborhood}</span>
                    )}
                  </div>
                </div>

                {/* Right: price */}
                <div className="flex-shrink-0 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 text-right">
                  <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">
                    {property?.priceType || 'Monthly'} Rent
                  </p>
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-2xl font-extrabold text-emerald-700">{priceFmt}</span>
                    <span className="text-sm text-emerald-500 font-medium">{priceLbl}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons row */}
              <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-50">
                {whatsappUrl ? (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#1ebe5d] transition-colors shadow-sm">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </span>
                )}
                {phone ? (
                  <a href={`tel:${cleanPhone(phone)}`}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
                    <Phone className="w-4 h-4" /> Call {phone}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed">
                    <Phone className="w-4 h-4" /> Call
                  </span>
                )}
                {mapUrl ? (
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                    <Map className="w-4 h-4" /> View on Map <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed">
                    <Map className="w-4 h-4" /> Map
                  </span>
                )}
                {property?.virtualTourUrl ? (
                  <a href={property.virtualTourUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-purple-700 transition-colors shadow-sm">
                    <Video className="w-4 h-4" /> 3D Tour <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed">
                    <Video className="w-4 h-4" /> 3D Tour
                  </span>
                )}
                {property?.owner?.email && (
                  <a href={`mailto:${property.owner.email}?subject=Inquiry: ${property?.title}`}
                    className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                )}
              </div>
            </div>

            {/* ═══ CONTENT GRID ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {/* ── Property Specifications ── */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Home className="w-4 h-4 text-emerald-500" />
                      Property Specifications
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-50">
                    {[
                      { icon: Bed,      label: 'Bedrooms',   value: property?.bedrooms  ?? '—', color: 'text-blue-500',    bg: 'bg-blue-50' },
                      { icon: Bath,     label: 'Bathrooms',  value: property?.bathrooms ?? '—', color: 'text-cyan-500',    bg: 'bg-cyan-50' },
                      { icon: Ruler,    label: 'Area',       value: property?.area ? `${property.area.toLocaleString()} ft²` : '—', color: 'text-amber-500', bg: 'bg-amber-50' },
                      { icon: Armchair, label: 'Furnishing', value: property?.furnishing ? property.furnishing.charAt(0).toUpperCase() + property.furnishing.slice(1) : '—', color: 'text-purple-500', bg: 'bg-purple-50' },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                      <div key={label} className="flex flex-col items-center justify-center py-5 px-3 text-center hover:bg-gray-50/50 transition-colors">
                        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-2.5`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 mb-3">About This Property</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {property?.description || 'No description provided. Contact the owner for details.'}
                  </p>
                </div>

                {/* Amenities */}
                {property?.amenities?.length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-base font-bold text-gray-900 mb-3">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((a, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Fraud Analysis */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" /> AI Fraud Analysis
                  </h2>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-medium">Risk Score</span>
                    <span className={`font-extrabold text-sm ${riskC === 'red' ? 'text-red-600' : riskC === 'yellow' ? 'text-yellow-600' : 'text-emerald-600'}`}>
                      {property?.fraudScore ?? 0}/100 — {getRiskLabel(property?.fraudScore)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${riskC === 'red' ? 'bg-red-500' : riskC === 'yellow' ? 'bg-yellow-400' : 'bg-emerald-500'}`}
                      style={{ width: `${property?.fraudScore ?? 0}%` }} />
                  </div>
                  {property?.riskReasons?.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {property.riskReasons.map((r, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                          <span className="text-yellow-400 mt-0.5">⚠</span> {r}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    Our AI scans for pricing anomalies, ownership red flags, and duplicate content.
                  </p>
                </div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">
                {/* Owner */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-gray-900">Owner Details</h2>
                    {property?.owner?.isVerified ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
                        <AlertTriangle className="w-3 h-3" /> Unverified
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-lg">
                        {property?.owner?.name?.[0]?.toUpperCase() || 'O'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{property?.owner?.name || 'Property Owner'}</p>
                        <p className="text-[11px] text-gray-400">Property Owner</p>
                      </div>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-2.5">
                      {phone && (
                        <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5">
                          <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Phone</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{maskPhone(phone)}</p>
                          </div>
                          <a href={`tel:${cleanPhone(phone)}`}
                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 whitespace-nowrap">
                            Reveal & Call
                          </a>
                        </div>
                      )}
                      {property?.owner?.email && (
                        <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5">
                          <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Email</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{property.owner.email}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Verified trust message */}
                    {property?.owner?.isVerified && (
                      <div className="flex items-start gap-2 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                        <Shield className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-emerald-700 leading-relaxed">
                          This owner's identity has been verified by TrueRent. Documents and contact details are on file.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date */}
                {property?.createdAt && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Listed On</p>
                        <p className="text-sm font-bold text-gray-700">
                          {new Date(property.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust Seal */}
                <div className="bg-emerald-600 rounded-3xl p-5 text-white relative overflow-hidden shadow-lg">
                  <Shield className="w-7 h-7 text-white/50 mb-2" />
                  <h3 className="font-bold text-sm mb-1">TrueRent Verified</h3>
                  <p className="text-[11px] text-emerald-100 leading-relaxed">
                    This listing passed our 14-point AI verification.
                  </p>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetails;
