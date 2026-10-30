
import type { GeneratorOptions, Option } from './types';

export const GENDERS: Option[] = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
];

export const ATTIRE_TYPES: Option[] = [
  { value: 'personalizado', label: 'Personalizado / Formal' },
  { value: 'profesion', label: 'Basado en Profesión' },
  { value: 'informal', label: 'Estilo Informal / Casual' },
];

export const PROFESSIONS: Option[] = [
  { value: 'abogado', label: 'Abogado(a)' },
  { value: 'agrónomo', label: 'Agrónomo(a)' },
  { value: 'artista', label: 'Artista / Pintor(a)' },
  { value: 'bartender', label: 'Bartender / Mixólogo(a)' },
  { value: 'biólogo', label: 'Biólogo(a)' },
  { value: 'bombero', label: 'Bombero(a)' },
  { value: 'chef', label: 'Chef / Cocinero(a)' },
  { value: 'científico', label: 'Científico / Laboratorista' },
  { value: 'corporativo', label: 'Corporativo / Ejecutivo' },
  { value: 'deportista', label: 'Deportista' },
  { value: 'ecólogo', label: 'Ecólogo(a)' },
  { value: 'enfermero', label: 'Enfermero / Enfermera' },
  { value: 'fisioterapeuta', label: 'Fisioterapeuta' },
  { value: 'futbolista', label: 'Futbolista' },
  { value: 'ingeniero', label: 'Ingeniero / Arquitecto(a)' },
  { value: 'maratonista', label: 'Maratonista' },
  { value: 'médico', label: 'Médico / Doctor(a)' },
  { value: 'músico', label: 'Músico(a) / Concertista' },
  { value: 'policía', label: 'Oficial de Policía' },
  { value: 'piloto', label: 'Piloto de Aerolínea' },
  { value: 'velocista', label: 'Velocista' },
];

export const INFORMAL_ATTIRE_OPTIONS: Option[] = [
  { value: 'un suéter de cuello V de lana fina', label: 'Suéter Cuello V' },
  { value: 'un suéter de cuello redondo clásico', label: 'Suéter Cuello Redondo' },
  { value: 'un suéter de cuello alto (turtleneck) elegante', label: 'Suéter Cuello Alto' },
  { value: 'un cárdigan de punto abierto', label: 'Cárdigan' },
  { value: 'una sudadera con capucha (hoodie) moderna', label: 'Sudadera con Capucha' },
  { value: 'una chaqueta de cuero negro de diseño exacto: estilo cafe racer ajustado, cuello mandarín pequeño con un botón de presión metálico, dos bolsillos horizontales con cremallera plateada en la parte superior del pecho (uno a cada lado), dos bolsillos verticales con cremallera en los costados a la altura de la cintura, y paneles acolchados con costuras estriadas horizontales muy definidas exclusivamente en la parte superior de los hombros. El cuero es negro premium, liso y con un brillo satinado.', label: 'Chaqueta de Cuero' },
  { value: 'una chaqueta de mezclilla (denim) clásica', label: 'Chaqueta de Mezclilla' },
  { value: 'una chaqueta Bomber minimalista', label: 'Chaqueta Bomber' },
  { value: 'una camisa tipo Polo de algodón premium', label: 'Camisa Polo' },
  { value: 'una camiseta básica de algodón', label: 'Camiseta Básica' },
];

export const INFORMAL_COLORS: Option[] = [
  { value: 'negro profundo', label: 'Negro' },
  { value: 'café chocolate envejecido', label: 'Café / Marrón' },
  { value: 'azul marino', label: 'Azul Marino' },
  { value: 'gris oxford', label: 'Gris Oscuro' },
  { value: 'gris melange', label: 'Gris Claro' },
  { value: 'beige arena', label: 'Beige' },
  { value: 'verde olivo', label: 'Verde Olivo' },
  { value: 'burdeos', label: 'Burdeos' },
  { value: 'blanco roto', label: 'Blanco / Crema' },
];

export const UNDERLAYER_TYPES: Option[] = [
  { value: 'ninguna', label: 'Ninguna (Solo prenda principal)' },
  { value: 'camisa', label: 'Camisa por debajo' },
  { value: 'camiseta', label: 'Camiseta por debajo' },
];

export const UNDERLAYER_COLORS: Option[] = [
  { value: 'blanca', label: 'Blanca' },
  { value: 'negra', label: 'Negra' },
  { value: 'gris claro', label: 'Gris Claro' },
  { value: 'azul celeste', label: 'Azul Celeste' },
  { value: 'azul marino', label: 'Azul Marino' },
];

