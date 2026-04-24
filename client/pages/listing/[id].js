import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import RiskBadge from '../../components/RiskBadge';
import Button from '../../components/Button';
import API_URL from '../../utils/api';

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center py-20 text-gray-400">Loading…</p>
      </div>
    );
  }

  if (!listing || listing.message) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center py-20 text-red-400">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Image */}
        <div className="rounded-xl overflow-hidden mb-6 bg-gray-200 h-64">
          <img
            src={listing.images?.[0] || 'https://via.placeholder.com/800x400?text=No+Image'}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
          {listing.isVerified && (
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium shrink-0">
              ✓ Verified
            </span>
          )}
        </div>

        <p className="text-gray-500 mb-4">{listing.location}</p>

        {/* Price + Risk */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl font-bold text-gray-900">
            ₹{listing.price?.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span>
          </span>
          <RiskBadge score={listing.riskScore} />
        </div>

        {/* Placeholder Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">About this property</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Placeholder description — detailed property information will be shown here once owners fill in the listing form.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button>Request Visit</Button>
          <Button variant="outline">Save Listing</Button>
        </div>
      </main>
    </div>
  );
}
