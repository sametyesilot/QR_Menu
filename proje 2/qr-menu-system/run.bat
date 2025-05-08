@echo off
echo QR Menu System - Basit Çalıştırma Scripti
echo ------------------------------------

REM Node.js yolunu ayarla
set PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm

echo Node ve NPM kontrol ediliyor...
node -v
IF %ERRORLEVEL% NEQ 0 (
  echo Node.js bulunamadı! Lütfen Node.js'i yükleyin: https://nodejs.org/
  pause
  exit /b
)

echo.
echo Projeyi başlatıyorum...
echo.

REM Ana dizinde olduğundan emin ol
cd /d %~dp0

REM Backend ve frontend ayrı pencerelerde başlat
start cmd /k "cd backend && npm start"
start cmd /k "cd frontend && npm start"

echo.
echo Backend ve frontend ayrı pencerelerde başlatıldı.
echo Tarayıcınız otomatik olarak açılacaktır.
echo Açılmazsa http://localhost:3000 adresini ziyaret edin.
echo.
echo Her iki terminal de kapatıldığında sistem durur.
echo.

pause 