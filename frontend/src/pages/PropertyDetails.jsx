import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Shield,
  Home,
  User,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Star,
  Calendar,
  Bed,
  Bath,
  Square,
} from 'lucide-react';
import { getProperty } from '../services/api';
import { RiskBadge } from '../components/fraud/RiskBadge';
import DashboardLayout from '../components/DashboardLayout';

/* ─── Helpers ───────────────────────────────────────────────────── */
const getRiskColor = (score) => {
  if (score === undefined || score === null) return 'emerald';
  if (score >= 70) return 'red';
  if (score >= 40) return 'yellow';
  return 'emerald';
};

const getRiskLabel = (score) => {
  if (score === undefined || score === null) return 'Verified';
  if (score >= 70) return 'High Risk';
  if (score >= 40) return 'Medium Risk';
  return 'Low Risk';
};

/* ─── Skeleton ───────────────────────────────────────────────────── */
const PropertyDetailsSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-72 md:h-96 bg-gray-100 rounded-3xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

/* ─── Main Component ────────────────────────────────────────────── */
const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id),
    enabled: !!id,
  });

  // Support both { data: property } and direct property object
  const property = data?.data || data;

  if (isError) {
    return (
      <DashboardLayout title="Property Details">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-500 mb-8">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Property Details">
      <div className="space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>

        {isLoading ? (
          <PropertyDetailsSkeleton />
        ) : (
          <div className="space-y-8">
            {/* Hero Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/7] shadow-xl">
              <img
                src={
                  property?.images?.[0] ||
                  property?.image ||
                  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80'
                }
                alt={property?.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badges on image */}
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <RiskBadge score={property?.fraudScore} />
              </div>

              {/* Price on image */}
              <div className="absolute bottom-6 left-6">
                <span className="text-4xl font-extrabold text-white drop-shadow-lg">
                  ₹{property?.price?.toLocaleString()}
                  <span className="text-base font-medium text-white/70 ml-1">/mo</span>
                </span>
              </div>
            </div>

            {/* Image thumbnails (if multiple) */}
            {property?.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {property.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`View ${i + 1}`}
                    className="w-24 h-16 object-cover rounded-xl flex-shrink-0 border-2 border-transparent hover:border-emerald-400 cursor-pointer transition-all"
                  />
                ))}
              </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ── Left: Main Info ── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title & Location */}
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                    {property?.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">{property?.location}</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Bed, label: 'Bedrooms', value: property?.bedrooms ?? '—' },
                    { icon: Bath, label: 'Bathrooms', value: property?.bathrooms ?? '—' },
                    { icon: Square, label: 'Area (sq ft)', value: property?.area ?? '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm"
                    >
                      <Icon className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900">{value}</p>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">About This Property</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {property?.description ||
                      'No description provided for this listing. Contact the owner for more details.'}
                  </p>
                </div>

                {/* Amenities */}
                {property?.amenities?.length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fraud Intelligence */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    AI Fraud Analysis
                  </h2>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500 font-medium">Risk Score</span>
                    <span
                      className={`font-extrabold text-sm ${
                        getRiskColor(property?.fraudScore) === 'red'
                          ? 'text-red-600'
                          : getRiskColor(property?.fraudScore) === 'yellow'
                          ? 'text-yellow-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {property?.fraudScore ?? 0}/100 — {getRiskLabel(property?.fraudScore)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        getRiskColor(property?.fraudScore) === 'red'
                          ? 'bg-red-500'
                          : getRiskColor(property?.fraudScore) === 'yellow'
                          ? 'bg-yellow-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${property?.fraudScore ?? 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    Our AI scans listings for pricing anomalies, ownership red flags, and duplicate
                    content to surface fraud risk before you commit.
                  </p>
                </div>
              </div>

              {/* ── Right: Sidebar ── */}
              <div className="space-y-6">
                {/* Owner Card */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 mb-4">Listed By</h2>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-lg">
                      {property?.owner?.name?.[0] || 'O'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{property?.owner?.name || 'Verified Owner'}</p>
                      <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Identity Verified
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {property?.owner?.email && (
                      <a
                        href={`mailto:${property.owner.email}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-emerald-400" />
                        {property.owner.email}
                      </a>
                    )}
                    {property?.owner?.phone && (
                      <a
                        href={`tel:${property.owner.phone}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-emerald-400" />
                        {property.owner.phone}
                      </a>
                    )}
                  </div>

                  <button className="mt-6 w-full bg-gray-900 text-white py-3 rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-colors">
                    Contact Owner
                  </button>
                </div>

                {/* Listed Date */}
                {property?.createdAt && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Calendar className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Listed On
                        </p>
                        <p className="text-sm font-bold text-gray-700">
                          {new Date(property.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust Seal */}
                <div className="bg-emerald-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
                  <Shield className="w-8 h-8 text-white/60 mb-3" />
                  <h3 className="font-bold mb-1">TrueRent Verified</h3>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    This listing has passed our 14-point AI verification process.
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
