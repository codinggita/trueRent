const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  priceType: {
    type: String,
    enum: ['monthly', 'yearly', 'daily'],
    default: 'monthly',
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  propertyType: {
    type: String,
  },
  bedrooms: {
    type: Number,
  },
  bathrooms: {
    type: Number,
  },
  furnishing: {
    type: String,
  },
  area: {
    type: Number,
  },
  amenities: {
    type: [String],
  },
  safetyScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  neighborhood: {
    type: String,
    trim: true,
  },
  images: {
    type: [String],
  },
  image: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isFlagged: {
    type: Boolean,
    default: false,
  },
  fraudScore: {
    type: Number,
    default: 0,
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  riskReasons: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Property', propertySchema);
