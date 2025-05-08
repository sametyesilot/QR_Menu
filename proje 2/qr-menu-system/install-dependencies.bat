@echo off
echo QR Menu Sistemi - Bagimliliklari Kurma
echo =====================================
echo.

:: Node.js kontrolü
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo HATA: Node.js bulunamadi!
    echo Lutfen Node.js'i https://nodejs.org/ adresinden indirip kurun.
    echo Kurduktan sonra bu scripti tekrar calistirin.
    pause
    exit /b
)

:: NPM kontrolü
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo HATA: npm bulunamadi!
    echo Node.js'i dogru kurdugunuzdan ve PATH'e eklendiginden emin olun.
    pause
    exit /b
)

echo Node.js ve npm bulundu, devam ediliyor.
echo.

:: Backend bagimliliklarini kur
echo Backend bagimliliklari kuruluyor...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo HATA: Backend bagimliliklari kurulurken bir hata olustu!
    cd ..
    pause
    exit /b
)
cd ..
echo Backend bagimliliklari basariyla kuruldu.
echo.

:: Frontend bagimliliklarini kur
echo Frontend bagimliliklari kuruluyor...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo HATA: Frontend bagimliliklari kurulurken bir hata olustu!
    cd ..
    pause
    exit /b
)
cd ..
echo Frontend bagimliliklari basariyla kuruldu.
echo.

echo Tum bagimliliklar basariyla kuruldu!
echo Simdi 'start.bat' dosyasini calistirarak uygulamayi baslayabilirsiniz.
echo.
pause 