export const SUIT_COLORS_MASCULINO: Option[] = [
  { value: 'azul marino', label: 'Azul Marino' },
  { value: 'beige', label: 'Beige' },
  { value: 'burdeos', label: 'Burdeos' },
  { value: 'gris claro', label: 'Gris Claro' },
  { value: 'gris oscuro', label: 'Gris Oscuro (Oxford)' },
  { value: 'marrón chocolate', label: 'Marrón Chocolate' },
  { value: 'negro', label: 'Negro Clásico' },
  { value: 'con patrón Príncipe de Gales', label: 'Príncipe de Gales' },
  { value: 'de tweed clásico', label: 'Tweed Clásico' },
  { value: 'verde botella', label: 'Verde Botella' },
];

export const SUIT_COLORS_FEMENINO: Option[] = [
  { value: 'negro clásico (tipo blazer)', label: 'Negro Clásico (Blazer)' },
  { value: 'blanco puro', label: 'Blanco Puro (Elegante)' },
  { value: 'rojo escarlata intenso', label: 'Rojo Escarlata' },
  { value: 'gris perla con solapa satinada', label: 'Gris Perla (Satín)' },
  { value: 'blanco marfil de crepé', label: 'Blanco Marfil (Crepé)' },
  { value: 'blanco con un vibrante estampado floral primaveral', label: 'Blanco con Estampado Floral' },
  { value: 'blanco con un elegante estampado floral en tonos azules', label: 'Blanco con Flores Azules' },
  { value: 'azul marino con un delicado estampado floral blanco', label: 'Azul Marino Floral' },
  { value: 'azul con un estampado de flores blancas y claras', label: 'Azul con Flores Blancas' },
  { value: 'negro con un estampado de flores blancas', label: 'Negro con Flores Blancas' },
  { value: 'de un sutil patrón floral sobre un fondo negro', label: 'Negro Floral Sutil' },
  { value: 'azul serenidad', label: 'Azul Serenidad (Pastel)' },
  { value: 'rosa cuarzo', label: 'Rosa Cuarzo (Pastel)' },
  { value: 'lila pastel', label: 'Lila (Pastel)' },
  { value: 'verde menta pastel', label: 'Verde Menta (Pastel)' },
  { value: 'amarillo pastel suave', label: 'Amarillo (Pastel Suave)' },
];

export const SHIRT_COLORS: Option[] = [
  { value: 'blanca', label: 'Blanca' },
  { value: 'blanca con una sutil textura de espiga', label: 'Blanca (con textura)' },
  { value: 'marfil', label: 'Marfil / Crema' },
  { value: 'champán', label: 'Champán' },
  { value: 'gris perla', label: 'Gris Perla' },
  { value: 'celeste', label: 'Azul Celeste' },
  { value: 'azul claro', label: 'Azul Claro' },
  { value: 'azul marino', label: 'Azul Marino' },
  { value: 'gris medio', label: 'Gris Medio (Plomo)' },
  { value: 'gris oscuro', label: 'Gris Oscuro (Grafito)' },
  { value: 'negra', label: 'Negra' },
  { value: 'rosa pálido', label: 'Rosa Pálido' },
  { value: 'salmón claro', label: 'Salmón Claro' },
  { value: 'vino', label: 'Vino / Borgoña' },
  { value: 'vino oscuro', label: 'Vino Oscuro' },
  { value: 'lila claro', label: 'Lila Claro' },
  { value: 'verde bosque', label: 'Verde Bosque' },
  { value: 'verde oliva', label: 'Verde Oliva' },
];

export const TIE_COLORS: Option[] = [
  { value: 'ninguna', label: 'Sin Corbata' },
  { value: 'azul marino liso', label: 'Azul Marino' },
  { value: 'beige seda', label: 'Beige' },
  { value: 'burdeos satinado', label: 'Burdeos' },
  { value: 'gris claro plateado', label: 'Gris Claro' },
  { value: 'gris oscuro grafito', label: 'Gris Oscuro' },
  { value: 'marrón chocolate de punto', label: 'Marrón Chocolate' },
  { value: 'negra minimalista', label: 'Negro' },
  { value: 'verde botella oscuro', label: 'Verde Botella' },
  { value: 'azul cobalto con patrón geométrico', label: 'Azul (Patrón Geométrico)' },
  { value: 'azul marino con rayas diagonales blancas', label: 'Azul (Rayas Blancas)' },
  { value: 'burdeos con micropuntos azules', label: 'Burdeos (Micropuntos)' },
  { value: 'dorada con textura de seda', label: 'Dorada (Textura Seda)' },
  { value: 'roja de seda', label: 'Roja (Poder)' },
  { value: 'verde esmeralda', label: 'Verde Esmeralda' },
];

export const ACCESSORIES: Option[] = [
  { value: 'ninguno', label: 'Ninguno' },
  { value: 'aretes de botón dorados', label: 'Aretes Dorados (Botón)' },
  { value: 'aretes de perla pequeños y discretos', label: 'Aretes de Perla' },
  { value: 'broche elegante en la solapa', label: 'Broche Elegante' },
  { value: 'collar de perlas clásico', label: 'Collar de Perlas' },
  { value: 'collar fino y elegante de plata', label: 'Collar Fino (Plata)' },
  { value: 'pañoleta discreta de seda', label: 'Pañoleta de Seda' },
];

