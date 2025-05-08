const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Lütfen giriş yapınız'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'qr-menu-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Yetkilendirme hatası:', error);
    return res.status(401).json({
      success: false,
      message: 'Oturum süresi dolmuş veya geçersiz token'
    });
  }
};

// Admin yetki kontrolü
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Bu işlem için yetkiniz bulunmamaktadır'
    });
  }
}; 