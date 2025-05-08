@echo off
echo QR Menu Sistem - IP Kontrol ve Ayarlama Araci
echo ====================================
echo.

echo Yerel Ag IP Adresleri Tespit Ediliyor...
echo.

ipconfig | findstr /i "IPv4" > temp_ip.txt
type temp_ip.txt

echo.
echo Bu IP adreslerinden birini QR kodlarin olusturulmasi icin kullanmalisiniz.
echo.

SET /p IP="Kullanilacak IP adresini girin (ornek: 192.168.1.100): "
del temp_ip.txt

echo.
echo Girilen IP: %IP%
echo.

REM IP bilgisini dosyaya kaydet
echo %IP% > qr-menu-system\frontend\src\ip_config.txt

echo IP adresi kaydedildi: %IP%
echo.
echo Bu IP adresi QR olusturma sayfasinda otomatik olarak kullanilacak.
echo.
echo QR Kodlar test etme adimları:
echo 1. Bu bilgisayarda sistemin calistigina emin olun
echo 2. Baska bir cihazda (telefon veya tablet) bu URL'i acarak test edin:
echo.
echo    http://%IP%:3000
echo.
echo 3. Bu adres acilabiliyorsa, QR kodlar da diger cihazlarda calışacaktir.
echo.
echo Onemli Not: Eger bu adres calismiyorsa:
echo - Windows Guvenlik Duvarinda 3000 ve 5000 portlarini acin 
echo - Eger bir ag guvenligi varsa, bu portlara izin veriliyor oldugundan emin olun
echo.
echo DIGER_CIHAZLARDAN_ERISIM.md dosyasinda detayli ayarlar bulunmaktadir.
echo.

pause 