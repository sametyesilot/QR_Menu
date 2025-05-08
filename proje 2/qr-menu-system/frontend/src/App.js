import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import { AuthContext } from './context/AuthContext';

// Sayfa Bileşenleri
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MenuItems from './pages/MenuItems';
import Categories from './pages/Categories';
import Menus from './pages/Menus';
import QRCodes from './pages/QRCodes';
import PublicMenu from './pages/PublicMenu';
import MenuItemDetail from './pages/MenuItemDetail';
import NotFound from './pages/NotFound';

// Layout Bileşenleri
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // Korumalı Route bileşeni
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Yükleniyor...</div>;
    }
    
    if (!isAuthenticated) {
      // Giriş yapılmamışsa login sayfasına yönlendir ve geri dönüş URL'ini kaydet
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return children;
  };

  return (
    <>
      <Header />
      <Container sx={{ py: 4, minHeight: 'calc(100vh - 130px)' }}>
        <Routes>
          {/* Herkese açık sayfalar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu/:qrId" element={<PublicMenu />} />
          <Route path="/menu/item/:id" element={<MenuItemDetail />} />
          
          {/* Korumalı sayfalar */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/menu-items" element={
            <ProtectedRoute>
              <MenuItems />
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          } />
          <Route path="/menus" element={
            <ProtectedRoute>
              <Menus />
            </ProtectedRoute>
          } />
          <Route path="/qr-codes" element={
            <ProtectedRoute>
              <QRCodes />
            </ProtectedRoute>
          } />
          
          {/* 404 sayfası */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App; 