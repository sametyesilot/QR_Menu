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
  Snackbar
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';
import { Add, ContentCopy, Download, Delete } from '@mui/icons-material';

const QRCodes = () => {
  const { user, authAxios } = useContext(AuthContext);
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [localIP, setLocalIP] = useState('');
  
  // URL'in otomatik olarak hosting URL'ini veya yerel IP'yi kullanmasını sağla
  const isProduction = window.location.hostname !== 'localhost';
  const baseUrl = isProduction 
    ? window.location.origin 
    : (localIP ? `http://${localIP}:3000` : window.location.origin);
  
  const qrCodeRefs = useRef({});

  useEffect(() => {
    fetchQRCodes();
    getLocalIP();
  }, []);

  const getLocalIP = async () => {
    // Production modunda çalışıyorsa IP kullanma, doğrudan domain kullan
    if (isProduction) {
      console.log("Üretim ortamında çalışıyor, gerçek domain kullanılacak:", window.location.origin);
      return;
    }
    
    try {
      // İlk olarak kullanıcının girdiği IP'yi localStorage'dan kontrol et
      const savedIP = localStorage.getItem('qr-menu-local-ip');
      if (savedIP) {
        console.log("Kaydedilmiş IP kullanılıyor:", savedIP);
        setLocalIP(savedIP);
        return;
      }
      
      // Harici API ile IP adresini almayı dene
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      
      // Eğer genel internet IP'si ise ve içinde 192.168 veya 10. gibi yerel IP deseni yoksa
      // kullanıcıya gerçek LAN IP'sini sorma ihtiyacı doğabilir
      if (data && data.ip) {
        console.log("Algılanan IP:", data.ip);
        
        // İstenirse burada gelen IP'nin yerel ağda geçerli olup olmadığını kontrol edebilirsiniz
        const isLocalIP = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/;
        if (!isLocalIP.test(data.ip)) {
          // Bu internet IP'si, yerel ağ IP'si değil, kullanıcıya soralım
          const userIP = prompt(
            'Farklı cihazlardan menünüze erişilebilmesi için yerel ağ IP adresiniz gerekiyor.\n' +
            'Lütfen bilgisayarınızın yerel IP adresini girin (örn: 192.168.1.100):'
          );
          
          if (userIP) {
            setLocalIP(userIP);
            localStorage.setItem('qr-menu-local-ip', userIP);
            return;
          }
        }
        
        setLocalIP(data.ip);
        localStorage.setItem('qr-menu-local-ip', data.ip);
      }
    } catch (error) {
      console.error('IP adresi alınamadı:', error);
      const userIP = prompt(
        'IP adresiniz otomatik olarak tespit edilemedi. QR kodların başka cihazlarda çalışması için,\n' +
        'lütfen bilgisayarınızın yerel ağ IP adresini girin (örn: 192.168.1.100):'
      );
      
      if (userIP) {
        setLocalIP(userIP);
        localStorage.setItem('qr-menu-local-ip', userIP);
      }
    }
  };

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const response = await authAxios.get('/qr');
      setQRCodes(response.data.qrCodes);
    } catch (error) {
      console.error('QR kodları alınırken hata:', error);
      setSnackbar({
        open: true,
        message: 'QR kodları alınırken hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      name: `${user?.restaurantName || 'Restoran'} Menü`,
      description: 'QR kod ile erişilebilen dijital menü'
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
      // QR kod için kullanılacak URL bilgisi
      let serverUrl = window.location.origin;
      
      // Production modunda değilsek ve localIP varsa, bunu kullan
      if (!isProduction && localIP) {
        serverUrl = `http://${localIP}:3000`;
      }
      
      const submitData = {
        ...formData,
        serverUrl
      };
      
      console.log("QR kod oluşturma URL'si:", serverUrl);
      
      const response = await authAxios.post('/qr', submitData);
      setSnackbar({
        open: true,
        message: 'QR kod başarıyla oluşturuldu',
        severity: 'success'
      });
      handleCloseDialog();
      fetchQRCodes();
    } catch (error) {
      console.error('QR kod oluşturulurken hata:', error);
      setSnackbar({
        open: true,
        message: 'QR kod oluşturulurken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDeleteQR = async (id) => {
    if (window.confirm('Bu QR kodu silmek istediğinizden emin misiniz?')) {
      try {
        await authAxios.delete(`/qr/${id}`);
        setSnackbar({
          open: true,
          message: 'QR kod başarıyla silindi',
          severity: 'success'
        });
        fetchQRCodes();
      } catch (error) {
        console.error('QR kod silinirken hata:', error);
        console.error('Hata detayı:', error.response?.data);
        setSnackbar({
          open: true,
          message: `QR kod silinirken hata oluştu: ${error.response?.data?.message || error.message}`,
          severity: 'error'
        });
      }
    }
  };

  const handleCopyURL = (url) => {
    const fullUrl = `${baseUrl}${url}`;
    navigator.clipboard.writeText(fullUrl)
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

  const handleDownloadQR = (id) => {
    const qrCanvas = qrCodeRefs.current[id];
    if (!qrCanvas) return;

    const qrCode = qrCodes.find(qr => qr._id === id);
    if (!qrCode) return;

    const canvas = qrCanvas.querySelector('canvas');
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${qrCode.name.replace(/\s+/g, '-')}-qr.png`;
    link.href = url;
    link.click();
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
            QR Kodları
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleOpenDialog}
          >
            Yeni QR Kod Oluştur
          </Button>
        </Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          QR kodlarınızı buradan yönetebilirsiniz. Oluşturduğunuz QR kodları müşterilerinizle paylaşarak
          menünüze hızlı erişim sağlayabilirsiniz.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : qrCodes.length === 0 ? (
          <Alert severity="info">
            Henüz QR kod oluşturmadınız. Menünüz için QR kod oluşturmak için "Yeni QR Kod Oluştur" butonuna tıklayın.
          </Alert>
        ) : (
          <>
            {!localIP ? (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Yerel IP adresiniz tespit edilemedi. Bu, QR kodların farklı cihazlarda çalışmamasına neden olabilir.
                Lütfen <a href="file://./DIGER_CIHAZLARDAN_ERISIM.md" target="_blank">Erişim Kılavuzu</a>'nu okuyun.
              </Alert>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                Kullanılan IP adresi: {localIP} 
                <Button 
                  size="small" 
                  variant="outlined" 
                  sx={{ ml: 2 }}
                  onClick={() => {
                    const newIP = prompt('Yeni IP adresi girin:', localIP);
                    if (newIP) {
                      setLocalIP(newIP);
                      localStorage.setItem('qr-menu-local-ip', newIP);
                    }
                  }}
                >
                  IP Değiştir
                </Button>
              </Alert>
            )}
            <Grid container spacing={3}>
              {qrCodes.map((qrCode) => (
                <Grid item xs={12} sm={6} md={4} key={qrCode._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {qrCode.name}
                      </Typography>
                      
                      <Box 
                        sx={{ my: 2, p: 2, bgcolor: '#fff', borderRadius: 1 }}
                        ref={(el) => qrCodeRefs.current[qrCode._id] = el}
                      >
                        <QRCodeCanvas
                          id={`qr-code-${qrCode._id}`}
                          value={`${baseUrl}${qrCode.url}`}
                          size={180}
                          bgColor={"#ffffff"}
                          fgColor={"#000000"}
                          level={"H"}
                          includeMargin={true}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {qrCode.description || 'Açıklama yok'}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                        <strong>URL:</strong> {baseUrl}{qrCode.url}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                        Görüntülenme: {qrCode.views || 0}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<ContentCopy />}
                        onClick={() => handleCopyURL(qrCode.url)}
                      >
                        URL Kopyala
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<Download />}
                        onClick={() => handleDownloadQR(qrCode._id)}
                      >
                        İndir
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteQR(qrCode._id)}
                      >
                        Sil
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Paper>

      {/* QR Kod Oluşturma Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Yeni QR Kod Oluştur
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="QR Kod Adı"
              type="text"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Açıklama"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>URL Bilgisi:</strong> QR kod şu URL'yi kullanacak:
                <Box component="code" sx={{ display: 'block', mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: '0.875rem' }}>
                  {baseUrl + '/menu/[ID]'}
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Farklı cihazlardan erişim için bu URL'nin erişilebilir olduğundan emin olun.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>İptal</Button>
            <Button type="submit" variant="contained">
              QR Kod Oluştur
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

export default QRCodes; 