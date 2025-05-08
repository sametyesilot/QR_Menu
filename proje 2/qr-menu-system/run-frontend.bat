@echo off
echo QR Menü Sistemi - Frontend Başlatılıyor...
echo ====================================
echo.

cd frontend
echo Frontend klasorune giriliyor...
echo NPM ile frontend baslatiliyor...

REM Host 0.0.0.0 kullanarak dış bağlantılara izin ver
SET HOST=0.0.0.0
npm start -- --host 0.0.0.0

pause 