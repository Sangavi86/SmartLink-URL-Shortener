const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'URL',
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  ip: {
    type: String,
    trim: true,
  },
  userAgent: {
    type: String,
    trim: true,
  },
  browser: {
    type: String,
    trim: true,
    default: 'Unknown',
  },
  os: {
    type: String,
    trim: true,
    default: 'Unknown',
  },
  device: {
    type: String,
    trim: true,
    default: 'Unknown',
  },
  referrer: {
    type: String,
    trim: true,
    default: 'Direct',
  },
  country: {
    type: String,
    trim: true,
    default: 'Unknown',
  },
  city: {
    type: String,
    trim: true,
    default: 'Unknown',
  },
});

module.exports = mongoose.model('Click', clickSchema);
