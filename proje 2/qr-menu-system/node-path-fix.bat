@echo off
echo QR Menu Sistemi - Node.js PATH Duzeltme
echo ====================================
echo.

echo Node.js PATH ayari duzeltiliyor...
echo Bu islem Node.js'in gecici olarak PATH'e eklenmesini saglar.
echo.

set "PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm"
echo PATH guncellendi.
echo.

echo Node.js versiyonu kontrol ediliyor...
node --version
echo.

echo NPM versiyonu kontrol ediliyor...
npm --version
echo.

echo Komut istemini kapatmayin! 
echo Yeni bir Komut Istemi (CMD) penceresi acip uygulamayi baslatmak icin:
echo - run-backend.bat
echo - run-frontend.bat
echo Dosyalarini calistirin veya start-cmd.bat ile tum sistemi baslatabilirsiniz.
echo.
echo Bilgisayarinizi yeniden baslattiginizda bu islemi tekrarlamaniz gerekebilir.
echo.

pause 