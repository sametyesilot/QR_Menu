# QR Menü Sistemi - Kurulum Talimatları

Bu belge, QR Menü Sistemi'ni kurma ve çalıştırma adımlarını içerir.

## Gereksinimler

Sistemi çalıştırmak için aşağıdaki yazılımlara ihtiyacınız var:

- [Node.js](https://nodejs.org/) (v14 veya üzeri)
- [MongoDB](https://www.mongodb.com/try/download/community) (Yerel kurulum veya Atlas üzerinde uzak sunucu)

## Kurulum Adımları

### 1. Node.js Kurulumu

1. [Node.js web sitesi](https://nodejs.org/) adresinden Node.js'in en son LTS sürümünü indirin.
2. İndirdiğiniz kurulum dosyasını çalıştırın ve yönergeleri takip edin.
3. Node.js'in PATH'e eklendiğinden emin olun (kurulum sırasında genellikle otomatik olarak eklenir).
4. Kurulumu kontrol etmek için komut isteminde şu komutları çalıştırın:
   ```
   node --version
   npm --version
   ```

### 2. MongoDB Kurulumu

Yerel kurulum veya MongoDB Atlas (bulut) kullanabilirsiniz:

#### Yerel MongoDB Kurulumu
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) adresinden MongoDB'yi indirin.
2. İndirdiğiniz kurulum dosyasını çalıştırın ve yönergeleri takip edin.
3. MongoDB hizmetinin çalıştığından emin olun.

#### MongoDB Atlas (Bulut) Kullanımı
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) üzerinde ücretsiz bir hesap oluşturun.
2. Yeni bir cluster oluşturun.
3. MongoDB bağlantı URL'sini alın.
4. Backend klasöründe bir `.env` dosyası oluşturun ve bağlantı URL'sini ekleyin:
   ```
   MONGO_URI=mongodb+srv://kullaniciadiniz:sifreniz@cluster0.mongodb.net/qrmenu
   JWT_SECRET=gizli_anahtar
   ```

### 3. Proje Bağımlılıklarını Kurma

Projedeki tüm bağımlılıkları kurmak için `install-dependencies.bat` dosyasını çalıştırın. Bu script, backend ve frontend için gerekli tüm Node.js modüllerini otomatik olarak yükleyecektir.

### 4. Sistemi Başlatma

Sistemi başlatmak için `start.bat` dosyasını çalıştırın. Bu, backend ve frontend uygulamalarını ayrı terminal pencerelerinde başlatacaktır.

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Sorun Giderme

### Node.js veya npm Komutları Çalışmıyor
- Node.js'in doğru kurulduğundan emin olun.
- Node.js kurulum klasörünün PATH'e eklendiğini kontrol edin.
- Windows'ta Komut İstemi veya PowerShell'i yönetici olarak çalıştırmayı deneyin.

### Backend Başlatma Sorunları
- MongoDB hizmetinin çalıştığından emin olun.
- Bağlantı dizesinin doğru olduğunu kontrol edin.
- Gerekli tüm modüllerin yüklü olduğunu kontrol edin.

### Frontend Başlatma Sorunları
- Proxy ayarlarının doğru olduğunu kontrol edin (package.json'da "proxy": "http://localhost:5000").
- npm modullerinin doğru kurulduğundan emin olun.

## Kullanım

1. Sisteme giriş yapın (varsayılan kullanıcı: admin@example.com, şifre: password).
2. Kategoriler oluşturun.
3. Menü öğeleri ekleyin.
4. Menüler oluşturun ve kategorileri ilişkilendirin.
5. Oluşturulan QR kodlarını görüntüleyin ve yazdırın.

## Hata Raporlama

Sistemle ilgili herhangi bir sorun yaşarsanız, lütfen detaylı hata açıklamasıyla birlikte iletişime geçin. 