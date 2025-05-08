@echo off
title QR Menu Sistem - Sorun Giderme Araci
color 0A
cls

echo QR Menu Sistemi - Sorun Giderme Araci
echo ====================================
echo.

echo Bu arac, QR Kod sorunlarini tespit etmenize ve cozmenize yardimci olacaktir.
echo.

:MENU
echo Lutfen yapmak istediginiz islemi secin:
echo [1] Sistem Durumunu Kontrol Et
echo [2] IP Adresini Kontrol Et ve Yenile
echo [3] QR Kodlari Yeniden Olustur
echo [4] Guvenlik Duvarini Kontrol Et
echo [5] Yerel Erisim Testi
echo [6] Cikis
echo.

set /p choice=Secim (1-6): 

if "%choice%"=="1" goto SYSTEM_CHECK
if "%choice%"=="2" goto IP_CHECK 
if "%choice%"=="3" goto RECREATE_QR
if "%choice%"=="4" goto FIREWALL_CHECK
if "%choice%"=="5" goto LOCAL_TEST
if "%choice%"=="6" goto EXIT
goto MENU

:SYSTEM_CHECK
cls
echo Sistem durumu kontrol ediliyor...
echo.

echo Backend servisi kontrol ediliyor...
netstat -ano | findstr :5000
if %ERRORLEVEL% EQU 0 (
  echo [OK] Backend servisi 5000 portunda calisiyor.
) else (
  echo [HATA] Backend servisi calismasi gerektiği halde calismiyor!
  echo Backend servisi baslatmak icin run-backend.bat dosyasini calistirin.
)

echo.
echo Frontend servisi kontrol ediliyor...
netstat -ano | findstr :3000
if %ERRORLEVEL% EQU 0 (
  echo [OK] Frontend servisi 3000 portunda calisiyor.
) else (
  echo [HATA] Frontend servisi calismasi gerektiği halde calismiyor!
  echo Frontend servisi baslatmak icin run-frontend.bat dosyasini calistirin.
)

echo.
pause
cls
goto MENU

:IP_CHECK
cls
echo IP Adresi Kontrolu ve Yapılandırma
echo ==================================
echo.

echo Yerel ag IP adresleriniz:
ipconfig | findstr /i "IPv4"
echo.

set /p custom_ip=Kullanmak istediginiz IP adresi (Ornegin 192.168.1.100): 

echo %custom_ip% > qr-menu-system\frontend\public\ip_config.txt
echo IP adresi %custom_ip% olarak kaydedildi.
echo.
echo Bu IP adresi kullanilarak QR kodlari yeniden olusturulabilir.
echo.
echo QR kodlarini bu IP adresi ile yeniden olusturmak icin Ana Menuye donun ve 3 numarali secenegi secin.
echo.

pause
cls
goto MENU

:RECREATE_QR
cls
echo QR Kodlari Yeniden Olusturma
echo ============================
echo.
echo UYARI: Bu islem mevcut QR kodlarinizi silecek ve yeni IP adresi kullanarak yeniden olusturacaktir.
echo Bu islem geri alinamaz!
echo.
set /p confirm=Devam etmek istiyor musunuz? (E/H): 

if /i "%confirm%"=="E" (
  echo.
  echo Lutfen tarayicinizda QR Kodlar sayfasina gidin ve yeni kodlar olusturun.
  echo QR kodlariniz yeni IP adresiniz kullanilarak olusturulacaktir.
  echo.
  echo Tarayicinizda QR kodlar sayfasi aciliyor...
  start http://localhost:3000/qr-codes
) else (
  echo Islem iptal edildi.
)

echo.
pause
cls
goto MENU

:FIREWALL_CHECK
cls
echo Guvenlik Duvari Kontrolu
echo =======================
echo.

echo Windows guvenlik duvari durumu kontrol ediliyor...
netsh advfirewall show currentprofile | findstr "State"

echo.
echo Port kontrolu yapiliyor...
echo.
echo 3000 numarali port (Frontend):
netsh advfirewall firewall show rule name=all | findstr /i "3000"

echo.
echo 5000 numarali port (Backend):
netsh advfirewall firewall show rule name=all | findstr /i "5000"

echo.
echo Guvenlik duvari ayarlari kontrol edildi.
echo Eger yukarida 3000 ve 5000 numarali portlar icin izin goremiyorsaniz,
echo bu portlara izin vermek istiyorsaniz, su komutu calistiracak bir dosya olusturabilirsiniz:
echo.
echo    netsh advfirewall firewall add rule name="QR Menu Frontend" dir=in action=allow protocol=TCP localport=3000
echo    netsh advfirewall firewall add rule name="QR Menu Backend" dir=in action=allow protocol=TCP localport=5000
echo.

pause
cls
goto MENU

:LOCAL_TEST
cls
echo Yerel Erisim Testi
echo =================
echo.

echo Yerel ag IP adresleriniz:
ipconfig | findstr /i "IPv4"
echo.

set /p test_ip=Test etmek istediginiz IP adresi: 

echo.
echo Frontend testi yapiliyor... (%test_ip%:3000)
ping -n 1 %test_ip% | findstr "TTL"
if %ERRORLEVEL% EQU 0 (
  echo [OK] IP adresine ping atilabiliyor.
  echo Tarayicinizda http://%test_ip%:3000 adresini acmayi deneyin.
  set /p browser_test=Tarayicida test etmek ister misiniz? (E/H): 
  if /i "%browser_test%"=="E" (
    start http://%test_ip%:3000
  )
) else (
  echo [HATA] IP adresine ping atilamiyor. Ag ayarlarinizi kontrol edin.
)

echo.
pause
cls
goto MENU

:EXIT
cls
echo Cikis yapiliyor...
echo.
echo QR Menü Sistemi Sorun Giderme Araci kapatiliyor.
echo Tesekkur ederiz!
echo.
echo Baska bir sorunuz varsa, lutfen DIGER_CIHAZLARDAN_ERISIM.md dosyasina bakin.
echo.
pause
exit 