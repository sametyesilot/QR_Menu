const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const MenuItem = require('../models/MenuItem');

// Yorum ekleme (müşteriler için - kimlik doğrulama gerekmez)
router.post('/:menuItemId', async (req, res) => {
  try {
    const { userName, rating, text } = req.body;
    const menuItemId = req.params.menuItemId;
    
    // Menü öğesinin varlığını kontrol et
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ 
        success: false,
        message: 'Menü öğesi bulunamadı'
      });
    }
    
    // Yeni yorum oluştur
    const comment = new Comment({
      menuItem: menuItemId,
      userName,
      rating,
      text
    });
    
    await comment.save();
    
    res.status(201).json({
      success: true,
      message: 'Yorumunuz başarıyla eklendi',
      comment
    });
  } catch (error) {
    console.error('Yorum ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Yorum eklenirken bir hata oluştu',
      error: error.message
    });
  }
});

// Belirli bir menü öğesine ait yorumları getirme
router.get('/menu/:menuItemId', async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;
    
    const comments = await Comment.find({ menuItem: menuItemId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    console.error('Yorum listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Yorumlar listelenirken bir hata oluştu',
      error: error.message
    });
  }
});

module.exports = router; 