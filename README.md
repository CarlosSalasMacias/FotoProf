# FotoProf · Retratos profesionales con IA

Sube una foto (o hazla con la cámara), elige atuendo, fondo, encuadre y formato, y la app genera un retrato profesional con un modelo de imagen de Gemini.

**App publicada:** https://carlossalasmacias.github.io/FotoProf/

## Cómo funciona

- Es una web estática (React + Vite) publicada en GitHub Pages. No hay servidor.
- Cada persona usa **su propia clave de Gemini**, que pega en la app la primera vez. La clave se guarda solo en su navegador y solo se envía a Google. Se consigue gratis en https://aistudio.google.com/apikey
- La interfaz detecta el dispositivo y se adapta:
  - **Móvil:** una columna, botón "Generar" fijo abajo, cámara nativa del teléfono y botón para guardar en la galería o compartir.
  - **Tablet:** foto y resultado lado a lado, opciones en dos columnas debajo.
  - **Ordenador:** tres columnas, cámara web y descarga directa.

## Publicar

Cada `push` a `main` publica automáticamente con GitHub Actions (`.github/workflows/deploy.yml`).
La primera vez hay que activar Pages: **Settings → Pages → Source: GitHub Actions**.

## Ejecutar en local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000 y pega tu clave de Gemini.

## Estructura

- `App.tsx`: estado principal y distribución según el dispositivo.
- `hooks/useDevice.ts`: detecta móvil, tablet u ordenador, orientación y pantalla táctil.
- `services/geminiService.ts`: llamada a Gemini y mensajes de error. Aquí se cambia el modelo (`MODEL`).
- `promptBuilder.ts`: valida las opciones y construye el prompt.
- `constants.ts`: listas de opciones (trajes, colores, fondos...) y valores por defecto.
- `utils/image.ts`: reduce y comprime la foto antes de enviarla.
- `components/`: interfaz.
