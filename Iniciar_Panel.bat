@echo off
title RFID UHF - Panel de Control
cd /d "%~dp0"
cls
echo.
echo =============================================
echo    RFID UHF - Panel de Control
echo =============================================
echo.
echo Iniciando servidor...
echo Abre tu navegador en: http://localhost:3000
echo.
echo Credenciales: admin / admin2026
echo.
start http://localhost:3000
npx next dev