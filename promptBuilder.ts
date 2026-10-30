import type { GeneratorOptions, Option } from './types';
import {
  ACCESSORIES,
  ASPECT_RATIOS,
  ATTIRE_TYPES,
  BACKGROUND_COLORS,
  DEFAULT_OPTIONS,
  FRAMING_OPTIONS,
  GENDERS,
  INFORMAL_ATTIRE_OPTIONS,
  INFORMAL_COLORS,
  PROFESSIONS,
  SHIRT_COLORS,
  SUIT_COLORS_FEMENINO,
  SUIT_COLORS_MASCULINO,
  TIE_COLORS,
  UNDERLAYER_COLORS,
  UNDERLAYER_TYPES,
} from './constants';

const ALLOWED: Record<keyof GeneratorOptions, Option[]> = {
  gender: GENDERS,
  attireType: ATTIRE_TYPES,
  profession: PROFESSIONS,
  suitColor: [...SUIT_COLORS_MASCULINO, ...SUIT_COLORS_FEMENINO],
  shirtColor: SHIRT_COLORS,
  tieColor: TIE_COLORS,
  accessory: ACCESSORIES,
  informalAttire: INFORMAL_ATTIRE_OPTIONS,
  informalColor: INFORMAL_COLORS,
  underlayerType: UNDERLAYER_TYPES,
  underlayerColor: UNDERLAYER_COLORS,
  backgroundColor: BACKGROUND_COLORS,
  framing: FRAMING_OPTIONS,
  aspectRatio: ASPECT_RATIOS,
};

/**
 * Acepta solo valores de las listas predefinidas. Así nadie puede inyectar
 * texto arbitrario en el prompt llamando directamente a la API.
 */
export function sanitizeOptions(raw: unknown): GeneratorOptions {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const result = { ...DEFAULT_OPTIONS };
  for (const key of Object.keys(ALLOWED) as (keyof GeneratorOptions)[]) {
    const value = input[key];
    if (value === undefined) continue;
    if (typeof value !== 'string' || !ALLOWED[key].some((o) => o.value === value)) {
      throw new Error(`Opción no válida: ${key}`);
    }
    (result as Record<string, string>)[key] = value;
  }
  return result;
}

function labelOf(list: Option[], value: string): string {
  return list.find((o) => o.value === value)?.label ?? value;
}

const LEATHER_JACKET_DETAILS =
  'Detalles obligatorios de la chaqueta (tipo cafe racer): 1) cuello mandarín corto con botón de presión metálico; ' +
  '2) dos cremalleras horizontales plateadas en el pecho; 3) dos cremalleras verticales plateadas en los costados a la altura de la cintura; ' +
  '4) costuras acolchadas horizontales visibles solo en la parte superior de los hombros. No añadas solapas grandes.';

function describeAttire(o: GeneratorOptions): string {
  const isMale = o.gender === 'masculino';

  if (o.attireType === 'profesion') {
    const profession = labelOf(PROFESSIONS, o.profession);
    return `Viste a la persona con el uniforme o atuendo profesional típico de ${isMale ? 'un' : 'una'} ${profession} (${isMale ? 'versión masculina' : 'versión femenina'}). Debe verse impecable, realista y con las texturas propias de esa profesión.`;
  }

  if (o.attireType === 'informal') {
    const layer =
      o.underlayerType !== 'ninguna'
        ? `Por debajo lleva una ${o.underlayerType} de color ${o.underlayerColor}, visible donde la prenda principal lo permita.`
        : 'No se ve ninguna prenda adicional debajo.';
    const extra = o.informalAttire.includes('chaqueta de cuero') ? LEATHER_JACKET_DETAILS : '';
    return `Estilo informal y cuidado. Prenda principal: ${o.informalAttire}, de color ${o.informalColor}. ${layer} ${extra} Reproduce la textura real del material con un ajuste natural.`;
  }

  const suit = isMale ? 'un traje formal' : 'un blazer o traje ejecutivo';
  const top = isMale ? 'camisa' : 'blusa';
  const extra = isMale
    ? o.tieColor !== 'ninguna'
      ? `, con corbata ${o.tieColor}`
      : ', sin corbata (cuello de la camisa abierto de forma elegante)'
    : o.accessory !== 'ninguno'
      ? `, acompañado de ${o.accessory}`
      : '';
  return `Viste a la persona con ${suit} de color ${o.suitColor} y una ${top} de color ${o.shirtColor}${extra}. La ropa debe verse bien planchada, con buen ajuste y tejidos realistas.`;
}

function describeBackground(background: string): string {
  const isStudio = labelOf(BACKGROUND_COLORS, background).startsWith('Estudio');
  return isStudio
    ? `Fondo de estudio fotográfico liso de color ${background}, uniforme y sin objetos. Iluminación de estudio suave tipo softbox que favorezca el rostro.`
    : `Sustituye el fondo por ${background}. El fondo debe quedar desenfocado (poca profundidad de campo) para que la persona destaque. La luz sobre la persona debe ser coherente con ese entorno.`;
}

export function buildPrompt(options: GeneratorOptions): string {
  return `
TAREA: Edita la foto adjunta para convertirla en un retrato profesional de alta calidad de la MISMA persona.

INSTRUCCIONES:
1. IDENTIDAD (lo más importante): conserva exactamente el rostro de la persona: forma de la cara, ojos, nariz, boca, tono de piel, lunares, edad, peinado y color de pelo. Debe ser 100% reconocible. No la embellezcas ni cambies sus rasgos. Si lleva gafas, mantenlas.
2. ATUENDO: ${describeAttire(options)}
3. FONDO E ILUMINACIÓN: ${describeBackground(options.backgroundColor)}
4. ENCUADRE: ${options.framing} La persona mira a cámara con una postura natural y segura.
5. CALIDAD: aspecto de fotografía real tomada con cámara profesional y objetivo de retrato, piel con textura natural, enfoque nítido en los ojos. Sin aspecto de ilustración, sin texto, sin marcas de agua.

Devuelve únicamente la imagen editada.
`.trim();
}
