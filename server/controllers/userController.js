// Mock user controller — saved listings (no auth yet)

const savedListings = []; // In-memory store for now

// GET /api/user/saved
const getSaved = (req, res) => {
  res.json(savedListings);
};

// POST /api/user/save
const saveListing = (req, res) => {
  const { listingId } = req.body;
  if (!listingId) {
    return res.status(400).json({ message: 'listingId is required' });
  }
  if (!savedListings.includes(listingId)) {
    savedListings.push(listingId);
  }
  res.json({ message: 'Listing saved', saved: savedListings });
};

module.exports = { getSaved, saveListing };
