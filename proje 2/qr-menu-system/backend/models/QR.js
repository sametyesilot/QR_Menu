const mongoose = require('mongoose');

const QRSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'QR kod adı gereklidir'],
    trim: true,
    maxlength: [100, 'QR kod adı 100 karakterden uzun olamaz']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Açıklama 500 karakterden uzun olamaz']
  },
  url: {
    type: String,
    required: [true, 'URL gereklidir'],
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Kullanıcı ID gereklidir']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QR', QRSchema); 