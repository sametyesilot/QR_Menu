const multer = require('multer');
const path = require('path');

// Dosya depolama ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Dosya filtresi
const fileFilter = (req, file, cb) => {
  // Kabul edilen dosya formatları
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
  // Dosya uzantısı kontrolü
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  // MIME tipi kontrolü
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir (.jpeg, .jpg, .png, .gif, .webp)'), false);
  }
};

// Multer ayarları
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB maksimum dosya boyutu
  },
  fileFilter: fileFilter
});

module.exports = upload; 