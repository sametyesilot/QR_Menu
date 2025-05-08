import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs
} from '@mui/material';
import {
  ExpandMore,
  Restaurant,
  RestaurantMenu,
  Info,
  Star,
  LocalOffer,
  Store
} from '@mui/icons-material';

const PublicMenu = () => {
  const { qrId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        console.log("QR ID ile menü yükleniyor:", qrId);
        
        // API endpoint'i daha güvenilir şekilde oluşturalım - yol sorunlarını giderelim
        const baseUrl = window.location.origin;
        const apiPath = `/api/menu/public/qr/${qrId}`;
        const apiUrl = `${baseUrl}${apiPath}`;
        console.log("API isteği:", apiUrl);
        
        // Loglama ve hata yakalama geliştirmeleri
        try {
          const response = await axios.get(apiUrl);
          console.log("API yanıtı başarılı:", response.status);
          console.log("Menü veri özeti:", {
            menuName: response.data.menu?.name,
            categoriesCount: response.data.categories?.length || 0,
            itemsCount: response.data.menuItems?.length || 0
          });
          
          setRestaurant(response.data.restaurant);
          setMenu(response.data.menu);
          setCategories(response.data.categories);
          setMenuItems(response.data.menuItems);
        } catch (axiosError) {
          throw axiosError; // Daha detaylı hata yakalama için yeniden fırlat
        }
      } catch (error) {
        console.error('Menü bilgileri alınırken hata:', error);
        let errorMsg = 'Menü bilgileri alınamadı. QR kod geçerli değil veya menü bulunamadı.';
        
        if (error.response) {
          console.error('Hata kodu:', error.response.status);
          console.error('Hata detayı:', error.response.data);
          errorMsg = error.response.data.message || errorMsg;
        } else if (error.request) {
          // İstek yapıldı ancak yanıt alınamadı
          console.error('Yanıt alınamadı:', error.request);
          errorMsg = 'Sunucudan yanıt alınamadı. İnternet bağlantınızı kontrol edin.';
        } else {
          // İstek yapılırken hata oluştu
          console.error('İstek hatası:', error.message);
        }
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (qrId) {
      fetchMenu();
    }
  }, [qrId]);

  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue);
  };

  // Menü öğelerini kategoriye göre filtrele - çoklu kategori desteği
  const filteredItems = activeCategory === 0 
    ? menuItems // Tüm ürünler
    : menuItems.filter(item => {
        const categoryId = categories[activeCategory - 1]._id;
        if (Array.isArray(item.category)) {
          return item.category.some(cat => 
            cat === categoryId || (cat._id && cat._id === categoryId)
          );
        }
        return item.category === categoryId || (item.category._id && item.category._id === categoryId);
      });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>
      ) : (
        <>
          {/* Restoran ve Menü Başlığı */}
          <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Store sx={{ mr: 1, fontSize: 32 }} color="primary" />
              <Typography variant="h4" component="h1" gutterBottom>
                {restaurant?.restaurantName || restaurant?.name || 'Restoran Menüsü'}
              </Typography>
            </Box>
            <Typography variant="h5" component="div" gutterBottom>
              {menu?.name}
            </Typography>
            {menu?.description && (
              <Typography variant="body1" color="text.secondary">
                {menu.description}
              </Typography>
            )}
          </Paper>
          
          {/* Kategori Sekmeleri */}
          <Paper sx={{ mb: 4 }}>
            <Tabs 
              value={activeCategory} 
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Tüm Menü" icon={<RestaurantMenu />} iconPosition="start" />
              {categories.map((category) => (
                <Tab key={category._id} label={category.name} />
              ))}
            </Tabs>
          </Paper>
          
          {/* Menü Öğeleri Listesi */}
          {filteredItems.length === 0 ? (
            <Alert severity="info">
              Bu kategoride ürün bulunmamaktadır.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={item.image 
                        ? `${window.location.origin}/uploads/${item.image}` 
                        : 'https://via.placeholder.com/300x160?text=Ürün+Görseli'
                      }
                      alt={item.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {item.name}
                          {item.popular && (
                            <Chip 
                              label="Popüler" 
                              color="secondary" 
                              size="small" 
                              icon={<Star />}
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          {item.price.toFixed(2)} ₺
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {item.description || 'Açıklama yok'}
                      </Typography>
                      
                      {!item.isAvailable && (
                        <Chip 
                          label="Stokta Yok" 
                          color="default" 
                          size="small" 
                          sx={{ mb: 1 }} 
                        />
                      )}
                      
                      {item.ingredients && item.ingredients.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>İçindekiler:</strong>
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                            {item.ingredients.map((ing, idx) => (
                              <Chip key={idx} label={ing} size="small" variant="outlined" />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Restoran Bilgileri */}
          {restaurant?.contact && (
            <Paper sx={{ p: 3, mt: 4 }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="restaurant-info-content"
                  id="restaurant-info-header"
                >
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <Info sx={{ mr: 1 }} />
                    Restoran Bilgileri
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {restaurant.contact.address && (
                      <ListItem>
                        <ListItemText 
                          primary="Adres" 
                          secondary={restaurant.contact.address} 
                        />
                      </ListItem>
                    )}
                    {restaurant.contact.phone && (
                      <ListItem>
                        <ListItemText 
                          primary="Telefon" 
                          secondary={restaurant.contact.phone} 
                        />
                      </ListItem>
                    )}
                    {restaurant.contact.email && (
                      <ListItem>
                        <ListItemText 
                          primary="E-posta" 
                          secondary={restaurant.contact.email} 
                        />
                      </ListItem>
                    )}
                    {restaurant.contact.website && (
                      <ListItem>
                        <ListItemText 
                          primary="Web Sitesi" 
                          secondary={restaurant.contact.website} 
                        />
                      </ListItem>
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default PublicMenu; 