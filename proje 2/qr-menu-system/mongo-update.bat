@echo off
echo QR Menu Sistemi - MongoDB Baglanti Ayarlari
echo ==========================================
echo.

:: Hazır bağlantı bilgileri
echo MongoDB bağlantı bilgileri ayarlanıyor...

echo PORT=5000 > backend\.env
echo JWT_SECRET=qrmenu_secret_key_secure_2023 >> backend\.env
echo MONGO_URI=mongodb+srv://sametbabawt33:sametbabawt33@proje1.2le8brq.mongodb.net/qrmenu?retryWrites=true^^^&w=majority >> backend\.env
echo NODE_ENV=development >> backend\.env

echo.
echo MongoDB bağlantı bilgileriniz başarıyla ayarlandı!
echo Şimdi projeyi start.bat ile çalıştırabilirsiniz.
echo.
pause 