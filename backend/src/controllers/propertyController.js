const mongoose = require('mongoose');
const Property = require('../models/Property');
const { calculateRiskScore } = require('../utils/fraudScorer');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's properties
// @route   GET /api/properties/my-listings
// @access  Private
exports.getMyListings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).populate('owner', 'name email');
    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format before hitting MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID format',
      });
    }

    const property = await Property.findById(id).populate(
      'owner',
      'name email phone isVerified'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
exports.createProperty = async (req, res) => {
  try {
    req.body.owner = req.user.id;

    // AI Fraud Risk Scoring
    const riskAnalysis = calculateRiskScore(req.body);
    req.body.fraudScore = riskAnalysis.score;
    req.body.riskLevel = riskAnalysis.level;
    req.body.riskReasons = riskAnalysis.reasons;
    req.body.isFlagged = riskAnalysis.level !== 'low';

    const property = await Property.create(req.body);

    // Emit Real-time Alert if High Risk
    if (riskAnalysis.level === 'high') {
      const io = req.app.get('io');
      io.emit('high_risk_alert', {
        message: 'High-risk listing detected!',
        propertyId: property._id,
        title: property.title,
        score: property.fraudScore
      });
    }

    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Make sure user is property owner
    if (property.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this property' });
    }

    // AI Fraud Risk Re-evaluation
    const mergedData = { ...property.toObject(), ...req.body };
    const riskAnalysis = calculateRiskScore(mergedData);
    req.body.fraudScore = riskAnalysis.score;
    req.body.riskLevel = riskAnalysis.level;
    req.body.riskReasons = riskAnalysis.reasons;
    req.body.isFlagged = riskAnalysis.level !== 'low';

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Emit Alert on Re-evaluation if now High Risk
    if (riskAnalysis.level === 'high') {
      const io = req.app.get('io');
      io.emit('high_risk_alert', {
        message: 'A listing has been updated and flagged as High-risk!',
        propertyId: property._id,
        title: property.title,
        score: property.fraudScore
      });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Make sure user is property owner
    if (property.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
