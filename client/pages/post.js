import { useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import API_URL from '../utils/api';

export default function PostListing() {
  const [form, setForm] = useState({ title: '', price: '', location: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), images: [] }),
      });

      if (!res.ok) throw new Error('Server error');
      setSuccess(true);
      setForm({ title: '', price: '', location: '' });
    } catch {
      setError('Failed to post listing. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Post a Listing</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your listing will be scanned by our AI to generate a trust score before it goes live.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-sm mb-6">
            Listing posted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. 2BHK near Station"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹/month)</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. 20000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              required
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Powai, Mumbai"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Posting…' : 'Submit Listing'}
          </Button>
        </form>
      </main>
    </div>
  );
}
