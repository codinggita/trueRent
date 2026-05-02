import React, { useEffect, useState } from 'react';
import { Hospital, Trees, ShieldCheck, Landmark } from 'lucide-react';

/* ── Category config ── */
const CATEGORIES = [
  { key: 'hospital',  label: 'Hospitals',        icon: Hospital,    color: 'text-red-400',    bg: 'bg-red-500/10',    osmTag: 'amenity=hospital' },
  { key: 'garden',    label: 'Parks & Gardens',   icon: Trees,       color: 'text-green-400',  bg: 'bg-green-500/10',  osmTag: 'leisure=park' },
  { key: 'police',    label: 'Police Stations',   icon: ShieldCheck, color: 'text-blue-400',   bg: 'bg-blue-500/10',   osmTag: 'amenity=police' },
  { key: 'temple',    label: 'Temples',           icon: Landmark,    color: 'text-amber-400',  bg: 'bg-amber-500/10',  osmTag: 'amenity=place_of_worship' },
];

/* ── Mock data fallback ── */
const MOCK_DATA = {
  hospital: [
    { name: 'Apollo Hospital', distance: 1.8 },
    { name: 'Fortis Healthcare', distance: 3.2 },
  ],
  garden: [
    { name: 'Central Park', distance: 0.8 },
    { name: 'Lalbagh Garden', distance: 2.1 },
  ],
  police: [
    { name: 'City Police Station', distance: 1.2 },
    { name: 'Traffic Police HQ', distance: 2.5 },
  ],
  temple: [
    { name: 'ISKCON Temple', distance: 1.5 },
    { name: 'Shiva Mandir', distance: 0.6 },
  ],
};

/* ── Distance calculation (Haversine) ── */
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ── Fetch from Overpass API ── */
const fetchNearby = async (lat, lng, osmTag, radius = 3000) => {
  const query = `[out:json][timeout:10];node[${osmTag}](around:${radius},${lat},${lng});out body 5;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Overpass failed');
  const data = await res.json();
  return data.elements
    .filter((el) => el.tags?.name)
    .map((el) => ({
      name: el.tags.name,
      distance: Math.round(haversine(lat, lng, el.lat, el.lon) * 10) / 10,
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);
};

const NeighborhoodPulse = ({ lat, lng }) => {
  const [places, setPlaces] = useState({});
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    if (!lat || !lng) {
      setPlaces(MOCK_DATA);
      setUsingMock(true);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const results = {};
        await Promise.all(
          CATEGORIES.map(async (cat) => {
            try {
              const data = await fetchNearby(lat, lng, cat.osmTag);
              results[cat.key] = data.length > 0 ? data : MOCK_DATA[cat.key];
            } catch {
              results[cat.key] = MOCK_DATA[cat.key];
            }
          })
        );
        const anyReal = Object.values(results).some((arr) =>
          arr.some((p) => !MOCK_DATA[Object.keys(results).find((k) => results[k] === arr)]?.some((m) => m.name === p.name))
        );
        setUsingMock(!anyReal);
        setPlaces(results);
      } catch {
        setPlaces(MOCK_DATA);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lat, lng]);

  return (
    <div className="bg-gray-900 rounded-[20px] border border-gray-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          📍 Neighborhood Pulse
        </h2>
        {usingMock && (
          <span className="text-[10px] font-bold text-gray-400 bg-gray-800/50 px-2.5 py-1 rounded-full border border-gray-700">
            Sample Data
          </span>
        )}
      </div>

      {loading ? (
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const items = places[cat.key] || [];
            return (
              <div key={cat.key} className="p-6 border-b border-r border-gray-800 last:border-b-0 sm:even:border-r-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${cat.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white">{cat.label}</h3>
                </div>
                {items.length > 0 ? (
                  <div className="space-y-2">
                    {items.map((place, i) => (
                      <div key={i} className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-default">
                        <span className="text-sm text-gray-400 truncate flex-1 mr-3">{place.name}</span>
                        <span className="text-xs font-bold text-gray-500 whitespace-nowrap bg-gray-800 px-2 py-1 rounded-md">
                          {place.distance} km
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">No places found nearby</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NeighborhoodPulse;
