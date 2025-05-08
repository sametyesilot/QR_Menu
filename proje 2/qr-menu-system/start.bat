@echo off
echo QR Menu Sistemi Baslatiliyor
echo ============================
echo.

:: Yolu doğru ayarla (npm ve node'u bulmak için)
SET PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm;%USERPROFILE%\AppData\Roaming\npm

:: Node.js sürümünü kontrol et
echo Node.js ve npm komutlarini kontrol ediyorum...
node -v
IF ERRORLEVEL 1 (
  echo.
  echo HATA: Node.js bulunamadi veya dogru calismiyor.
  echo.
  echo Lutfen Node.js'i indirip kurun: https://nodejs.org/
  echo Kurduktan sonra bilgisayarinizi yeniden baslatmaniz gerekebilir.
  echo.
  pause
  exit /b 1
)

:: npm sürümünü kontrol et
npm -v
IF ERRORLEVEL 1 (
  echo.
  echo HATA: npm bulunamadi veya dogru calismiyor.
  echo.
  echo Lutfen Node.js'i kaldirib tekrar kurun: https://nodejs.org/
  echo.
  pause
  exit /b 1
)

echo.
echo Node.js ve npm basariyla bulundu!
echo Uygulamayi baslatiyorum...
echo.

:: Ana dizinde olduğunu kontrol et
cd /d %~dp0

:: Backend'i başlat
echo Backend baslatiliyor...
start cmd /k "cd backend && npm run dev"

:: Frontend'i başlat
echo Frontend baslatiliyor...
start cmd /k "cd frontend && npm start"

echo.
echo Backend ve frontend baslatildi.
echo Tarayiciniz otomatik olarak acilacaktir.
echo Acilmazsa http://localhost:3000 adresini ziyaret edin.
echo.
echo Her iki terminal de kapatildiginda sistem durur.
echo.

pause 