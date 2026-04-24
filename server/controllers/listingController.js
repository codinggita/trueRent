const Listing = require('../models/Listing');

// Mock data for development (used when DB is empty)
const mockListings = [
  {
    _id: '1',
    title: 'Modern 2BHK Apartment in Bandra',
    price: 35000,
    location: 'Bandra, Mumbai',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'],
    riskScore: 10,
    isVerified: true,
  },
  {
    _id: '2',
    title: 'Spacious Villa – Deal of the Century!',
    price: 5000,
    location: 'Andheri, Mumbai',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'],
    riskScore: 78,
    isVerified: false,
  },
  {
    _id: '3',
    title: 'Studio Flat near IT Park',
    price: 18000,
    location: 'Whitefield, Bangalore',
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600'],
    riskScore: 25,
    isVerified: true,
  },
];

// GET /api/listings
const getListings = async (req, res) => {
  try {
    const listings = await Listing.find({});
    // Return mock data if DB is empty
    const data = listings.length > 0 ? listings : mockListings;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/listings/:id
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      // Try mock data
      const mock = mockListings.find((l) => l._id === req.params.id);
      if (mock) return res.json(mock);
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/listings
const createListing = async (req, res) => {
  try {
    const { title, price, location, images } = req.body;
    const listing = await Listing.create({ title, price, location, images });
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getListings, getListingById, createListing };
