const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Comment = require('../models/Comment');
const Menu = require('../models/Menu');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Kullanıcının tüm menülerini getir
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find({ user: req.user._id })
      .populate('categories', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: menus.length,
      menus
    });
  } catch (error) {
    console.error('Menü listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Menüler listelenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Menü detayını getir
exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    .populate('categories', 'name')
    .populate('menuItems');
    
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menü bulunamadı'
      });
    }
    
    // Bu menüye ait tüm kategorileri getir
    const categories = await Category.find({
      _id: { $in: menu.categories },
      user: req.user._id
    }).sort({ order: 1 });
    
    // Bu menüye ait menü öğelerini getir
    const menuItems = await MenuItem.find({
      _id: { $in: menu.menuItems },
      user: req.user._id
    }).populate('category', 'name');
    
    res.status(200).json({
      success: true,
      menu,
      categories,
      menuItems
    });
  } catch (error) {
    console.error('Menü detay hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Menü detayı alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// QR ID'si ile menü getir (herkese açık)
exports.getMenuByQrId = async (req, res) => {
  try {
    console.log("QR ID ile menü isteniyor:", req.params.qrId);
    
    // QR ID'ye göre menü ara
    const menu = await Menu.findOne({
      'qrCode.uniqueId': req.params.qrId,
      isActive: true
    })
    .populate({
      path: 'user',
      select: 'name restaurantName contact'
    })
    .populate('categories')
    .populate('menuItems');
    
    if (!menu) {
      console.log("Menü bulunamadı, QR id:", req.params.qrId);
      return res.status(404).json({
        success: false,
        message: 'Menü bulunamadı'
      });
    }
    
    // Görüntülenme sayısını artır
    menu.qrCode.views += 1;
    await menu.save();
    
    console.log("Menü bulundu:", menu.name);
    
    // Bu menüye ait tüm kategorileri getir
    const categories = await Category.find({
      _id: { $in: menu.categories }
    }).sort({ order: 1 });
    
    console.log("Kategoriler bulundu, sayı:", categories.length);
    
    // Bu menüye ait tüm menü öğelerini getir - menü item ID kontrolü olmadan tüm öğeleri getir
    const menuItems = await MenuItem.find({
      category: { $in: menu.categories },
      user: menu.user._id
    }).populate('category', 'name');
    
    console.log("Menü öğeleri bulundu, sayı:", menuItems.length);
    
    res.status(200).json({
      success: true,
      restaurant: menu.user,
      menu,
      categories,
      menuItems
    });
  } catch (error) {
    console.error('QR menü hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Menü bilgileri alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Yeni menü oluştur (QR kodu otomatik oluşturulur)
exports.createMenu = async (req, res) => {
  try {
    const { name, description, categories, menuItems } = req.body;
    
    // Gelen kategorileri doğrula
    const categoryIds = Array.isArray(categories) ? categories : categories ? [categories] : [];
    
    if (categoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'En az bir kategori seçmelisiniz'
      });
    }
    
    // Kategorilerin geçerliliğini kontrol et
    for (const catId of categoryIds) {
      const categoryExists = await Category.findOne({
        _id: catId,
        user: req.user._id
      });
      
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: `Kategori bulunamadı: ${catId}`
        });
      }
    }
    
    // Menü öğelerini doğrula (eğer menü öğeleri belirtilmişse)
    let menuItemIds = [];
    if (menuItems && menuItems.length > 0) {
      menuItemIds = Array.isArray(menuItems) ? menuItems : [menuItems];
      
      // Menü öğelerinin geçerliliğini kontrol et
      for (const itemId of menuItemIds) {
        const menuItemExists = await MenuItem.findOne({
          _id: itemId,
          user: req.user._id
        });
        
        if (!menuItemExists) {
          return res.status(404).json({
            success: false,
            message: `Menü öğesi bulunamadı: ${itemId}`
          });
        }
      }
    } else {
      // Seçilen kategorilerdeki tüm menü öğelerini otomatik olarak ekle
      const items = await MenuItem.find({
        category: { $in: categoryIds },
        user: req.user._id
      });
      
      menuItemIds = items.map(item => item._id);
    }
    
    // QR kod için benzersiz ID oluştur
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const qrUrl = `/menu/${uniqueId}`;
    
    // QR kod resim oluşturma
    let qrImageName = `qr-${uniqueId}.png`;
    const qrImagePath = path.join(__dirname, '../uploads', qrImageName);
    
    try {
      await QRCode.toFile(qrImagePath, qrUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300
      });
    } catch (qrError) {
      console.error('QR kod oluşturma hatası:', qrError);
      // QR kod oluşturulamazsa varsayılan kullan
      qrImageName = 'default-qr.png';
    }
    
    // Yeni menü oluştur
    const menu = new Menu({
      name,
      description,
      user: req.user._id,
      categories: categoryIds,
      menuItems: menuItemIds,
      qrCode: {
        uniqueId,
        url: qrUrl,
        qrImage: qrImageName
      }
    });
    
    await menu.save();
    
    res.status(201).json({
      success: true,
      message: 'Menü başarıyla oluşturuldu',
      menu
    });
  } catch (error) {
    console.error('Menü oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Menü oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

// Menü güncelleme
exports.updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menü bulunamadı'
      });
    }
    
    const { name, description, categories, menuItems, isActive } = req.body;
    
    // Kategori güncellemesi varsa
    if (categories) {
      const categoryIds = Array.isArray(categories) ? categories : [categories];
      
      // Kategorilerin geçerliliğini kontrol et
      for (const catId of categoryIds) {
        const categoryExists = await Category.findOne({
          _id: catId,
          user: req.user._id
        });
        
        if (!categoryExists) {
          return res.status(404).json({
            success: false,
            message: `Kategori bulunamadı: ${catId}`
          });
        }
      }
      
      menu.categories = categoryIds;
      
      // Kategoriler değiştiyse ve menü öğeleri belirtilmemişse
      // o kategorilere ait tüm ürünleri otomatik ekle
      if (!menuItems) {
        const items = await MenuItem.find({
          category: { $in: categoryIds },
          user: req.user._id
        });
        
        menu.menuItems = items.map(item => item._id);
      }
    }
    
    // Menü öğeleri güncellemesi varsa
    if (menuItems) {
      const menuItemIds = Array.isArray(menuItems) ? menuItems : [menuItems];
      
      // Menü öğelerinin geçerliliğini kontrol et
      for (const itemId of menuItemIds) {
        const menuItemExists = await MenuItem.findOne({
          _id: itemId,
          user: req.user._id
        });
        
        if (!menuItemExists) {
          return res.status(404).json({
            success: false,
            message: `Menü öğesi bulunamadı: ${itemId}`
          });
        }
      }
      
      menu.menuItems = menuItemIds;
    }
    
    // Diğer alanları güncelle
    if (name) menu.name = name;
    if (description !== undefined) menu.description = description;
    if (isActive !== undefined) menu.isActive = isActive;
    
    // QR kodu güncelleme gerekiyor mu kontrol et
    // (Menü içeriği değiştiğinde QR içeriği de değişmiş olacak)
    // QR görselinin kendisi değişmiyor, sadece gösterdiği içerik değişiyor
    
    await menu.save();
    
    res.status(200).json({
      success: true,
      message: 'Menü başarıyla güncellendi',
      menu
    });
  } catch (error) {
    console.error('Menü güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Menü güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Menü silme
exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menü bulunamadı'
      });
    }
    
    // QR kod resmini sil
    if (menu.qrCode.qrImage) {
      const qrImagePath = path.join(__dirname, '../uploads', menu.qrCode.qrImage);
      if (fs.existsSync(qrImagePath)) {
        fs.unlinkSync(qrImagePath);
      }
    }
    
    await menu.remove();
    
    res.status(200).json({
      success: true,
      message: 'Menü başarıyla silindi'
    });
  } catch (error) {
    console.error('Menü silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Menü silinirken bir hata oluştu',
      error: error.message
    });
  }
};

