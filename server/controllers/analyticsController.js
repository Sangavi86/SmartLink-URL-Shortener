const URLModel = require('../models/URL');
const Click = require('../models/Click');

// @desc    Get detailed private analytics for a short URL
// @route   GET /api/v1/analytics/:shortCode
// @access  Private
exports.getUrlAnalytics = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Find the URL document
    const urlDoc = await URLModel.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }]
    });

    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        error: 'URL not found',
      });
    }

    // Verify ownership
    if (urlDoc.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view analytics for this URL',
      });
    }

    const urlId = urlDoc._id;

    // 1. Total clickCount (from Click count)
    const totalClicks = await Click.countDocuments({ urlId });

    // 2. Click distributions (browsers, os, device, referrer, country, city)
    const aggregateDistribution = async (field) => {
      return await Click.aggregate([
        { $match: { urlId } },
        { $group: { _id: `$${field}`, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    };

    const [browsers, os, devices, referrers, countries, cities] = await Promise.all([
      aggregateDistribution('browser'),
      aggregateDistribution('os'),
      aggregateDistribution('device'),
      aggregateDistribution('referrer'),
      aggregateDistribution('country'),
      aggregateDistribution('city')
    ]);

    // 3. Clicks over time (grouped by date)
    const clicksOverTime = await Click.aggregate([
      { $match: { urlId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        shortCode: urlDoc.shortCode,
        originalUrl: urlDoc.originalUrl,
        title: urlDoc.title,
        createdAt: urlDoc.createdAt,
        totalClicks,
        clicksOverTime: clicksOverTime.map(item => ({ date: item._id, clicks: item.clicks })),
        browsers: browsers.map(item => ({ name: item._id || 'Unknown', value: item.count })),
        os: os.map(item => ({ name: item._id || 'Unknown', value: item.count })),
        devices: devices.map(item => ({ name: item._id || 'Unknown', value: item.count })),
        referrers: referrers.map(item => ({ name: item._id || 'Unknown', value: item.count })),
        countries: countries.map(item => ({ name: item._id || 'Unknown', value: item.count })),
        cities: cities.map(item => ({ name: item._id || 'Unknown', value: item.count }))
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get public (non-sensitive) stats for a short URL
// @route   GET /api/v1/public/:shortCode
// @access  Public (no auth)
exports.getPublicStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Find the URL document (no ownership check — public endpoint)
    const urlDoc = await URLModel.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }]
    });

    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        error: 'URL not found',
      });
    }

    const urlId = urlDoc._id;

    // Total clicks from Click collection
    const totalClicks = await Click.countDocuments({ urlId });

    // Reusable aggregation helper
    const aggregateDistribution = async (field) => {
      return await Click.aggregate([
        { $match: { urlId } },
        { $group: { _id: `$${field}`, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    };

    // Only expose non-sensitive distributions (no IP, no OS details, no geo specifics)
    const [browsers, devices, referrers] = await Promise.all([
      aggregateDistribution('browser'),
      aggregateDistribution('device'),
      aggregateDistribution('referrer'),
    ]);

    // Clicks over time (daily buckets)
    const clicksOverTime = await Click.aggregate([
      { $match: { urlId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        shortCode: urlDoc.shortCode,
        title: urlDoc.title || null,
        createdAt: urlDoc.createdAt,
        totalClicks,
        clicksOverTime: clicksOverTime.map(item => ({ date: item._id, clicks: item.clicks })),
        browsers: browsers.map(item => ({ name: item._id || 'Unknown', value: item.count })),
        devices: devices.map(item => ({ name: item._id || 'Unknown', value: item.count })),
        referrers: referrers.map(item => ({ name: item._id || 'Unknown', value: item.count })),
        // Explicitly excluded: originalUrl, userId, IP, email, country, city, OS
      }
    });

  } catch (error) {
    next(error);
  }
};

