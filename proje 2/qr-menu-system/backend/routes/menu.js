const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { auth } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Dosya yükleme konfigürasyonu
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({ storage });

// QR kodla menü erişimi - Herkese açık route (auth gerektirmiyor)
router.get('/public/qr/:qrId', menuController.getMenuByQrId);

// Menü öğeleri ile ilgili routelar
router.get('/', auth, menuController.getAllMenuItems);
router.post('/', auth, upload.single('image'), menuController.createMenuItem);
router.get('/:id', auth, menuController.getMenuItemById);
router.put('/:id', auth, upload.single('image'), menuController.updateMenuItem);
router.delete('/:id', auth, menuController.deleteMenuItem);

// Menü ile ilgili routelar
router.get('/menus', auth, menuController.getAllMenus);
router.post('/menus', auth, menuController.createMenu);
router.get('/menus/:id', auth, menuController.getMenuById);
router.put('/menus/:id', auth, menuController.updateMenu);
router.delete('/menus/:id', auth, menuController.deleteMenu);

module.exports = router; 