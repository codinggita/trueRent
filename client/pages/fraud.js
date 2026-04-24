import { useState } from 'react';
import Navbar from '../components/Navbar';
import RiskBadge from '../components/RiskBadge';
import Button from '../components/Button';
import API_URL from '../utils/api';

export default function FraudPage() {
  const [form, setForm] = useState({ price: '', location: '', description: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/fraud/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), images: [] }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Failed to reach fraud API. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Fraud Scanner</h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter listing details to get an instant risk assessment.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹/month)</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. 15000"
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
              placeholder="e.g. Andheri, Mumbai"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Paste the listing description here…"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Analyzing…' : 'Run Scan'}
          </Button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm">{error}</div>
        )}

        {result && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Scan Result</h2>
              <RiskBadge score={result.riskScore} />
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Label: <span className="font-semibold text-gray-800">{result.label}</span>
            </p>
            {result.reasons.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {result.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
            {result.reasons.length === 0 && (
              <p className="text-sm text-green-600">No issues detected.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
