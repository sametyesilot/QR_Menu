# QR Menü Sistemine Farklı Cihazlardan Erişim Kılavuzu

Bu kılavuz, QR Menü Sisteminizin diğer cihazlardan (akıllı telefonlar, tabletler vb.) erişilebilir olması için gereken adımları açıklar.

## 1. Yerel IP Adresinizi Bulma

Öncelikle, bilgisayarınızın yerel ağdaki IP adresini öğrenmeniz gerekiyor:

### Windows'ta:
1. Komut İstemi'ni açın (cmd)
2. `ipconfig` yazıp Enter tuşuna basın
3. "IPv4 Address" yazan satırdaki adresi not alın (genellikle 192.168.1.XX formatındadır)

### macOS / Linux'ta:
1. Terminal'i açın
2. `ifconfig` veya `ip addr` yazıp Enter tuşuna basın
3. "inet" yanındaki adres sizin yerel IP adresinizdir

## 2. Bağlantı Noktası (Port) Bilgisi

QR Menü Sisteminiz iki farklı port üzerinde çalışır:
- Backend (API): 5000 numaralı portta
- Frontend (Arayüz): 3000 numaralı portta

## 3. Farklı Cihazlardan Erişim

### Aynı Ağdaki Cihazlardan Erişim
Aynı WiFi ağına bağlı tüm cihazlar, aşağıdaki adresi kullanarak menünüze erişebilir:

```
http://[YEREL-IP-ADRESINIZ]:3000
```

Örneğin, IP adresiniz 192.168.1.100 ise, erişim adresi şöyle olur:

```
http://192.168.1.100:3000
```

### QR Kodların URL'lerini Güncelleme
QR kodlarınızın farklı cihazlarda çalışması için, QR kodlar oluşturulurken kullanılan URL'lerin yerel IP adresinizi içermesi gerekir.

1. QR Codes sayfasına gidin
2. Yeni bir QR kod oluşturun 
3. Oluşturulan QR kodu telefonunuzla test edin

## 4. Firewall (Güvenlik Duvarı) Ayarları

Eğer Windows Güvenlik Duvarı veya başka bir güvenlik yazılımı kullanıyorsanız, 3000 ve 5000 numaralı portlara gelen bağlantılara izin vermeniz gerekebilir:

1. Windows Güvenlik Duvarını açın
2. "Gelişmiş Ayarlar" > "Gelen Kurallar" > "Yeni Kural"
3. "Port" seçeneğini seçin > "İleri"
4. "TCP" seçin ve "Belirli yerel portlar" kutusuna "3000,5000" yazın
5. "İzin ver" seçeneğini seçin ve kuralı tamamlayın

## 5. Sorun Giderme

1. **QR Kodu Taranamıyor**: QR kodunuzun yeterince büyük ve net olduğundan emin olun. İndirip yazdırabilirsiniz.

2. **Bağlantı Hatası**: Adresi tarayıcınıza yazarak test edin. Çalışmıyorsa:
   - Güvenlik duvarı ayarlarını kontrol edin
   - Her iki uygulamanın (backend ve frontend) çalıştığından emin olun
   - IP adresinizin doğru olduğunu kontrol edin

3. **404 Hatası**: Menü bulunamıyorsa:
   - QR kodun doğru oluşturulduğundan emin olun
   - Backend'in düzgün çalıştığından emin olun

## 6. İnternet Üzerinden Erişim (Opsiyonel)

Eğer sisteminize internet üzerinden erişmek istiyorsanız, şunları düşünebilirsiniz:

1. **Port Yönlendirme**: Modem/router'ınızda 3000 ve 5000 portlarını yerel IP adresinize yönlendirin.
2. **Dinamik DNS Hizmeti**: No-IP veya DynDNS gibi bir hizmet kullanarak sabit bir domain adı alın.
3. **Hosting Hizmeti**: Sisteminizi Heroku, Netlify, Vercel gibi bir bulut hizmetine deploy edin.

> **Güvenlik Uyarısı**: İnternet üzerinden erişim sağlamak, sisteminizi güvenlik risklerine açar. Gerekli güvenlik önlemlerini almadan bu seçeneği kullanmanız tavsiye edilmez. 