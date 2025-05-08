@echo off
echo QR Menu Sistemi Kurulum - Yerel MongoDB ile
echo ==========================================
echo.

echo NOT: MongoDB Atlas kullanmak istiyorsaniz (onerilen), 
echo bu dosyayi kapatip setup.bat veya mongo-update.bat dosyasini calistirin.
echo Devam etmek icin herhangi bir tusa basin...
pause

:: Backend .env dosyasini olustur (yerel MongoDB baglantisinı kullan)
echo PORT=5000 > backend\.env
echo JWT_SECRET=qrmenu_secret_key_secure_2023 >> backend\.env 
echo MONGO_URI=mongodb://localhost:27017/qrmenu >> backend\.env
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
echo NOT: Bu kurulum yerel bir MongoDB veritabanı gerektirir.
echo MongoDB'nin bilgisayarınızda kurulu ve çalışır durumda olması gerekmektedir.
echo.
echo Projeyi çalıştırmak için:
echo 1. MongoDB'nin çalıştığından emin olun
echo 2. start.bat dosyasını çalıştırın
echo.
pause 