const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ad Soyad alanı zorunludur'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-posta alanı zorunludur'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Lütfen geçerli bir e-posta adresi girin'
    ]
  },
  password: {
    type: String,
    required: [true, 'Şifre alanı zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  },
  role: {
    type: String,
    enum: ['admin', 'owner'],
    default: 'owner'
  },
  restaurantName: {
    type: String,
    required: [true, 'Restoran adı zorunludur'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing before saving
userSchema.pre('save', async function(next) {
  try {
    // Şifre değişmediyse tekrar hash işlemi yapma
    const user = this;
    if (!user.isModified('password')) {
      return next();
    }

    // Bcrypt ile şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Şifre hashing hatası:', error);
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Şifre karşılaştırma hatası:', error);
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User; 