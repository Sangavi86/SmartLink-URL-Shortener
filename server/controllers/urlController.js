const URLModel = require('../models/URL');
const Click = require('../models/Click');
const { nanoid } = require('nanoid');
const qrcode = require('qrcode');
const csv = require('csv-parser');
const { Readable } = require('stream');

// User agent parsing helper
const parseUserAgent = (userAgentString) => {
  if (!userAgentString) {
    return { browser: 'Unknown', os: 'Unknown', device: 'Desktop' };
  }
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';
  const ua = userAgentString.toLowerCase();

  // OS Detection
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('macintosh') || ua.includes('mac os x')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) os = 'iOS';

  // Device Detection
  if (ua.includes('mobi') || ua.includes('phone') || ua.includes('android') && !ua.includes('tablet')) {
    device = 'Mobile';
  } else if (ua.includes('ipad') || ua.includes('tablet') || (ua.includes('android') && ua.includes('tablet'))) {
    device = 'Tablet';
  } else {
    device = 'Desktop';
  }

  // Browser Detection
  if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('chrome') && !ua.includes('chromium')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

  return { browser, os, device };
};

// URL format validation helper
const validateUrl = (urlStr) => {
  try {
    new URL(urlStr);
    return true;
  } catch (_) {
    return false;
  }
};

