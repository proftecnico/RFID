@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo =============================================
echo    RFID UHF - Sistema de Control de Activos
echo    Instalador v1.0
echo =============================================
echo.

:: Obtener la ruta donde esta el instalador
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

:: Obtener ruta de instalacion
set "DEFAULT_PATH=%USERPROFILE%\RFID-UHF"
set /p INSTALL_PATH="Ruta de instalacion [%DEFAULT_PATH%]: "
if "%INSTALL_PATH%"=="" set "INSTALL_PATH=%DEFAULT_PATH%"

echo.
echo Instalando en: %INSTALL_PATH%
echo.

:: Crear directorio si no existe
if not exist "%INSTALL_PATH%" (
    mkdir "%INSTALL_PATH%" 2>nul
    if errorlevel 1 (
        echo ERROR: No se pudo crear el directorio.
        echo Intenta ejecutar como Administrador.
        pause
        exit /b 1
    )
)

:: Copiar archivos
echo Copiando archivos del panel web...
xcopy /E /I /Y /Q "%SCRIPT_DIR%\web-app" "%INSTALL_PATH%\web-app" >nul 2>&1

echo Copiando archivos del emulador...
xcopy /E /I /Y /Q "%SCRIPT_DIR%\rfid-bridge" "%INSTALL_PATH%\rfid-bridge" >nul 2>&1

echo Copiando documentacion...
if exist "%SCRIPT_DIR%\TAGS*" (
    xcopy /E /I /Y /Q "%SCRIPT_DIR%\TAGS*" "%INSTALL_PATH%\documentacion" >nul 2>&1
)

echo Copiando manual...
copy /Y "%SCRIPT_DIR%\MANUAL.md" "%INSTALL_PATH%\MANUAL.md" >nul 2>&1

echo.
echo Archivos copiados.

:: Verificar Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js no esta instalado.
    echo Descargalo de: https://nodejs.org
    echo.
    start https://nodejs.org
    pause
    exit /b 1
)

for /f "delims=" %%v in ('node -v') do set "NODE_VER=%%v"
echo Node.js encontrado: %NODE_VER%

:: Instalar dependencias del panel web
echo.
echo Instalando dependencias del panel web (esto puede tardar)...
cd /d "%INSTALL_PATH%\web-app"
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Fallo la instalacion de dependencias del panel.
    pause
    exit /b 1
)
echo Panel web configurado.

:: Instalar dependencias del bridge
echo.
echo Instalando dependencias del emulador...
cd /d "%INSTALL_PATH%\rfid-bridge"
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Fallo la instalacion de dependencias del emulador.
    pause
    exit /b 1
)
echo Emulador configurado.

:: Generar cliente Prisma y base de datos
echo.
echo Configurando base de datos...
cd /d "%INSTALL_PATH%\web-app"
call npx prisma generate
call npx prisma db push
echo Base de datos lista.

:: Crear usuario admin
echo.
echo Creando usuario administrador...
call npx tsx scripts/seed-admin.ts
echo Admin creado.

:: Crear archivos de acceso rapido
echo.
echo Creando accesos directos...

:: Panel web
(
echo @echo off
echo title RFID UHF - Panel de Control
echo cd /d "%%~dp0web-app"
echo cls
echo echo.
echo echo =============================================
echo echo    RFID UHF - Panel de Control
echo echo =============================================
echo echo.
echo echo Iniciando servidor...
echo echo Abre tu navegador en: http://localhost:3000
echo echo.
echo echo Credenciales: admin / admin2026
echo echo.
echo start http://localhost:3000
echo npm run dev
) > "%INSTALL_PATH%\Iniciar_Panel.bat"

:: Emulador
(
echo @echo off
echo title RFID UHF - Emulador de Lecturas
echo cd /d "%%~dp0rfid-bridge"
echo cls
echo echo.
echo echo =============================================
echo echo    RFID UHF - Emulador de Lecturas
echo echo =============================================
echo echo.
echo echo Asegurate de que el Panel este corriendo.
echo echo Presiona Ctrl+C para detener.
echo echo.
echo npm run simulate
) > "%INSTALL_PATH%\Iniciar_Emulador.bat"

:: Archivo de detener todo
(
echo @echo off
echo title Detener Servicios RFID
echo taskkill /F /IM node.exe /T 2^>nul
echo echo Servicios detenidos.
echo pause
) > "%INSTALL_PATH%\Detener_Servicios.bat"

echo.
echo =============================================
echo    INSTALACION COMPLETADA
echo =============================================
echo.
echo Archivos instalados en: %INSTALL_PATH%
echo.
echo INSTRUCCIONES:
echo.
echo 1. Haz DOBLE CLIC en "Iniciar_Panel.bat"
echo    - Se abrira el navegador en http://localhost:3000
echo    - Inicia sesion con: admin / admin2026
echo.
echo 2. (Opcional) Abre otra terminal y ejecuta
echo    "Iniciar_Emulador.bat" para simular lecturas.
echo.
echo 3. Consulta "MANUAL.md" para mas informacion.
echo.
echo =============================================
echo.

set /p DUMMY="Presiona Enter para abrir la carpeta..."
explorer "%INSTALL_PATH%"

endlocal
