const Report = require('../models/Report');
const Property = require('../models/Property');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private (Admin only - for demo, just authenticated)
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email' }
      })
      .populate('reporter', 'name email');
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email' }
      })
      .populate('reporter', 'name email');
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    req.body.reporter = req.user.id;
    
    const report = await Report.create(req.body);
    
    // Auto-flag the property if it gets reported
    await Property.findByIdAndUpdate(req.body.property, { isFlagged: true });

    // Emit Real-time Alert
    const io = req.app.get('io');
    io.emit('new_report', {
      message: 'New fraud report submitted!',
      reportId: report._id,
      propertyId: req.body.property
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update report status
// @route   PATCH /api/reports/:id
// @access  Private
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    await report.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
