const express = require('express');
const router = express.Router();
const QR = require('../models/QR');
const { auth } = require('../middlewares/auth');
const menuController = require('../controllers/menuController');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// QR kodlarını getir
router.get('/', auth, async (req, res) => {
  try {
    const qrCodes = await QR.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: qrCodes.length,
      qrCodes
    });
  } catch (error) {
    console.error('QR listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'QR kodları listelenirken bir hata oluştu',
      error: error.message
    });
  }
});

// QR kodu oluştur
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, serverUrl } = req.body;
    console.log("Yeni QR kod oluşturuluyor:", { name, description });
    console.log("Kullanılacak server URL:", serverUrl || "Varsayılan");
    
    // QR kodu için benzersiz ID oluştur
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const url = `/menu/${uniqueId}`;
    
    // QR kod resmi oluştur
    const qrImageName = `qr-${uniqueId}.png`;
    const qrImagePath = path.join(__dirname, '../uploads', qrImageName);
    
    // QR kod değeri için host bilgisi
    let serverHost = '';
    
    // Frontend'den gelen serverUrl değerini kullan
    if (serverUrl) {
      // URL formatını kontrol et
      try {
        // Eğer http/https protokolü yoksa ekle
        if (!serverUrl.startsWith('http://') && !serverUrl.startsWith('https://')) {
          serverHost = `http://${serverUrl}`;
        } else {
          serverHost = serverUrl;
        }
        
        // URL'nin geçerli olduğunu kontrol et
        new URL(serverHost);
        console.log("QR için kullanılacak ana URL:", serverHost);
      } catch (urlError) {
        console.error("Geçersiz URL formatı:", urlError);
        serverHost = `${req.protocol}://${req.get('host')}`;
      }
    } else {
      // Varsayılan olarak istek yapan host'u kullan
      serverHost = `${req.protocol}://${req.get('host')}`;
    }
    
    // Frontend'ten port bilgisi gelmediyse ve serverHost'ta port yoksa,
    // frontend port'unu varsayılan olarak ekle
    if (!serverHost.includes(':') && !serverUrl) {
      // Backend portu yerine frontend portu kullan (örn. 3000)
      serverHost = serverHost.replace(':5000', ':3000');
    }
    
    const fullUrl = `${serverHost}${url}`;
    console.log("Oluşturulan QR tam URL:", fullUrl);
    
    // QR kod oluşturma
    try {
      await QRCode.toFile(qrImagePath, fullUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300
      });
      console.log("QR kod resmi oluşturuldu:", qrImagePath);
    } catch (qrError) {
      console.error('QR kod oluşturma hatası:', qrError);
    }
    
    const qrCode = new QR({
      name,
      description,
      url,
      user: req.user._id
    });
    
    await qrCode.save();
    console.log("QR kod kaydedildi, ID:", qrCode._id);
    
    res.status(201).json({
      success: true,
      message: 'QR kodu başarıyla oluşturuldu',
      qrCode
    });
  } catch (error) {
    console.error('QR oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'QR kodu oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
});

// QR kodu sil
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log("QR kod silme isteği:", req.params.id);
    
    const qrCode = await QR.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!qrCode) {
      console.log("QR kod bulunamadı:", req.params.id);
      return res.status(404).json({
        success: false,
        message: 'QR kod bulunamadı'
      });
    }
    
    // QR kod resmini sil
    try {
      const uniqueId = qrCode.url.split('/').pop();
      const qrImagePath = path.join(__dirname, '../uploads', `qr-${uniqueId}.png`);
      console.log("Silinecek QR resmi:", qrImagePath);
      
      if (fs.existsSync(qrImagePath)) {
        fs.unlinkSync(qrImagePath);
        console.log("QR kod resmi silindi");
      } else {
        console.log("QR kod resmi bulunamadı, dosya yok:", qrImagePath);
      }
    } catch (fileError) {
      console.error("QR resim dosyası silinirken hata:", fileError);
      // Dosya silinemese bile işleme devam et
    }
    
    // QR kodu veritabanından sil
    const deleteResult = await QR.deleteOne({ _id: qrCode._id });
    console.log("QR kod silme sonucu:", deleteResult);
    
    res.status(200).json({
      success: true,
      message: 'QR kod başarıyla silindi'
    });
  } catch (error) {
    console.error('QR silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'QR kod silinirken bir hata oluştu',
      error: error.message
    });
  }
});

// QR kod ile menü görüntüleme istatistiğini artır
router.get('/view/:id', async (req, res) => {
  try {
    const qrCode = await QR.findById(req.params.id);
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR kod bulunamadı'
      });
    }
    
    qrCode.views += 1;
    await qrCode.save();
    
    res.status(200).json({
      success: true,
      views: qrCode.views
    });
  } catch (error) {
    console.error('QR görüntüleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'QR kod görüntüleme istatistiği güncellenirken bir hata oluştu',
      error: error.message
    });
  }
});

// QR kod ile menü görüntüleme (public endpoint)
router.get('/menu/:qrId', menuController.getMenuByQrId);

module.exports = router; 