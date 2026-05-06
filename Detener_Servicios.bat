@echo off
title Detener Servicios RFID
taskkill /F /IM node.exe /T 2>nul
echo Servicios detenidos.
pause
