# QR Menü Sistemi Hosting Kılavuzu

Bu kılavuz, QR Menü Sisteminizi ücretsiz hosting ve domain hizmetleri kullanarak internet üzerinden erişilebilir hale getirmenizi sağlar.

## Neden Hosting Kullanmalıyım?

- QR kodlarınız tüm cihazlardan erişilebilir olur
- Yerel IP adresi değişimlerinden etkilenmez
- Daha profesyonel bir görünüm sunar
- Müşterileriniz internet bağlantısı olan her yerden menünüze erişebilir

## Ücretsiz Hosting Seçenekleri

QR Menü Sisteminizi yayına almak için şu ücretsiz servisleri kullanabilirsiniz:

1. **Backend (API Servisi) için:**
   - [Render](https://render.com) - Ayda 750 saat ücretsiz çalışma süresi
   - [Railway](https://railway.app) - Ayda $5 kredi (başlangıç için yeterli)
   
2. **Frontend (Web Arayüzü) için:**
   - [Vercel](https://vercel.com) - Tamamen ücretsiz, React uygulamaları için optimize
   - [Netlify](https://netlify.com) - Tamamen ücretsiz, kolay kurulum

3. **Ücretsiz Domain İsimleri için:**
   - Vercel ve Netlify kendi alt domainlerini sunar (örn: qr-menu.vercel.app)
   - [Freenom](https://www.freenom.com) - .tk, .ml, .ga, .cf, .gq uzantılı ücretsiz domainler

## Adım Adım Yayına Alma

### 1. GitHub Reposu Oluşturma

1. GitHub'da bir hesap oluşturun: [https://github.com](https://github.com)
2. Yeni bir repo oluşturun (örn: qr-menu-system)
3. Projenizi bu repoya yükleyin:

```bash
git init
git add .
git commit -m "İlk commit"
git branch -M main
git remote add origin https://github.com/kullanici-adiniz/qr-menu-system.git
git push -u origin main
```

### 2. Backend'i Render'da Yayınlama

1. [Render.com](https://render.com)'a gidin ve ücretsiz bir hesap oluşturun
2. "New" > "Web Service" seçeneğine tıklayın
3. GitHub reponuza bağlanın ve QR menü projenizi seçin
4. Şu ayarları yapın:
   - **Name**: qr-menu-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Plan**: Free

5. "Advanced" butonuna tıklayın ve şu ortam değişkenlerini ekleyin:
   - `MONGODB_URI`: MongoDB bağlantı adresiniz
   - `JWT_SECRET`: Güvenli bir anahtar (rastgele karakterler)
   - `NODE_ENV`: production
   - `PORT`: 8080 (Render'ın varsayılanı)

6. "Create Web Service" butonuna tıklayın ve kurulumun tamamlanmasını bekleyin.

7. Yayınlanan backend URL'inizi not alın (örn: https://qr-menu-backend.onrender.com)

### 3. Frontend'i Vercel'de Yayınlama

1. [Vercel.com](https://vercel.com)'a gidin ve ücretsiz bir hesap oluşturun
2. "New Project" butonuna tıklayın ve GitHub reponuzu seçin
3. Şu ayarları yapın:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build

4. "Environment Variables" bölümüne şu değişkeni ekleyin:
   - `REACT_APP_API_URL`: Render'daki backend URL'iniz (örn: https://qr-menu-backend.onrender.com)

5. "Deploy" butonuna tıklayın ve kurulumun tamamlanmasını bekleyin.

6. Yayınlanan frontend URL'inizi not alın (örn: https://qr-menu-system.vercel.app)

### 4. Backend'de CORS Ayarlarını Güncelleme

Artık backend'in frontend'ten gelen istekleri kabul etmesi için, Render Dashboard üzerinden çevre değişkenlerini güncelleyin:

- `FRONTEND_URL`: Vercel'daki frontend URL'iniz (örn: https://qr-menu-system.vercel.app)

### 5. QR Kodlarını Yeniden Oluşturma

1. Yeni yayınlanan sitenize giriş yapın
2. QR kodlar sayfasında yeni QR kodlar oluşturun
3. Bu kodlar otomatik olarak yeni domain adresinizi kullanacak ve her cihazda çalışacaktır

## Sorun Giderme

1. **Backend'e erişilemiyor:**
   - Render Dashboard'dan log'ları kontrol edin
   - MONGODB_URI doğru mu kontrol edin
   - Servisin çalışır durumda olduğundan emin olun

2. **Frontend backend'e bağlanamıyor:**
   - CORS hatası: Backend'deki FRONTEND_URL ayarını kontrol edin
   - REACT_APP_API_URL'in doğru olduğunu kontrol edin

3. **QR kodlar çalışmıyor:**
   - Yeni domain üzerinden yeni QR kodlar oluşturun
   - Tarayıcınızın önbelleğini temizleyin

## İpuçları

- Her iki serviste de ücretsiz planlar kullanıyorsanız, backend servisi uzun süre kullanılmadığında uyku moduna geçebilir. İlk istek birkaç saniye sürebilir.
- Özel bir domain adı satın alırsanız (örn: menunuz.com), bunu hem Vercel hem de Render ayarlarınızdan bağlayabilirsiniz.
- Ücretsiz hizmetler genellikle sınırlı trafik ve kaynak sunar, işletmeniz büyüdükçe ücretli planlara geçmeyi düşünebilirsiniz. 