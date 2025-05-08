import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Sayfa Bulunamadı
        </Typography>
        <Typography variant="body1" paragraph>
          Aradığınız sayfa bulunmuyor veya taşınmış olabilir.
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/"
          sx={{ mt: 3 }}
        >
          Ana Sayfaya Dön
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound; 