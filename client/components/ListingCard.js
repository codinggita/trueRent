import Link from 'next/link';
import RiskBadge from './RiskBadge';

export default function ListingCard({ listing }) {
  return (
    <Link href={`/listing/${listing._id}`} className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="h-48 bg-gray-100 overflow-hidden">
        <img
          src={listing.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {listing.title}
          </h3>
          {listing.isVerified && (
            <span className="shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              ✓ Verified
            </span>
          )}
        </div>

        <p className="text-gray-500 text-xs mb-3">{listing.location}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ₹{listing.price?.toLocaleString()}
            <span className="text-xs font-normal text-gray-500">/mo</span>
          </span>
          <RiskBadge score={listing.riskScore} />
        </div>
      </div>
    </Link>
  );
}
