import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Chip,
  Stack,
  Divider,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { Add, Edit, Delete, Restaurant, RestaurantMenu } from '@mui/icons-material';

const MenuItems = () => {
  const { authAxios } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [ingredient, setIngredient] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: [],
    ingredients: [],
    isAvailable: true,
    popular: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
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
      setLoading(true);
      const response = await authAxios.get('/menu');
      setMenuItems(response.data.menuItems);
    } catch (error) {
      console.error('Menü öğeleri alınırken hata:', error);
      setSnackbar({
        open: true,
        message: 'Menü öğeleri alınırken hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      const categoryValue = Array.isArray(item.category) 
        ? item.category.map(cat => (typeof cat === 'object' ? cat._id : cat))
        : [item.category._id || item.category];
        
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        category: categoryValue,
        ingredients: item.ingredients || [],
        isAvailable: item.isAvailable,
        popular: item.popular
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories.length > 0 ? [categories[0]._id] : [],
        ingredients: [],
        isAvailable: true,
        popular: false
      });
    }
    setSelectedFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setIngredient('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setSelectedFile(files[0]);
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddIngredient = () => {
    if (ingredient.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient.trim()]
      }));
      setIngredient('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FormData kullanarak gönderim
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description || '');
      formDataObj.append('price', formData.price);
      
      // Kategori için array ise her biri ayrı append edilmeli
      if (Array.isArray(formData.category)) {
        formData.category.forEach(cat => {
          formDataObj.append('category', cat);
        });
      } else {
        formDataObj.append('category', formData.category);
      }
      
      // İçindekiler listesini string olarak gönder
      if (formData.ingredients.length > 0) {
        formDataObj.append('ingredients', formData.ingredients.join(','));
      }
      
      formDataObj.append('isAvailable', formData.isAvailable);
      formDataObj.append('popular', formData.popular);
      
      // Dosya varsa ekle
      if (selectedFile) {
        formDataObj.append('image', selectedFile);
      }

      if (editingItem) {
        // Menü öğesi güncelleme
        await authAxios.put(`/menu/${editingItem._id}`, formDataObj);
        setSnackbar({
          open: true,
          message: 'Menü öğesi başarıyla güncellendi',
          severity: 'success'
        });
      } else {
        // Yeni menü öğesi ekleme
        await authAxios.post('/menu', formDataObj);
        setSnackbar({
          open: true,
          message: 'Menü öğesi başarıyla eklendi',
          severity: 'success'
        });
      }
      handleCloseDialog();
      fetchMenuItems();
    } catch (error) {
      console.error('Menü öğesi işlemi sırasında hata:', error);
      console.error('Hata detayı:', error.response?.data);
      
      // Hata mesajını daha net gösterelim
      let errorMessage = `Menü öğesi ${editingItem ? 'güncellenirken' : 'eklenirken'} hata oluştu`;
      
      if (error.response?.data?.message) {
        errorMessage += `: ${error.response.data.message}`;
      } else if (error.response?.data?.errors) {
        errorMessage += `: ${error.response.data.errors.join(', ')}`;
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm('Bu menü öğesini silmek istediğinizden emin misiniz?')) {
      try {
        await authAxios.delete(`/menu/${id}`);
        setSnackbar({
          open: true,
          message: 'Menü öğesi başarıyla silindi',
          severity: 'success'
        });
        fetchMenuItems();
      } catch (error) {
        console.error('Menü öğesi silinirken hata:', error);
        setSnackbar({
          open: true,
          message: 'Menü öğesi silinirken hata oluştu',
          severity: 'error'
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };

  // Menü öğelerini kategorilere göre grupla ve birden fazla kategoriye ait olanları her kategoride göster
  const menuItemsByCategory = categories.map(category => ({
    category,
    items: menuItems.filter(item => {
      if (Array.isArray(item.category)) {
        return item.category.some(cat => 
          cat._id === category._id || cat === category._id
        );
      }
      return item.category._id === category._id || item.category === category._id;
    })
  }));

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Menü Öğeleri
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            disabled={categories.length === 0}
          >
            Yeni Menü Öğesi
          </Button>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Menü öğelerinizi buradan yönetebilirsiniz. Yeni ürünler ekleyebilir, düzenleyebilir veya silebilirsiniz.
        </Typography>

        {categories.length === 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Menü öğesi ekleyebilmek için önce en az bir kategori oluşturmalısınız.
            <Button 
              color="inherit" 
              size="small" 
              component="a" 
              href="/categories"
              sx={{ ml: 2 }}
            >
              Kategorilere Git
            </Button>
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : menuItems.length === 0 ? (
          <Alert severity="info">
            Henüz menü öğesi eklenmemiş. Menünüzü oluşturmak için "Yeni Menü Öğesi" butonuna tıklayın.
          </Alert>
        ) : (
          <Box sx={{ mt: 3 }}>
            {menuItemsByCategory.map(({ category, items }) => (
              items.length > 0 && (
                <Box key={category._id} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <RestaurantMenu sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                      {category.name}
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {items.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardMedia
                            component="img"
                            height="180"
                            image={item.image || 'https://via.placeholder.com/300x180?text=Ürün+Görseli'}
                            alt={item.name}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                              {item.name}
                              {item.popular && (
                                <Chip 
                                  label="Popüler" 
                                  color="secondary" 
                                  size="small" 
                                  sx={{ ml: 1 }} 
                                />
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {item.description || 'Açıklama yok'}
                            </Typography>
                            <Typography variant="h6" color="primary">
                              {item.price.toFixed(2)} ₺
                            </Typography>
                            
                            {!item.isAvailable && (
                              <Chip 
                                label="Mevcut Değil" 
                                color="default" 
                                size="small" 
                                sx={{ mt: 1 }} 
                              />
                            )}
                            
                            {item.ingredients && item.ingredients.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2">İçindekiler:</Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                                  {item.ingredients.map((ing, idx) => (
                                    <Chip key={idx} label={ing} size="small" />
                                  ))}
                                </Stack>
                              </Box>
                            )}
                          </CardContent>
                          <Divider />
                          <CardActions>
                            <Button 
                              size="small" 
                              startIcon={<Edit />}
                              onClick={() => handleOpenDialog(item)}
                            >
                              Düzenle
                            </Button>
                            <Button 
                              size="small" 
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleDeleteMenuItem(item._id)}
                            >
                              Sil
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )
            ))}
          </Box>
        )}
      </Paper>

      {/* Menü Öğesi Ekleme/Düzenleme Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          {editingItem ? 'Menü Öğesi Düzenle' : 'Yeni Menü Öğesi Ekle'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Ürün Adı"
                  type="text"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="price"
                  label="Fiyat (₺)"
                  type="number"
                  inputProps={{ min: "0", step: "0.01" }}
                  fullWidth
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="category-label">Kategoriler</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    multiple
                    value={formData.category}
                    label="Kategoriler"
                    onChange={handleInputChange}
                    input={<OutlinedInput label="Kategoriler" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const categoryName = categories.find(cat => cat._id === value)?.name || value;
                          return <Chip key={value} label={categoryName} />;
                        })}
                      </Box>
                    )}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        <Checkbox checked={formData.category.indexOf(category._id) > -1} />
                        <ListItemText primary={category.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="description"
                  label="Ürün Açıklaması"
                  type="text"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">İçindekiler (İsteğe Bağlı)</Typography>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      size="small"
                      value={ingredient}
                      onChange={(e) => setIngredient(e.target.value)}
                      label="İçindeki malzeme"
                      fullWidth
                    />
                    <Button 
                      sx={{ ml: 1 }} 
                      variant="contained" 
                      onClick={handleAddIngredient}
                    >
                      Ekle
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {formData.ingredients.map((ing, index) => (
                      <Chip
                        key={index}
                        label={ing}
                        onDelete={() => handleRemoveIngredient(index)}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                    />
                  }
                  label="Mevcut/Satışta"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="popular"
                      checked={formData.popular}
                      onChange={handleInputChange}
                    />
                  }
                  label="Popüler Ürün"
                />
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Görsel
                </Typography>
                <input
                  accept="image/*"
                  type="file"
                  id="image-upload"
                  name="image"
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<RestaurantMenu />}
                  >
                    Görsel Seç
                  </Button>
                </label>
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Seçilen dosya: {selectedFile.name}
                  </Typography>
                )}
                {editingItem && !selectedFile && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Mevcut görsel: {editingItem.image !== 'default-food.jpg' ? editingItem.image : 'Varsayılan görsel'}
                    </Typography>
                    {editingItem.image !== 'default-food.jpg' && (
                      <img 
                        src={`/api/uploads/${editingItem.image}`} 
                        alt={editingItem.name}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '8px' }}
                      />
                    )}
                  </Box>
                )}
                <FormHelperText>Görsel yüklemek isteğe bağlıdır. Yüklenmezse varsayılan görsel kullanılır.</FormHelperText>
              </Box>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>İptal</Button>
            <Button type="submit" variant="contained">
              {editingItem ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Bildirim Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MenuItems; 