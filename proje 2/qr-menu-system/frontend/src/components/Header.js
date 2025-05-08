import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Restaurant,
  Category,
  QrCode,
  QrCode2,
  Login,
  Logout,
  AccountCircle,
  Person,
  Dashboard
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const pages = [
  { title: 'Anasayfa', path: '/', icon: <Home />, requiresAuth: true },
  { title: 'Menü Öğeleri', path: '/menu-items', icon: <Restaurant />, requiresAuth: true },
  { title: 'Kategoriler', path: '/categories', icon: <Category />, requiresAuth: true },
  { title: 'Menüler', path: '/menus', icon: <QrCode />, requiresAuth: true },
  { title: 'QR Kodlar', path: '/qr-codes', icon: <QrCode2 />, requiresAuth: true }
];

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Menu Drawer */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              color="inherit"
              onClick={handleToggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleToggleDrawer}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={handleToggleDrawer}
                onKeyDown={handleToggleDrawer}
              >
                <List>
                  <ListItem>
                    <Typography variant="h6" sx={{ my: 2 }}>
                      QR Menü Sistemi
                    </Typography>
                  </ListItem>
                  <Divider />
                  {isAuthenticated ? (
                    pages.map((page) => (
                      <ListItem key={page.title} disablePadding>
                        <ListItemButton component={RouterLink} to={page.path}>
                          <ListItemIcon>
                            {page.icon}
                          </ListItemIcon>
                          <ListItemText primary={page.title} />
                        </ListItemButton>
                      </ListItem>
                    ))
                  ) : (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to="/login">
                          <ListItemIcon>
                            <Login />
                          </ListItemIcon>
                          <ListItemText primary="Giriş Yap" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to="/register">
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          <ListItemText primary="Kayıt Ol" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </Box>
          
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            QR MENÜ
          </Typography>
          
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            QR MENÜ
          </Typography>
          
          {/* Desktop Nav Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated && pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                startIcon={page.icon}
                sx={{ my: 2, color: 'white', display: 'flex' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>
          
          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Hesap işlemleri">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.name || 'User'} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <AccountCircle sx={{ mr: 1 }} /> Profilim
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} /> Çıkış Yap
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  startIcon={<Login />}
                  sx={{ mr: 1 }}
                >
                  Giriş
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  color="inherit"
                  variant="outlined"
                  startIcon={<Person />}
                  sx={{ border: '1px solid white' }}
                >
                  Kayıt
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 