const Property = require('../models/Property');
const Report = require('../models/Report');

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const highRiskCount = await Property.countDocuments({ riskLevel: 'high' });
    const resolvedCount = await Report.countDocuments({ status: 'Resolved' });
    const totalProperties = await Property.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalReports,
        highRiskCount,
        resolvedCount,
        totalProperties
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get analytics trends
// @route   GET /api/analytics/trends
// @access  Private
exports.getTrends = async (req, res) => {
  try {
    // Get reports created in the last 7 days grouped by date
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trends = await Report.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format for charts
    const chartData = trends.map(item => ({
      date: item._id,
      reports: item.count
    }));

    res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get risk distribution
// @route   GET /api/analytics/risk-distribution
// @access  Private
exports.getRiskDistribution = async (req, res) => {
  try {
    const distribution = await Property.aggregate([
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ success: true, data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
