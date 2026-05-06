# RFID UHF - Sistema de Control de Activos

Sistema de monitoreo en tiempo real para lectura de etiquetas RFID UHF mediante antenas seriales o simulación.

---

## Requisitos Previos

- **Node.js 18+** - [Descargar aquí](https://nodejs.org)
- **Puerto 3000** disponible
- **Windows 10/11** (compatible con otros SO que soporten Node.js)

---

## Estructura del Proyecto

```
RFID-UHF/
├── web-app/          # Panel de control (Next.js)
├── rfid-bridge/      # Emulador de lecturas RFID
├── scripts/          # Scripts de utilidad
├── Iniciar_Panel.bat # Acceso directo al panel
├── Iniciar_Emulador.bat # Acceso directo al emulador
└── MANUAL.md         # Este archivo
```

---

## Instalacion Rapida

1. Ejecuta `Instalador.bat`
2. Ingresa la ruta donde deseas instalar (o presiona Enter para usar la predeterminada)
3. Espera a que se completen todos los pasos
4. Se crearan automaticamente los archivos `Iniciar_Panel.bat` e `Iniciar_Emulador.bat`

---

## Iniciar el Sistema

### Paso 1: Iniciar el Panel de Control

1. Haz **doble clic** en `Iniciar_Panel.bat`
2. Se abrira una ventana de comandos
3. Se iniciara el servidor y se abrira el navegador en `http://localhost:3000`
4. Inicia sesion con:
   - **Usuario:** `admin`
   - **Contraseña:** `admin2026`

### Paso 2: Iniciar el Emulador (opcional)

Si no tienes antenas RFID conectadas y quieres probar el sistema:

1. Abre **otra ventana de comandos**
2. Navega a la carpeta `rfid-bridge` o haz doble clic en `Iniciar_Emulador.bat`
3. Ejecuta: `npm run simulate`

El emulador enviara lecturas ficticias cada 5 segundos con EPCs de prueba.

---

## Modulos del Panel

### Monitor en Vivo (`/dashboard`)
- Vista en tiempo real de todas las lecturas RFID
- Columnas separadas para Entradas (Antena Interior P8) y Salidas (Antena Exterior P9)
- Indicador de conexion con el lector

### Reporte de Movimientos (`/dashboard/reports`)
- Historial completo de todas las lecturas
- Permite asignar un proveedor a cada movimiento
- Boton para exportar a Excel

### Etiquetas RFID (`/dashboard/tags`)
- Lista de todos los EPCs leidos
- Permite asignar cada tag a un tipo de contenedor (marca/modelo)

### Proveedores (`/dashboard/suppliers`)
- Catalogo de proveedores
- Agregar, ver y eliminar proveedores

### Marcas y Modelos (`/dashboard/containers`)
- Tipos de contenedores disponibles
- Ejemplo: "Contenur - Bilateral 3200L"

### Usuarios (`/dashboard/users`) - Solo Admin
- Gestion de usuarios del sistema
- Roles: Administrador (control total) y Operador (solo lectura)

---

## Si Tienes Antenas RFID Reales

1. Conecta las antenas a los puertos COM correspondientes
2. Edita el archivo `rfid-bridge/index.js`:
   ```javascript
   const ENTRY_PORT = 'COM8';    // Puerto de entrada
   const EXIT_PORT = 'COM9';     // Puerto de salida
   ```
3. Ejecuta `node index.js` en lugar de `npm run simulate`

---

## Solucion de Problemas

### Error: Puerto 3000 en uso
```bash
# Windows: encontrar y detener el proceso
netstat -ano | findstr :3000
taskkill /PID <NUMERO_PID> /F
```

### Error: Base de datos no existe
```bash
cd web-app
npx prisma db push
```

### Error: Modulos no encontrados
```bash
cd web-app
npm install

cd ../rfid-bridge
npm install
```

### Reiniciar todo desde cero
```bash
cd web-app
del dev.db
npx prisma db push
npx tsx scripts/seed-admin.ts
```

---

## Credenciales Predeterminadas

| Campo       | Valor          |
|-------------|----------------|
| Usuario     | admin          |
| Contraseña  | admin2026      |
| Puerto HTTP | localhost:3000  |

**IMPORTANTE:** Cambia la contrasena del admin despues del primer inicio de sesion.

---

## Contacto y Soporte

Para reportar problemas o sugerencias, consulta la documentacion en `TAGS 2026-03-27/`.

---

*Sistema desarrollado para control de activos mediante tecnologia RFID UHF*