export const FRAMING_OPTIONS: Option[] = [
    { value: 'Encuadre de retrato profesional estándar. Muestra la cabeza completa y los hombros de la persona. El corte inferior debe estar a la altura de la parte media del pecho. Debe haber un espacio de aire visible por encima de la cabeza. Este es el encuadre clásico para LinkedIn.', label: 'Retrato Clásico' },
    { value: 'Recorte extremadamente cerrado (extreme close-up) enfocado solo en los rasgos faciales. El encuadre debe cortar ligeramente la parte superior de la frente y la parte inferior de la barbilla, llenando el cuadro con los ojos, nariz y boca. El objetivo es la máxima intimidad y detalle facial.', label: 'Plano de Rostro' },
    { value: 'Utiliza un encuadre de plano medio que muestre a la persona desde la cintura hacia arriba. Este encuadre debe capturar parte del torso y el lenguaje corporal, ideal para un retrato corporativo más contextual.', label: 'Plano Medio' },
];

export const BACKGROUND_COLORS: Option[] = [
  { value: 'gris claro', label: 'Estudio: Gris Claro' },
  { value: 'blanco puro', label: 'Estudio: Blanco Puro' },
  { value: 'azul degradado', label: 'Estudio: Azul Degradado' },
  { value: 'beige', label: 'Estudio: Beige (Cálido)' },
  { value: 'gris oscuro', label: 'Estudio: Gris Oscuro' },
  { value: 'un restaurante elegante con iluminación ambiental cálida y personas cenando en el fondo, muy desenfocado con bokeh artístico', label: 'Entorno: Restaurante Elegante' },
  { value: 'un parque luminoso y soleado con árboles verdes y gente paseando a lo lejos, desenfocado con bokeh natural', label: 'Entorno: Parque' },
  { value: 'una calle urbana transitada con el tráfico de la ciudad y peatones cruzando en segundo plano, desenfocado con desenfoque de movimiento ligero', label: 'Entorno: Tráfico' },
  { value: 'una oficina moderna y minimalista con abundante luz natural, desenfocada', label: 'Oficina: Moderna (desenfocada)' },
  { value: 'una oficina de alta dirección con detalles en madera y vistas a la ciudad, desenfocada', label: 'Oficina: Gerencia (desenfocada)' },
  { value: 'una biblioteca clásica con estanterías de libros antiguos, desenfocada', label: 'Profesional: Biblioteca (desenfocada)' },
  { value: 'el interior de un hospital moderno, limpio y luminoso, desenfocado', label: 'Profesional: Hospital (desenfocado)' },
  { value: 'un paisaje urbano con los rascacielos de Nueva York al atardecer, desenfocado', label: 'Exterior: Nueva York (desenfocado)' },
  { value: 'un paisaje urbano con el skyline de Londres y el Támesis, desenfocado', label: 'Exterior: Londres (desenfocado)' },
  { value: 'un paisaje urbano nocturno de Tokio con luces de neón, desenfocado', label: 'Exterior: Tokio (desenfocado)' },
  { value: 'un paisaje natural sereno con montañas y un lago, desenfocado', label: 'Naturaleza: Montañas y Lago (desenfocado)' },
  { value: 'un jardín botánico frondoso con vegetación exuberante, desenfocado', label: 'Naturaleza: Jardín Botánico (desenfocado)' },
  { value: 'un interior de casa cálido y acogedor, con una decoración elegante y moderna, desenfocado', label: 'Interior: Hogar Elegante (desenfocado)' },
];

export const ASPECT_RATIOS: Option[] = [
  { value: '1:1', label: 'Cuadrado 1:1 (LinkedIn, redes)' },
  { value: '4:5', label: 'Vertical 4:5 (Instagram)' },
  { value: '3:4', label: 'Vertical 3:4 (CV, documentos)' },
  { value: '2:3', label: 'Vertical 2:3 (retrato clásico)' },
];

export const DEFAULT_OPTIONS: GeneratorOptions = {
  gender: 'masculino',
  attireType: 'personalizado',
  profession: 'corporativo',
  suitColor: SUIT_COLORS_MASCULINO[0].value,
  shirtColor: SHIRT_COLORS[0].value,
  tieColor: 'roja de seda',
  accessory: 'ninguno',
  informalAttire: INFORMAL_ATTIRE_OPTIONS[0].value,
  informalColor: INFORMAL_COLORS[0].value,
  underlayerType: 'ninguna',
  underlayerColor: UNDERLAYER_COLORS[0].value,
  backgroundColor: BACKGROUND_COLORS[0].value,
  framing: FRAMING_OPTIONS[0].value,
  aspectRatio: '1:1',
};