// Tüm menü öğelerini getir
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, search, sort, available } = req.query;
    const query = { user: req.user._id };
    
    // Kategori filtresi
    if (category) {
      query.category = category;
    }
    
    // Arama filtresi
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Uygunluk filtresi
    if (available === 'true') {
      query.isAvailable = true;
    } else if (available === 'false') {
      query.isAvailable = false;
    }
    
    // Sıralama seçenekleri
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'name-asc') {
      sortOption = { name: 1 };
    } else if (sort === 'name-desc') {
      sortOption = { name: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }
    
    const menuItems = await MenuItem.find(query)
      .populate('category', 'name')
      .sort(sortOption);
    
    res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems
    });
  } catch (error) {
    console.error('Menü listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Menü öğeleri listelenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Menü öğesi detayını getir
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('category', 'name');
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menü öğesi bulunamadı'
      });
    }
    
    // İlgili yorumları da getir
    const comments = await Comment.find({ menuItem: menuItem._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      menuItem,
      comments
    });
  } catch (error) {
    console.error('Menü öğesi detay hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Menü öğesi detayı alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Yeni menü öğesi oluştur
exports.createMenuItem = async (req, res) => {
  try {
    console.log('Gelen veri:', req.body);
    console.log('Dosya:', req.file);
    
    const {
      name,
      description,
      price,
      category,
      ingredients,
      isAvailable,
      popular
    } = req.body;
    
    // Kategori zorunlu kontrol et
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'En az bir kategori seçmelisiniz'
      });
    }
    
    // Kategori kontrolü - Tek kategori veya kategori dizisi için uyumlu
    const categoryIds = Array.isArray(category) ? category : [category];
    
    // Tüm kategorilerin geçerli olduğunu kontrol et
    for (const catId of categoryIds) {
      const categoryExists = await Category.findOne({
        _id: catId,
        user: req.user._id
      });
      
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: `Seçilen kategori bulunamadı: ${catId}`
        });
      }
    }
    
    // Görsel dosyası kontrolü
    let image = 'default-food.jpg';
    if (req.file) {
      image = req.file.filename;
    }
    
    // Fiyat kontrolü
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir fiyat giriniz'
      });
    }
    
    // Yeni menü öğesi oluşturma
    const menuItem = new MenuItem({
      name,
      description,
      price: parsedPrice,
      image,
      category: categoryIds,
      user: req.user._id,
      isAvailable: isAvailable === 'false' ? false : true,
      ingredients: ingredients ? ingredients.split(',').map(item => item.trim()) : [],
      popular: popular === 'true'
    });
    
    await menuItem.save();
    
    res.status(201).json({
      success: true,
      message: 'Menü öğesi başarıyla oluşturuldu',
      menuItem
    });
  } catch (error) {
    console.error('Menü öğesi oluşturma hatası detayları:', error);
    console.error('Hata mesajı:', error.message);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Doğrulama hatası',
        errors: validationErrors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Menü öğesi oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

// Menü öğesi güncelleme
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menü öğesi bulunamadı'
      });
    }
    
    const {
      name,
      description,
      price,
      category,
      ingredients,
      isAvailable,
      popular
    } = req.body;
    
    // Kategori değişirse kontrolü yap
    if (category) {
      const categoryIds = Array.isArray(category) ? category : [category];
      
      // Tüm kategorilerin geçerli olduğunu kontrol et
      for (const catId of categoryIds) {
        const categoryExists = await Category.findOne({
          _id: catId,
          user: req.user._id
        });
        
        if (!categoryExists) {
          return res.status(404).json({
            success: false,
            message: `Seçilen kategori bulunamadı: ${catId}`
          });
        }
      }
      
      menuItem.category = categoryIds;
    }
    
    // Görsel dosyası güncelleme
    if (req.file) {
      // Eski görsel dosyası varsa sil (varsayılan değilse)
      if (menuItem.image !== 'default-food.jpg') {
        const oldImagePath = path.join(__dirname, '../uploads', menuItem.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      menuItem.image = req.file.filename;
    }
    
    // Diğer alanları güncelle
    if (name) menuItem.name = name;
    if (description !== undefined) menuItem.description = description;
    if (price !== undefined) menuItem.price = price;
    if (isAvailable !== undefined) {
      menuItem.isAvailable = isAvailable === 'true' || isAvailable === true;
    }
    if (popular !== undefined) {
      menuItem.popular = popular === 'true' || popular === true;
    }
    if (ingredients) {
      menuItem.ingredients = ingredients.split(',').map(item => item.trim());
    }
    
    await menuItem.save();
    
    res.status(200).json({
      success: true,
      message: 'Menü öğesi başarıyla güncellendi',
      menuItem
    });
  } catch (error) {
    console.error('Menü öğesi güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Menü öğesi güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Menü öğesi silme
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menü öğesi bulunamadı'
      });
    }
    
    // Görsel dosyasını sil (varsayılan değilse)
    if (menuItem.image !== 'default-food.jpg') {
      const imagePath = path.join(__dirname, '../uploads', menuItem.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // İlişkili yorumları sil
    await Comment.deleteMany({ menuItem: menuItem._id });
    
    // Menü öğesini sil
    await menuItem.remove();
    
    res.status(200).json({
      success: true,
      message: 'Menü öğesi başarıyla silindi'
    });
  } catch (error) {
    console.error('Menü öğesi silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Menü öğesi silinirken bir hata oluştu',
      error: error.message
    });
  }
}; 