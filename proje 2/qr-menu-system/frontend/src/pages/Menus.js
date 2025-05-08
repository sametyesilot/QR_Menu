import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  ListItemText,
  Checkbox
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';
import { Add, ContentCopy, Download, Delete, Edit, Restaurant, QrCode2 } from '@mui/icons-material';

const Menus = () => {
  const { user, authAxios } = useContext(AuthContext);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categories: [],
    menuItems: []
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [selectedQRMenu, setSelectedQRMenu] = useState(null);
  
  const baseUrl = window.location.origin;
  const qrCodeRefs = useRef({});

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
    fetchMenus();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await authAxios.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Kategoriler alınırken hata:', error);
      setSnackbar({
        open: true,
        message: 'Kategoriler alınırken hata oluştu',
        severity: 'error'
      });
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await authAxios.get('/menu');
      setMenuItems(response.data.menuItems);
    } catch (error) {
      console.error('Menü öğeleri alınırken hata:', error);
      setSnackbar({
        open: true,
        message: 'Menü öğeleri alınırken hata oluştu',
        severity: 'error'
      });
    }
  };

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await authAxios.get('/menu/menus');
      setMenus(response.data.menus);
    } catch (error) {
      console.error('Menüler alınırken hata:', error);
      setSnackbar({
        open: true,
        message: 'Menüler alınırken hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (menu = null) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        name: menu.name,
        description: menu.description || '',
        categories: menu.categories.map(cat => 
          typeof cat === 'string' ? cat : cat._id
        ),
        menuItems: menu.menuItems || []
      });
    } else {
      setEditingMenu(null);
      setFormData({
        name: `${user?.restaurantName || 'Restoran'} Menüsü`,
        description: 'QR kod ile erişilebilen dijital menü',
        categories: categories.length > 0 ? [categories[0]._id] : [],
        menuItems: []
      });
    }
    setOpenDialog(true);
  };

  const handleOpenQRDialog = (menu) => {
    setSelectedQRMenu(menu);
    setOpenQRDialog(true);
  };

  const handleCloseQRDialog = () => {
    setOpenQRDialog(false);
    setSelectedQRMenu(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMenu(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Kategori değiştiğinde ilgili ürünleri form dataya ekleme
  const handleCategoryChange = (event) => {
    const selectedCategoryIds = event.target.value;
    setFormData((prev) => ({
      ...prev,
      categories: selectedCategoryIds
    }));
    
    // Otomatik olarak seçilen kategorilerdeki tüm ürünleri seç
    const selectedItems = menuItems.filter(item => 
      item.category.some(cat => 
        selectedCategoryIds.includes(typeof cat === 'string' ? cat : cat._id)
      )
    ).map(item => item._id);
    
    setFormData(prev => ({
      ...prev,
      menuItems: selectedItems
    }));
  };

  // Menü öğesi seçme işlemi
  const handleMenuItemsChange = (event) => {
    setFormData(prev => ({
      ...prev,
      menuItems: event.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.categories.length === 0) {
      setSnackbar({
        open: true,
        message: 'En az bir kategori seçmelisiniz',
        severity: 'error'
      });
      return;
    }
    
    try {
      if (editingMenu) {
        // Menü güncelleme
        await authAxios.put(`/menu/menus/${editingMenu._id}`, formData);
        setSnackbar({
          open: true,
          message: 'Menü başarıyla güncellendi',
          severity: 'success'
        });
      } else {
        // Yeni menü oluşturma
        await authAxios.post('/menu/menus', formData);
        setSnackbar({
          open: true,
          message: 'Menü başarıyla oluşturuldu',
          severity: 'success'
        });
      }
      handleCloseDialog();
      fetchMenus();
    } catch (error) {
      console.error('Menü işlemi sırasında hata:', error);
      setSnackbar({
        open: true,
        message: `Menü ${editingMenu ? 'güncellenirken' : 'oluşturulurken'} hata oluştu: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteMenu = async (id) => {
    if (window.confirm('Bu menüyü ve ilişkili QR kodu silmek istediğinizden emin misiniz?')) {
      try {
        await authAxios.delete(`/menu/menus/${id}`);
        setSnackbar({
          open: true,
          message: 'Menü başarıyla silindi',
          severity: 'success'
        });
        fetchMenus();
      } catch (error) {
        console.error('Menü silinirken hata:', error);
        setSnackbar({
          open: true,
          message: 'Menü silinirken hata oluştu',
          severity: 'error'
        });
      }
    }
  };

  const handleCopyURL = (menu) => {
    const url = `${baseUrl}${menu.qrCode.url}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Menü URL adresi kopyalandı',
          severity: 'success'
        });
      })
      .catch((err) => {
        console.error('URL kopyalanırken hata:', err);
        setSnackbar({
          open: true,
          message: 'URL kopyalanırken bir hata oluştu',
          severity: 'error'
        });
      });
  };

  const handleDownloadQR = (menu) => {
    const qrCanvas = qrCodeRefs.current[menu._id];
    if (!qrCanvas) return;

    const canvas = qrCanvas;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${menu.name.replace(/\s+/g, '-')}-qr.png`;
    link.href = url;
    link.click();
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };

  // Bir kategorinin adını ID'sine göre bul
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Bilinmeyen Kategori';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Menüler
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Menü Oluştur
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : menus.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', mt: 2 }}>
          <Typography variant="body1">
            Henüz menü eklenmemiş. İlk menünüzü oluşturmak için yukarıdaki butonu kullanabilirsiniz.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {menus.map((menu) => (
            <Grid item xs={12} sm={6} md={4} key={menu._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {menu.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {menu.description}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" color="primary">
                    Kategoriler:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    {menu.categories.map((cat) => (
                      <Chip 
                        key={typeof cat === 'string' ? cat : cat._id} 
                        label={getCategoryName(typeof cat === 'string' ? cat : cat._id)} 
                        size="small" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Typography variant="subtitle2" color="secondary" sx={{ mt: 1 }}>
                    QR Taramaları: {menu.qrCode?.views || 0}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton size="small" color="primary" onClick={() => handleOpenQRDialog(menu)} title="QR Kodunu Görüntüle">
                    <QrCode2 />
                  </IconButton>
                  <IconButton size="small" color="primary" onClick={() => handleCopyURL(menu)} title="URL Kopyala">
                    <ContentCopy />
                  </IconButton>
                  <IconButton size="small" color="secondary" onClick={() => handleOpenDialog(menu)} title="Düzenle">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteMenu(menu._id)} title="Sil">
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menü oluşturma/düzenleme diyaloğu */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMenu ? 'Menü Düzenle' : 'Yeni Menü Oluştur'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Menü Adı"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Açıklama"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="categories-label">Kategoriler</InputLabel>
                  <Select
                  labelId="categories-label"
                  id="categories"
                  name="categories"
                  multiple
                  value={formData.categories}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput label="Kategoriler" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={getCategoryName(value)} />
                      ))}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      <Checkbox checked={formData.categories.indexOf(category._id) > -1} />
                      <ListItemText primary={category.name} />
                    </MenuItem>
                  ))}
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="menu-items-label">Menü Öğeleri</InputLabel>
                  <Select
                    labelId="menu-items-label"
                    id="menuItems"
                    name="menuItems"
                    multiple
                    value={formData.menuItems}
                    onChange={handleMenuItemsChange}
                    input={<OutlinedInput label="Menü Öğeleri" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const item = menuItems.find(i => i._id === value);
                          return item ? (
                            <Chip key={value} label={item.name} />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {/* Seçili kategorilerdeki ürünleri göster */}
                    {menuItems
                      .filter(item => 
                        item.category.some(cat => 
                          formData.categories.includes(typeof cat === 'string' ? cat : cat._id)
                        )
                      )
                      .map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          <Checkbox checked={formData.menuItems.indexOf(item._id) > -1} />
                          <ListItemText 
                            primary={item.name} 
                            secondary={`${item.price}₺ - ${getCategoryName(item.category[0])}`} 
                          />
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
                <Typography variant="caption" color="textSecondary">
                  Kategorileri seçtiğinizde menü öğeleri otomatik eklenir. İsterseniz buradan değiştirebilirsiniz.
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              İptal
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {editingMenu ? 'Güncelle' : 'Oluştur'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* QR Kod Görüntüleme Diyaloğu */}
      <Dialog open={openQRDialog} onClose={handleCloseQRDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          QR Kod Görüntüleme
        </DialogTitle>
        <DialogContent>
          {selectedQRMenu && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedQRMenu.name}
              </Typography>
              <Box 
                sx={{ 
                  p: 2, 
                  border: '1px solid #ccc', 
                  borderRadius: 1, 
                  bgcolor: 'white',
                  mb: 2
                }}
                ref={el => qrCodeRefs.current[selectedQRMenu._id] = el}
              >
                <QRCodeCanvas 
                  value={`${baseUrl}${selectedQRMenu.qrCode.url}`} 
                  size={250}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: '/logo192.png',
                    excavate: true,
                    height: 30,
                    width: 30
                  }}
                />
              </Box>
              <Typography variant="body2" gutterBottom>
                Toplam Tarama: {selectedQRMenu.qrCode.views}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ContentCopy />}
                  onClick={() => handleCopyURL(selectedQRMenu)}
                >
                  URL Kopyala
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Download />}
                  onClick={() => handleDownloadQR(selectedQRMenu)}
                >
                  QR Kodunu İndir
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQRDialog} color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Menus; 