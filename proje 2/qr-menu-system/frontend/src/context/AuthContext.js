import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// API URL'i (deployment için)
const API_URL = process.env.REACT_APP_API_URL || '/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Token ile API istekleri için Axios instance
  const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Kullanıcı bilgilerini yükleme
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authAxios.get('/auth/profile');
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Kullanıcı profili yüklenirken hata:', err);
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setIsAuthenticated(false);
        setError('Oturum süresi dolmuş veya geçersiz token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Kullanıcı girişi
  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('Giriş yapılıyor:', email);
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError('');
      console.log('Giriş başarılı.');
      return true;
    } catch (err) {
      console.error('Giriş hatası:', err);
      if (err.response) {
        console.error('Sunucu yanıtı:', err.response.status, err.response.data);
        setError(err.response.data.message || 'Giriş yaparken bir hata oluştu');
      } else if (err.request) {
        console.error('Sunucuya ulaşılamadı:', err.request);
        setError('Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.');
      } else {
        console.error('İstek hatası:', err.message);
        setError('Giriş yapılırken bir hata oluştu');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı kaydı
  const register = async (userData) => {
    setLoading(true);
    try {
      console.log('Kayıt yapılıyor:', userData.email);
      
      // API'ye istek gönderilmeden önce bağlantı kontrolü
      try {
        await axios.get(`${API_URL}/test`);
        console.log('API bağlantısı başarılı, kayıt işlemi devam ediyor...');
      } catch (connErr) {
        console.error('API bağlantı hatası (test):', connErr);
        setError('Sunucu bağlantısı sağlanamadı. Lütfen backend servisinin çalıştığından emin olun.');
        setLoading(false);
        return false;
      }
      
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      
      console.log('Kayıt başarılı, yanıt:', res.data);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError('');
      return true;
    } catch (err) {
      console.error('Kayıt hatası:', err);
      
      if (err.response) {
        console.error('Sunucu yanıtı:', err.response.status, err.response.data);
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          setError(err.response.data.errors.join(', '));
        } else {
          setError(err.response.data.message || 'Kayıt yapılırken bir hata oluştu');
        }
      } else if (err.request) {
        console.error('Sunucuya ulaşılamadı:', err.request);
        setError('Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı ve backend servisinin çalıştığını kontrol edin.');
      } else {
        console.error('İstek hatası:', err.message);
        setError('Kayıt yapılırken bir hata oluştu');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Profil güncelleme
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const res = await authAxios.put('/auth/profile', userData);
      setUser(res.data.user);
      setError('');
      return true;
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
      setError(err.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Çıkış yapma
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      loading,
      error,
      login,
      register,
      logout,
      updateProfile,
      authAxios
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 