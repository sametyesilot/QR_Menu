const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }],
  qrCode: {
    uniqueId: {
      type: String,
      required: true,
      unique: true
    },
    url: {
      type: String,
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    qrImage: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Güncelleme yapıldığında updatedAt'i otomatik güncelle
menuSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu; 