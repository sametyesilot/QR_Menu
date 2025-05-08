import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard = () => {
  const { user, authAxios } = useContext(AuthContext);
  const [stats, setStats] = useState({
    menuItems: 0,
    categories: 0,
    qrCodes: 0,
    comments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Bu API endpoint'leri backend'de henüz oluşturulmadı,
        // tamamlanması için örnek gösterim amaçlıdır
        const menuItemsRes = await authAxios.get('/menu');
        const categoriesRes = await authAxios.get('/categories');
        const qrCodesRes = await authAxios.get('/qr');
        
        setStats({
          menuItems: menuItemsRes.data.count || 0,
          categories: categoriesRes.data.count || 0,
          qrCodes: qrCodesRes.data.count || 0,
          comments: 0 // Yorum sayısı için ayrı endpoint oluşturulabilir
        });
      } catch (error) {
        console.error('İstatistikler alınırken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authAxios]);

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hoş Geldiniz, {user?.name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {user?.restaurantName} - QR Menü Yönetim Paneli
        </Typography>
      </Paper>

      {/* İstatistikler */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" component="div">
                  Menü Öğeleri
                </Typography>
              </Box>
              <Typography variant="h3" color="text.primary">
                {loading ? '...' : stats.menuItems}
              </Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <Button 
                size="small" 
                component={RouterLink} 
                to="/menu-items"
                sx={{ ml: 'auto' }}
              >
                Görüntüle
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" component="div">
                  Kategoriler
                </Typography>
              </Box>
              <Typography variant="h3" color="text.primary">
                {loading ? '...' : stats.categories}
              </Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <Button 
                size="small" 
                component={RouterLink} 
                to="/categories"
                sx={{ ml: 'auto' }}
              >
                Görüntüle
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" component="div">
                  QR Kodlar
                </Typography>
              </Box>
              <Typography variant="h3" color="text.primary">
                {loading ? '...' : stats.qrCodes}
              </Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <Button 
                size="small" 
                component={RouterLink} 
                to="/qr-codes"
                sx={{ ml: 'auto' }}
              >
                Görüntüle
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" component="div">
                  Yorumlar
                </Typography>
              </Box>
              <Typography variant="h3" color="text.primary">
                {loading ? '...' : stats.comments}
              </Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <Button 
                size="small" 
                disabled
                sx={{ ml: 'auto' }}
              >
                Yakında
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Hızlı Erişim */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Hızlı İşlemler
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              component={RouterLink}
              to="/menu-items"
            >
              Menü Öğesi Ekle
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              component={RouterLink}
              to="/categories"
            >
              Kategori Ekle
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              component={RouterLink}
              to="/qr-codes"
            >
              QR Kod Oluştur
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard; 