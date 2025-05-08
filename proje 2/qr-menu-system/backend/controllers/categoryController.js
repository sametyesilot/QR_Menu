const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

// Tüm kategorileri getir
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id })
      .sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error('Kategori listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kategoriler listelenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Kategori detayını getir
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Kategori detay hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kategori detayı alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Yeni kategori oluştur
exports.createCategory = async (req, res) => {
  try {
    const { name, description, order } = req.body;
    
    const category = new Category({
      name,
      description,
      order: order || 0,
      user: req.user._id
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Kategori başarıyla oluşturuldu',
      category
    });
  } catch (error) {
    console.error('Kategori oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kategori oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

// Kategori güncelleme
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, order } = req.body;
    
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori bulunamadı'
      });
    }
    
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (order !== undefined) category.order = order;
    
    await category.save();
    
    res.status(200).json({
      success: true,
      message: 'Kategori başarıyla güncellendi',
      category
    });
  } catch (error) {
    console.error('Kategori güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kategori güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Kategori silme
exports.deleteCategory = async (req, res) => {
  try {
    // İlişkili menü öğelerini kontrol et
    const menuItems = await MenuItem.find({
      category: req.params.id,
      user: req.user._id
    });
    
    if (menuItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bu kategoriye ait menü öğeleri bulunmaktadır. Önce menü öğelerini silmelisiniz.'
      });
    }
    
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Kategori başarıyla silindi'
    });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kategori silinirken bir hata oluştu',
      error: error.message
    });
  }
}; 