const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Route imports
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const categoryRoutes = require('./routes/category');
const commentRoutes = require('./routes/comment');
const qrRoutes = require('./routes/qr');

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB bağlantı URI'si
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://sametbabawt33:samet3363@proje1.2le8brq.mongodb.net/qrmenu?retryWrites=true&w=majority';

// Middleware
app.use(express.json());

// CORS ayarlarını tüm kaynaklardan erişime izin verecek şekilde yapılandırın
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Frontend URL'i veya tüm kaynaklara izin ver
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Uploads dizini oluştur (yoksa)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads dizini oluşturuldu');
}

// Statik dosya servis etme - QR kod ve menü görsellerini erişilebilir yap
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Gerçek IP adresi alma
app.use((req, res, next) => {
  // X-Forwarded-For, proxy arkasındaki gerçek IP'yi alır
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${ip}`);
  next();
});

// MongoDB Connection
console.log('MongoDB bağlantısı deneniyor...');
console.log('MongoDB URI:', MONGO_URI.replace(/:([^:@]+)@/, ':****@')); // Şifreyi gizleyerek logla

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 saniye timeout ekle
  connectTimeoutMS: 10000 // Bağlantı zaman aşımını arttır
})
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => {
    console.error('!!!!! MongoDB bağlantı hatası detayı:', err);
    console.error('!!!!! MongoDB bağlantı hatası mesajı:', err.message);
    console.error('!!!!! MongoDB bağlantı hatası kodu:', err.code);
    console.error('!!!!! MongoDB bağlantı hatası stack:', err.stack);
    if (err.name === 'MongoServerSelectionError') {
      console.error('!!!!! MongoDB sunucu seçim hatası. Bu genellikle yanlış bağlantı URL\'i, güvenlik duvarı veya ağ sorunu nedeniyle olabilir.');
      console.error('!!!!! Bağlantı URI doğruluğunu kontrol edin ve MongoDB Atlas\'ın IP adresinize erişim izni olduğundan emin olun.');
    }
  });

// Routes test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API çalışıyor' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/qr', qrRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Sunucu hatası:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Tüm diğer rotaları frontend'e yönlendir (SPA desteği)
if (process.env.NODE_ENV === 'production') {
  // Production modunda statik dosyaları servis et
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // Development modunda API çalışıyor mesajı
  app.get('*', (req, res) => {
    res.send('API çalışıyor. Frontend ayrı bir sunucuda çalışıyor olmalı.');
  });
}

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 