import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const MenuItemDetail = () => {
  const { id } = useParams();
  
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Menü Öğesi Detayı
        </Typography>
        <Typography variant="body1">
          Ürün ID: {id}
        </Typography>
        <Typography variant="body1">
          Bu sayfada ürünün detaylı bilgileri ve yorumlar görüntülenebilir. (Yapım aşamasında)
        </Typography>
      </Paper>
    </Container>
  );
};

export default MenuItemDetail; 