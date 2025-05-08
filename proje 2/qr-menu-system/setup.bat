@echo off
echo QR Menu Sistemi Kurulum ve Calistirma
echo ======================================
echo.

:: Backend .env dosyasini olustur
echo PORT=5000 > backend\.env
echo JWT_SECRET=qrmenu_secret_key_secure_2023 >> backend\.env 
echo MONGO_URI=mongodb+srv://sametbabawt33:sametbabawt33@proje1.2le8brq.mongodb.net/qrmenu?retryWrites=true^&w=majority >> backend\.env
echo NODE_ENV=development >> backend\.env

:: Backend bagimliliklarini yukle
echo Backend bagimliliklari yukleniyor...
cd backend
call npm install
cd ..

:: Frontend bagimliliklarini yukle
echo Frontend bagimliliklari yukleniyor...
cd frontend
call npm install
cd ..

echo.
echo Kurulum tamamlandi!
echo.
echo Projeyi calistirmak icin:
echo 1. start.bat dosyasini calistirin
echo 2. Tarayicinizda http://localhost:3000 adresine gidin
echo.
echo Not: NPM veya Node.js yuklu degilse, once bunlari yuklemeniz gerekir.
echo Node.js indirme sayfasi: https://nodejs.org/
echo.
pause 