const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT Token oluşturma
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'qr-menu-secret-key',
    { expiresIn: '30d' }
  );
};

// Kullanıcı kaydı
exports.register = async (req, res) => {
  try {
    console.log('Kayıt isteği alındı:', req.body);
    const { name, email, password, restaurantName } = req.body;

    // Giriş doğrulama
    if (!name || !email || !password || !restaurantName) {
      console.log('Eksik alanlar:', { name, email, password: password ? 'Şifre girildi' : 'Şifre girilmedi', restaurantName });
      return res.status(400).json({
        success: false,
        message: 'Lütfen tüm alanları doldurun'
      });
    }

    console.log('Tüm alanlar dolu, e-posta kontrolü yapılıyor:', email);

    // Email kontrolü
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('E-posta zaten kullanımda:', email);
        return res.status(400).json({
          success: false,
          message: 'Bu e-posta adresi zaten kullanılıyor'
        });
      }
      console.log('E-posta kontrolü başarılı, e-posta kullanımda değil');
    } catch (emailCheckError) {
      console.error('E-posta kontrolünde hata:', emailCheckError);
      throw emailCheckError; // Ana hata yakalama bloğuna gönder
    }

    // Yeni kullanıcı oluşturma
    try {
      const user = new User({
        name,
        email,
        password,
        restaurantName
      });

      console.log('Kullanıcı oluşturuldu, kaydediliyor...');
      await user.save();
      console.log('Kullanıcı başarıyla kaydedildi:', user._id);

      // Token üretimi
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Kayıt başarılı',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          restaurantName: user.restaurantName,
          role: user.role
        }
      });
    } catch (userSaveError) {
      console.error('Kullanıcı kaydedilirken hata:', userSaveError);
      throw userSaveError; // Ana hata yakalama bloğuna gönder
    }
  } catch (error) {
    console.error('!!!!! Kayıt hatası - HATA TİPİ:', error.name);
    console.error('!!!!! Kayıt hatası - HATA MESAJI:', error.message);
    console.error('!!!!! Kayıt hatası - STACK:', error.stack);
    console.error('!!!!! Kayıt hatası - DETAYLAR:', JSON.stringify(error, null, 2));
    
    // MongoDB doğrulama hatalarını işle
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.error('Doğrulama hataları:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Doğrulama hatası',
        errors: validationErrors
      });
    }
    
    // MongoDB kopya anahtar hatasını işle
    if (error.code === 11000) {
      console.error('Benzersiz alan hatası (11000):', error.keyValue);
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }
    
    // MongoDB bağlantı hatası
    if (error.name === 'MongoError' || error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      console.error('MongoDB bağlantı hatası:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Veritabanı bağlantı hatası. Lütfen daha sonra tekrar deneyin.',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Kayıt işlemi sırasında bir hata oluştu',
      error: error.message
    });
  }
};

// Kullanıcı girişi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcı kontrolü
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Şifre kontrolü
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Token üretimi
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        restaurantName: user.restaurantName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş işlemi sırasında bir hata oluştu',
      error: error.message
    });
  }
};

// Kullanıcı profili
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profil hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil bilgileri alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Kullanıcı profil güncelleme
exports.updateProfile = async (req, res) => {
  try {
    const { name, restaurantName } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }
    
    // Güncelleme yapılacak alanlar
    if (name) user.name = name;
    if (restaurantName) user.restaurantName = restaurantName;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        restaurantName: user.restaurantName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenirken bir hata oluştu',
      error: error.message
    });
  }
}; 