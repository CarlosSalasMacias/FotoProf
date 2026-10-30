import type { GeneratorOptions, MimeType } from '../types';
import { buildPrompt, sanitizeOptions } from '../promptBuilder';

// Modelo de imagen de Gemini. Cámbialo aquí si Google lo retira o renombra.
export const MODEL = 'gemini-3.1-flash-image';

/** Error con mensaje para el usuario y el detalle técnico que devolvió Google. */
export class GeminiError extends Error {
  constructor(
    message: string,
    public detail?: string,
    /** La clave está en el nivel gratuito, que no incluye generación de imágenes. */
    public needsBilling = false,
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

/** Extrae el texto útil del error de Google (suele venir como JSON dentro del mensaje). */
function extractDetail(raw: string): string {
  const match = raw.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  const text = match ? match[1].replace(/\\n/g, ' ').replace(/\\"/g, '"') : raw;
  return text.length > 600 ? text.slice(0, 600) + '…' : text;
}

/** Traduce los errores de la API de Gemini a mensajes comprensibles. */
function toGeminiError(error: unknown): GeminiError {
  const status = (error as { status?: number })?.status;
  const raw = error instanceof Error ? error.message : String(error);
  const detail = extractDetail(raw);

  if (status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(raw)) {
    // "limit: 0" = el modelo no tiene cuota gratuita: esperar no sirve, hace falta facturación.
    if (/limit:\s*0\b|free_tier|FreeTier/i.test(raw)) {
      return new GeminiError(
        'Tu clave está en el nivel gratuito de Google, que no incluye la generación de imágenes. Para usar esta app tienes que activar la facturación en tu proyecto de Google AI Studio.',
        detail,
        true,
      );
    }
    return new GeminiError(
      'Has hecho demasiadas solicitudes seguidas o se agotó tu cuota. Espera un minuto y vuelve a intentarlo.',
      detail,
    );
  }
  if (status === 400 && /api key|API_KEY/i.test(raw)) {
    return new GeminiError('La clave de API no es válida. Revísala en el apartado "Clave de Gemini".', detail);
  }
  if (status === 401 || status === 403) {
    return new GeminiError(
      'Tu clave de API no tiene permiso para usar este modelo. Comprueba que la facturación esté activa en Google AI Studio.',
      detail,
      true,
    );
  }
  if (status === 404) {
    return new GeminiError(`El modelo "${MODEL}" ya no está disponible. Hay que actualizar la app con un modelo vigente.`, detail);
  }
  if (status === 500 || status === 503) {
    return new GeminiError('El servicio de Gemini está saturado. Inténtalo de nuevo en unos segundos.', detail);
  }
  if (/Failed to fetch|NetworkError|network/i.test(raw)) {
    return new GeminiError('No se pudo conectar con Gemini. Revisa tu conexión a internet.', detail);
  }
  return new GeminiError('Ocurrió un error inesperado al generar la imagen. Inténtalo de nuevo.', detail);
}

/**
 * Llama a Gemini directamente desde el navegador con la clave del usuario.
 * GitHub Pages no tiene servidor, así que la clave nunca sale del dispositivo
 * salvo hacia la API de Google.
 */
export async function generateHeadshot(
  apiKey: string,
  base64Image: string,
  mimeType: MimeType,
  rawOptions: GeneratorOptions,
  signal?: AbortSignal,
): Promise<string> {
  const options = sanitizeOptions(rawOptions);
  let response;
  try {
    // Se carga solo al generar: la primera visita es más rápida en el móvil.
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [{ inlineData: { data: base64Image, mimeType } }, { text: buildPrompt(options) }],
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: { aspectRatio: options.aspectRatio },
        abortSignal: signal,
      },
    });
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Cancelado', 'AbortError');
    console.error('Error de la API de Gemini:', error);
    throw toGeminiError(error);
  }

  if (response.promptFeedback?.blockReason) {
    throw new Error('La IA rechazó la foto por sus filtros de seguridad. Prueba con otra foto donde se vea claramente el rostro.');
  }

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find((p) => p.inlineData?.data);
  if (imagePart?.inlineData) {
    return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
  }

  console.warn('Respuesta sin imagen. finishReason:', candidate?.finishReason);
  if (/SAFETY|PROHIBITED|BLOCK/i.test(String(candidate?.finishReason ?? ''))) {
    throw new Error('La IA no generó la imagen por sus filtros de seguridad. Prueba con otra foto u otras opciones.');
  }
  throw new Error('La IA no devolvió ninguna imagen. Vuelve a intentarlo; si se repite, usa una foto más clara y de frente.');
}
