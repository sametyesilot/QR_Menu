@echo off
echo QR Menu Sistemi Baslatiliyor (CMD)
echo ==============================
echo.

:: Backend'i calistir
echo Backend baslatiliyor...
start cmd /k "cd backend && npm run dev"

:: Frontend'i calistir
echo Frontend baslatiliyor...
start cmd /k "cd frontend && npm start"

echo.
echo Backend ve frontend baslatildi.
echo Tarayiciniz otomatik olarak acilacaktir.
echo Acilmazsa http://localhost:3000 adresini ziyaret edin.
echo.
echo Her iki terminal de kapatildiginda sistem durur.
echo. 