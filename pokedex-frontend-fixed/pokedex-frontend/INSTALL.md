# Cómo arrancar el frontend

## Requisitos
- **Node.js 20.x** (LTS) — descárgalo en https://nodejs.org/
  - Para comprobar tu versión: `node -v`  → debe mostrar `v20.x.x`
- **npm 10.x** (viene con Node 20)

## Pasos (primera vez o si algo falla)

```bash
# 1. Entrar en la carpeta del proyecto
cd pokedex-frontend

# 2. Borrar instalación anterior si existe (Windows)
rd /s /q node_modules
del package-lock.json

# En Mac/Linux:
# rm -rf node_modules package-lock.json

# 3. Instalar dependencias limpias
npm install

# 4. Arrancar
npm start
```

La app quedará en: http://localhost:4200

## Si sigues viendo errores de Vite en consola
No te preocupes — si ves el mensaje `➜ Local: http://localhost:4200/` la app funciona.
El error `Failed to update Vite client error overlay` es un aviso interno que no afecta al funcionamiento.

## El backend debe estar corriendo en http://localhost:8080
