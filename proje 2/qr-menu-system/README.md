# QR Menü Sistemi

Restoranlar için QR kod tabanlı dijital menü sistemi. Müşteriler QR kodu tarayarak menüye erişebilir, ürünleri inceleyebilir ve yorum bırakabilir. Restoran sahipleri için kayıt/giriş, menü yönetimi ve QR kod oluşturma özellikleri içerir.

## Özellikler

- **Kullanıcı Yönetimi**: Kayıt, giriş ve profil yönetimi
- **Menü Yönetimi**: Kategori ve ürün ekleme, düzenleme, silme
- **QR Kod Oluşturma**: Restoran menüsüne erişim için QR kod üretimi
- **Müşteri Arayüzü**: Menü görüntüleme ve yorum bırakma

## Teknolojik Altyapı

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express
- **Veritabanı**: MongoDB
- **Kimlik Doğrulama**: JWT (JSON Web Tokens)

## Sistem Gereksinimleri

- Node.js 14 veya üzeri
- MongoDB (Atlas veya yerel)
- Web tarayıcısı (Chrome, Firefox, Edge vb.)

## Kurulum Adımları

### 1. Node.js Kurulumu

Bu projeyi çalıştırmak için Node.js kurulu olmalıdır. Node.js'i şu adresten indirebilirsiniz:
https://nodejs.org/en/download/ (LTS sürümünü seçmeniz önerilir)

Node.js kurulumunu kontrol etmek için:
```
node -v
npm -v
```

### 2. MongoDB Bağlantısı

Bu proje MongoDB veritabanını kullanmaktadır. İki seçeneğiniz var:

#### a) MongoDB Atlas (Bulut Çözümü, Önerilen)
- MongoDB Atlas hesabınız yoksa, [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)'dan ücretsiz bir hesap oluşturun
- Yeni bir cluster oluşturun
- MongoDB Atlas panelinizden "Connect" seçeneğine tıklayın
- "Connect your application" seçeneğini seçin
- Connection string'i kopyalayın

Atlas verilen bilgileri kullanmak için:
1. `mongo-update.bat` dosyasını çalıştırın

#### b) Yerel MongoDB Kurulumu
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community)'ı indirin ve kurun
2. MongoDB servisini başlatın
3. `setup-local.bat` dosyasını çalıştırın

### 3. Projeyi Çalıştırma

1. Projeyi yüklemek için:
   ```
   setup.bat
   ```

2. Projeyi çalıştırmak için:
   ```
   start.bat
   ```

3. Web tarayıcınızda `http://localhost:3000` adresine gidin

## Sorun Giderme

### MongoDB Bağlantı Sorunları

1. **IP Adresi Yetkisi**:
   - MongoDB Atlas kullanıyorsanız, IP adresinizin izin verilenler listesinde olduğundan emin olun
   - Atlas Dashboard > Network Access > Add IP Address > Add Current IP Address

2. **Kullanıcı Adı ve Şifre**:
   - Bağlantı string'indeki kullanıcı adı ve şifrenin doğru olduğundan emin olun
   - Özel karakterleri URL kodlamasına dönüştürün (`@` -> `%40`, `#` -> `%23` vb.)

3. **Güvenlik Duvarı**:
   - Güvenlik duvarınızın MongoDB bağlantısına izin verdiğinden emin olun
   - MongoDB Atlas için port 27017'nin açık olduğundan emin olun

4. **Yeni IP Adresi**:
   - Ağ değiştirdiyseniz, yeni IP adresinizi MongoDB Atlas'a ekleyin

### Kayıt Olma Sorunları

1. Kayıt olurken alınan hataları kontrol edin (terminal çıktısında detaylı hata mesajları görüntülenir)
2. Node.js ve npm'in güncel sürümlerini kullandığınızdan emin olun
3. Backend'in çalıştığından emin olun (terminal çıktısında "Server 5000 portunda çalışıyor" mesajını görmelisiniz)
4. Frontend proxy ayarlarının doğru olduğunu kontrol edin
5. Veritabanı bağlantısının çalıştığını kontrol edin

## Yardım ve İletişim

Sorunlarınız için GitHub üzerinden issue açabilir veya doğrudan iletişime geçebilirsiniz. 