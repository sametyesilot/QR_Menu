@echo off
echo QR Menu System - PowerShell Uyumlu Starter
echo -----------------------------------------

REM Node.js yolunu ayarla
set PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm

echo Node ve NPM sürümlerini kontrol ediyorum...
node -v
npm -v

REM Eğer node çalışmazsa bilgi ver
IF %ERRORLEVEL% NEQ 0 (
  echo Node.js bulunamadi! Lutfen Node.js'i yukleyin: https://nodejs.org/
  echo.
  echo Not: PowerShell'de && operatoru calismadigi icin bu dosyayi kullanin.
  pause
  exit /b
)

echo.
echo Projeyi baslatiyorum...
echo.

REM Ana dizinde olduğundan emin ol
cd /d %~dp0

REM Iki terminal penceresi ac ve uygulamalari baslatma
echo Backend baslatiliyor...
start cmd /k "cd backend & npm start"

echo Frontend baslatiliyor...
start cmd /k "cd frontend & npm start"

echo.
echo Backend ve frontend ayri pencerelerde baslatildi.
echo Tarayiciniz otomatik olarak acilacaktir.
echo Acilmazsa http://localhost:3000 adresini ziyaret edin.
echo.
echo Her iki terminal de kapatildiginda sistem durur.
echo.

pause 