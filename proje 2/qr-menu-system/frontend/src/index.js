import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// IP yapılandırması kontrolü
try {
  // Çalışma ortamında ip_config.txt dosyasını kontrol et
  fetch('/ip_config.txt')
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error('IP yapılandırma dosyası bulunamadı');
    })
    .then(ip => {
      if (ip && ip.trim()) {
        console.log('IP yapılandırması yüklendi:', ip.trim());
        localStorage.setItem('qr-menu-local-ip', ip.trim());
      }
    })
    .catch(error => {
      console.log('IP yapılandırması yüklenemedi:', error.message);
      
      // localStorage'da kaydedilmiş bir IP var mı kontrol et
      const savedIP = localStorage.getItem('qr-menu-local-ip');
      if (savedIP) {
        console.log('Kaydedilmiş IP kullanılıyor:', savedIP);
      }
    });
} catch (e) {
  console.log('IP yapılandırma kontrolü sırasında hata:', e);
}

// Türkçe tema
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Performance ölçümü için
reportWebVitals(); 