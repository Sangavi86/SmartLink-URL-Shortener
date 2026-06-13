const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true,
  },
  shortCode: {
    type: String,
    required: [true, 'Short code is required'],
    unique: true,
    trim: true,
    index: true,
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true, // Allows missing custom aliases without duplicate key errors
    trim: true,
    index: true,
  },
  title: {
    type: String,
    trim: true,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  qrCode: {
    type: String,
  },
  expiryDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('URL', urlSchema);
