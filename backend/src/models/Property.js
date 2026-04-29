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
  location: {
    type: String,
    required: [true, 'Please add a location'],
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
