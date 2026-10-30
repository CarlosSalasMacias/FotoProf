import type { GeneratorOptions, MimeType } from '../types';
import { buildPrompt, sanitizeOptions } from '../promptBuilder';

// Modelo de imagen de Gemini. Cámbialo aquí si Google lo retira o renombra.
export const MODEL = 'gemini-3.1-flash-image';

/** Traduce los errores de la API de Gemini a mensajes comprensibles. */
function toUserMessage(error: unknown): string {
  const status = (error as { status?: number })?.status;
  const raw = error instanceof Error ? error.message : String(error);
  if (status === 429 || /quota|rate limit|RESOURCE_EXHAUSTED/i.test(raw)) {
    return 'Se alcanzó el límite de uso de tu clave de Gemini. Espera un momento o revisa tu cuota en Google AI Studio.';
  }
  if (status === 400 && /api key|API_KEY/i.test(raw)) {
    return 'La clave de API no es válida. Revísala en el apartado "Clave de Gemini".';
  }
  if (status === 401 || status === 403) {
    return 'Tu clave de API no tiene permiso para usar este modelo. Comprueba que la facturación o el acceso estén activos en Google AI Studio.';
  }
  if (status === 404) {
    return `El modelo "${MODEL}" ya no está disponible. Hay que actualizar la app con un modelo vigente.`;
  }
  if (status === 500 || status === 503) {
    return 'El servicio de Gemini está saturado. Inténtalo de nuevo en unos segundos.';
  }
  if (/Failed to fetch|NetworkError|network/i.test(raw)) {
    return 'No se pudo conectar con Gemini. Revisa tu conexión a internet.';
  }
  return 'Ocurrió un error inesperado al generar la imagen. Inténtalo de nuevo.';
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
    throw new Error(toUserMessage(error));
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