// @desc    Create a short URL
// @route   POST /api/v1/urls
// @access  Private
exports.createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, title, expiryDate } = req.body;

    // Validate inputs
    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        error: 'Please provide originalUrl',
      });
    }

    if (!validateUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid original URL format',
      });
    }

    let shortCode;

    // Check customAlias if provided
    if (customAlias) {
      const trimmedAlias = customAlias.trim();
      if (trimmedAlias.length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Custom alias must be at least 3 characters',
        });
      }

      // Check if customAlias is already taken (either as shortCode or customAlias)
      const aliasExists = await URLModel.findOne({
        $or: [{ shortCode: trimmedAlias }, { customAlias: trimmedAlias }]
      });

      if (aliasExists) {
        return res.status(400).json({
          success: false,
          error: 'Custom alias or short code already taken',
        });
      }

      shortCode = trimmedAlias;
    } else {
      // Generate unique shortCode
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        shortCode = nanoid(7);
        const codeExists = await URLModel.findOne({
          $or: [{ shortCode }, { customAlias: shortCode }]
        });
        if (!codeExists) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        return res.status(500).json({
          success: false,
          error: 'Failed to generate a unique short code',
        });
      }
    }

    // Parse expiry date if provided
    let parsedExpiry = null;
    if (expiryDate) {
      parsedExpiry = new Date(expiryDate);
      if (isNaN(parsedExpiry.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid expiry date format',
        });
      }
      if (parsedExpiry <= new Date()) {
        return res.status(400).json({
          success: false,
          error: 'Expiry date must be in the future',
        });
      }
    }

    // Generate QR Code
    let qrCodeDataUrl = null;
    try {
      const fullShortUrl = `${process.env.BASE_URL || 'http://localhost:5173'}/${shortCode}`; // Note: local test often uses 5173 for client or 5001 for server redirect. We'll use window.location.origin equivalent or just standard domain. Let's use relative path or configured base URL. Since this is just a redirect, 5001 is the actual redirect server.
      const redirectUrl = `https://smartlink-url-shortener.onrender.com/${url.shortCode}`; 
      // For production we'd use process.env.BASE_URL.
      qrCodeDataUrl = await qrcode.toDataURL(redirectUrl);
    } catch (qrErr) {
      console.error('Failed to generate QR code:', qrErr.message);
    }

    // Create URL document
    const urlDoc = await URLModel.create({
      userId: req.user._id,
      originalUrl,
      shortCode,
      customAlias: customAlias ? customAlias.trim() : undefined,
      title: title || undefined,
      expiryDate: parsedExpiry || undefined,
      qrCode: qrCodeDataUrl,
      clickCount: 0
    });

    return res.status(201).json({
      success: true,
      message: 'Short URL created successfully',
      data: urlDoc
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Redirect to original URL
// @route   GET /:shortCode
// @access  Public
exports.redirectToUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Find URL by shortCode or customAlias
    const urlDoc = await URLModel.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }]
    });

    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        error: 'Short URL not found',
      });
    }

    // Check expiryDate
    if (urlDoc.expiryDate && new Date(urlDoc.expiryDate) <= new Date()) {
      return res.status(410).json({
        success: false,
        error: 'This short URL has expired',
      });
    }

    // Increment clickCount
    urlDoc.clickCount += 1;
    await urlDoc.save();

    // Log Click Asynchronously
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';
    const { browser, os, device } = parseUserAgent(userAgent);

    Click.create({
      urlId: urlDoc._id,
      ip,
      userAgent,
      browser,
      os,
      device,
      referrer,
      country: 'Unknown',
      city: 'Unknown'
    }).catch(err => console.error('Failed to log click asynchronously:', err.message));

    // Redirect to originalUrl
    return res.redirect(urlDoc.originalUrl);

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's URLs
// @route   GET /api/v1/urls
// @access  Private
exports.getUserUrls = async (req, res, next) => {
  try {
    const urls = await URLModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a URL
// @route   PUT /api/v1/urls/:id
// @access  Private
exports.updateUrl = async (req, res, next) => {
  try {
    const { originalUrl, title, expiryDate } = req.body;
    const { id } = req.params;

    // Find the URL document
    const urlDoc = await URLModel.findById(id);

    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        error: 'URL not found',
      });
    }

    // Check ownership
    if (urlDoc.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this URL',
      });
    }

    // Validate and update originalUrl if provided
    if (originalUrl !== undefined) {
      if (!originalUrl) {
        return res.status(400).json({
          success: false,
          error: 'Please provide originalUrl',
        });
      }
      if (!validateUrl(originalUrl)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid original URL format',
        });
      }
      urlDoc.originalUrl = originalUrl;
    }

    // Update title if provided
    if (title !== undefined) {
      urlDoc.title = title || undefined;
    }

    // Validate and update expiryDate if provided
    if (expiryDate !== undefined) {
      if (expiryDate === null) {
        urlDoc.expiryDate = undefined;
      } else {
        const parsedExpiry = new Date(expiryDate);
        if (isNaN(parsedExpiry.getTime())) {
          return res.status(400).json({
            success: false,
            error: 'Invalid expiry date format',
          });
        }
        if (parsedExpiry <= new Date()) {
          return res.status(400).json({
            success: false,
            error: 'Expiry date must be in the future',
          });
        }
        urlDoc.expiryDate = parsedExpiry;
      }
    }

    // Save the changes
    await urlDoc.save();

    return res.status(200).json({
      success: true,
      message: 'URL updated successfully',
      data: urlDoc,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete a URL
// @route   DELETE /api/v1/urls/:id
// @access  Private
exports.deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    const urlDoc = await URLModel.findById(id);

    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        error: 'URL not found',
      });
    }

    // Check ownership
    if (urlDoc.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this URL',
      });
    }

    await urlDoc.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'URL deleted successfully',
    });

  } catch (error) {
    next(error);
  }
};
// @desc    Bulk upload URLs via CSV
// @route   POST /api/v1/urls/bulk-upload
// @access  Private
exports.bulkUploadUrls = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a CSV file' });
    }

    const results = [];
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        let successCount = 0;
        let failedCount = 0;
        const generatedUrls = [];

        for (const row of results) {
          // Find originalUrl case-insensitively from keys if necessary, or strictly require 'originalUrl'
          const urlKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'originalurl' || k.trim().toLowerCase() === 'url');
          if (!urlKey) {
            failedCount++;
            continue;
          }
          
          const originalUrl = row[urlKey]?.trim();
          if (!originalUrl || !validateUrl(originalUrl)) {
            failedCount++;
            continue;
          }

          let title = '';
          const titleKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'title');
          if (titleKey) title = row[titleKey].trim();

          // Generate unique shortCode
          let shortCode;
          let isUnique = false;
          let attempts = 0;
          while (!isUnique && attempts < 10) {
            shortCode = nanoid(7);
            const codeExists = await URLModel.findOne({
              $or: [{ shortCode }, { customAlias: shortCode }]
            });
            if (!codeExists) isUnique = true;
            attempts++;
          }

          if (!isUnique) {
            failedCount++;
            continue;
          }

          let qrCodeDataUrl = null;
          try {
            const redirectUrl = `https://smartlink-url-shortener.onrender.com/${url.shortCode}`;
            qrCodeDataUrl = await qrcode.toDataURL(redirectUrl);
          } catch (e) {
            // ignore qr failure
          }

          try {
            const urlDoc = await URLModel.create({
              userId: req.user._id,
              originalUrl,
              shortCode,
              title: title || undefined,
              qrCode: qrCodeDataUrl,
              clickCount: 0
            });
            successCount++;
            generatedUrls.push(urlDoc);
          } catch (e) {
            failedCount++;
          }
        }

        return res.status(200).json({
          success: true,
          data: {
            totalRows: results.length,
            successfulRows: successCount,
            failedRows: failedCount,
            urls: generatedUrls
          }
        });
      })
      .on('error', (error) => {
        next(error);
      });

  } catch (error) {
    next(error);
  }
};

