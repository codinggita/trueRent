import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import API_URL from '../utils/api';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/listings`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not connect to server. Is the backend running?');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-blue-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Find Verified Rentals</h1>
        <p className="text-blue-100 text-lg max-w-xl mx-auto">
          TrueRent scans every listing for fraud before you see it — so you can rent with confidence.
        </p>
      </section>

      {/* Listings Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Listings</h2>

        {loading && (
          <p className="text-gray-500 text-center py-20">Loading listings…</p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <p className="text-gray-500 text-center py-20">No listings found.</p>
        )}
      </main>
    </div>
  );
}
