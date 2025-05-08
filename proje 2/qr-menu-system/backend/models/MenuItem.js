const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'default-food.jpg'
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  ingredients: [String],
  popular: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem; 