import type { MimeType } from '../types';

export interface PreparedImage {
  base64: string;
  mimeType: MimeType;
}

const MAX_SIDE = 1536;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error('No se pudo leer la imagen. Usa una foto en formato JPG, PNG o WEBP.'));
    img.src = src;
  });
}

/**
 * Reduce la foto a un tamaño razonable y la convierte a JPEG.
 * Las fotos de móvil pesan varios MB; enviarlas tal cual hacía fallar la petición
 * y además ralentiza la generación sin mejorar el resultado.
 */
export async function prepareImage(source: File | string): Promise<PreparedImage> {
  if (source instanceof File && !source.type.startsWith('image/')) {
    throw new Error('El archivo seleccionado no es una imagen.');
  }
  const url = source instanceof File ? URL.createObjectURL(source) : source;
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);
    if (width < 256 || height < 256) {
      throw new Error('La imagen es demasiado pequeña. Usa una foto de al menos 256×256 píxeles.');
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Tu navegador no pudo procesar la imagen.');
    ctx.fillStyle = '#ffffff'; // Fondo blanco para PNG con transparencia
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    return { base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' };
  } finally {
    if (source instanceof File) URL.revokeObjectURL(url);
  }
}
