
export type Gender = 'masculino' | 'femenino';
export type MimeType = 'image/jpeg' | 'image/png' | 'image/webp';
export type AttireType = 'personalizado' | 'profesion' | 'informal';

export interface GeneratorOptions {
  gender: Gender;
  attireType: AttireType;
  profession: string;
  suitColor: string;
  shirtColor: string;
  tieColor: string;
  accessory: string;
  informalAttire: string;
  informalColor: string;
  underlayerType: 'ninguna' | 'camisa' | 'camiseta';
  underlayerColor: string;
  backgroundColor: string;
  framing: string;
  aspectRatio: string;
}

export interface Option {
    value: string;
    label: string;
}
