import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import API_URL from '../utils/api';

// Mock user — in a real app this would come from auth context
const MOCK_USER = { name: 'Jal Patel', email: 'jal@example.com' };

export default function Dashboard() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch saved listing IDs from the server
    fetch(`${API_URL}/api/user/saved`)
      .then((res) => res.json())
      .then((ids) => {
        // In the full app we'd resolve each ID to a listing object.
        // For now just show the list of IDs.
        setSaved(ids);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
            {MOCK_USER.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{MOCK_USER.name}</h2>
            <p className="text-sm text-gray-500">{MOCK_USER.email}</p>
          </div>
        </div>

        {/* Recent activity placeholder */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Listings</h3>

        {loading && <p className="text-gray-400 text-sm">Loading…</p>}

        {!loading && saved.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-400 text-sm">
            You haven&apos;t saved any listings yet.
          </div>
        )}

        {!loading && saved.length > 0 && (
          <ul className="space-y-2">
            {saved.map((id, i) => (
              <li key={i} className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700">
                Listing ID: <span className="font-mono text-blue-600">{id}</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
