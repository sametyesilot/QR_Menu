import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Divider, 
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { Add, Edit, Delete } from '@mui/icons-material';

const Categories = () => {
  const { authAxios } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await authAxios.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Kategoriler alınırken hata oluştu:', error);
      setSnackbar({
        open: true,
        message: 'Kategoriler alınırken hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Kategori güncelleme
        await authAxios.put(`/categories/${editingCategory._id}`, formData);
        setSnackbar({
          open: true,
          message: 'Kategori başarıyla güncellendi',
          severity: 'success'
        });
      } else {
        // Yeni kategori ekleme
        await authAxios.post('/categories', formData);
        setSnackbar({
          open: true,
          message: 'Kategori başarıyla eklendi',
          severity: 'success'
        });
      }
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.error('Kategori işlemi sırasında hata:', error);
      setSnackbar({
        open: true,
        message: `Kategori ${editingCategory ? 'güncellenirken' : 'eklenirken'} hata oluştu`,
        severity: 'error'
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await authAxios.delete(`/categories/${id}`);
        setSnackbar({
          open: true,
          message: 'Kategori başarıyla silindi',
          severity: 'success'
        });
        fetchCategories();
      } catch (error) {
        console.error('Kategori silinirken hata:', error);
        setSnackbar({
          open: true,
          message: 'Kategori silinirken hata oluştu. Bu kategoriye ait menü öğeleri olabilir.',
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

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Kategoriler
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Yeni Kategori
          </Button>
        </Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Menü kategorilerinizi burada yönetebilirsiniz. Önce kategorileri oluşturun, sonra bu kategorilere menü öğeleri ekleyebilirsiniz.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Henüz kategori eklenmemiş. Menü oluşturmak için önce bir kategori ekleyin.
          </Alert>
        ) : (
          <List>
            {categories.map((category) => (
              <React.Fragment key={category._id}>
                <ListItem>
                  <ListItemText 
                    primary={category.name} 
                    secondary={category.description || 'Açıklama yok'} 
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="düzenle"
                      onClick={() => handleOpenDialog(category)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="sil"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Kategori Ekleme/Düzenleme Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Kategori Adı"
              type="text"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Açıklama (İsteğe bağlı)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>İptal</Button>
            <Button type="submit" variant="contained">
              {editingCategory ? 'Güncelle' : 'Ekle'}
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

export default Categories; 