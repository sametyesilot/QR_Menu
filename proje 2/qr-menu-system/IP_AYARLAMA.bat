@echo off
echo QR Menu Sistem - IP Ayarlama Araci
echo ====================================
echo.

REM Yerel IP adresini bul
echo Yerel IP adresiniz tespit ediliyor...
ipconfig | findstr /i "IPv4" > temp_ip.txt

echo Tespit edilen IP adresleri:
type temp_ip.txt
echo.

SET /p IP="Kullanilacak IP adresini girin (ornek: 192.168.1.100): "
del temp_ip.txt

echo.
echo Secilen IP adresi: %IP%
echo.

REM IP ayarlarini bir dosyaya kaydet
echo %IP% > ip_config.txt

echo QR Kodlar ve erisim ayarlari icin %IP% adresi kullanilacak.
echo Bu IP adresinin yerel aginizda gecerli oldugundan emin olun.
echo.
echo Sistemde bu IP kullanilarak QR Kodlar olusturulacak.
echo.
echo ONCEKI QR KODLARINIZ CIHAZ DEGISIKLIGINDE CALISMAYABILIR.
echo Yeniden baslatma sonrasi yeni QR kodlar olusturmaniz onerilir.
echo.

pause 