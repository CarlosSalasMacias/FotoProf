import React from 'react';
import type { GeneratorOptions, Gender, Option } from '../types';
import {
  GENDERS,
  ATTIRE_TYPES,
  SUIT_COLORS_MASCULINO,
  SUIT_COLORS_FEMENINO,
  SHIRT_COLORS,
  TIE_COLORS,
  BACKGROUND_COLORS,
  ACCESSORIES,
  FRAMING_OPTIONS,
  PROFESSIONS,
  INFORMAL_ATTIRE_OPTIONS,
  INFORMAL_COLORS,
  UNDERLAYER_TYPES,
  UNDERLAYER_COLORS,
  ASPECT_RATIOS,
} from '../constants';

interface ControlPanelProps {
  options: GeneratorOptions;
  setOptions: React.Dispatch<React.SetStateAction<GeneratorOptions>>;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  isImageUploaded: boolean;
  isImageGenerated: boolean;
  /** 2 en tablet para aprovechar el ancho. */
  columns?: 1 | 2;
  /** En móvil el botón principal está en una barra fija aparte. */
  hideSubmit?: boolean;
}

const SelectInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  id: string;
}> = ({ label, value, onChange, options, id }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {/* text-base (16px) evita que iOS haga zoom al tocar el selector */}
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-base lg:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="col-span-full text-xs font-semibold uppercase tracking-wide text-gray-400 pt-2">{children}</h3>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  setOptions,
  onSubmit,
  onCancel,
  isLoading,
  isImageUploaded,
  isImageGenerated,
  columns = 1,
  hideSubmit = false,
}) => {
  const handleChange = (field: keyof GeneratorOptions) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptions((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gender = e.target.value as Gender;
    setOptions((prev) => ({
      ...prev,
      gender,
      suitColor: gender === 'femenino' ? SUIT_COLORS_FEMENINO[0].value : SUIT_COLORS_MASCULINO[0].value,
      accessory: 'ninguno',
      tieColor: gender === 'masculino' ? prev.tieColor : 'ninguna',
    }));
  };

  const grid = columns === 2 ? 'grid grid-cols-2 gap-x-6 gap-y-4' : 'grid grid-cols-1 gap-y-4';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg space-y-5">
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-xl font-semibold text-neutral-dark">Personaliza tu retrato</h2>
        <p className="text-sm text-gray-500 mt-1">Ajusta los detalles para un resultado perfecto.</p>
      </div>

      <div className={grid}>
        <SectionTitle>Atuendo</SectionTitle>
        <SelectInput id="gender" label="Sexo" value={options.gender} onChange={handleGenderChange} options={GENDERS} />
        <SelectInput
          id="attireType"
          label="Tipo de atuendo"
          value={options.attireType}
          onChange={handleChange('attireType')}
          options={ATTIRE_TYPES}
        />

        {options.attireType === 'profesion' && (
          <SelectInput
            id="profession"
            label="Profesión"
            value={options.profession}
            onChange={handleChange('profession')}
            options={PROFESSIONS}
          />
        )}

        {options.attireType === 'informal' && (
          <>
            <SelectInput
              id="informalAttire"
              label="Prenda principal"
              value={options.informalAttire}
              onChange={handleChange('informalAttire')}
              options={INFORMAL_ATTIRE_OPTIONS}
            />
            <SelectInput
              id="informalColor"
              label="Color de la prenda"
              value={options.informalColor}
              onChange={handleChange('informalColor')}
              options={INFORMAL_COLORS}
            />
            <SelectInput
              id="underlayerType"
              label="Prenda debajo"
              value={options.underlayerType}
              onChange={handleChange('underlayerType')}
              options={UNDERLAYER_TYPES}
            />
            {options.underlayerType !== 'ninguna' && (
              <SelectInput
                id="underlayerColor"
                label="Color de la prenda de abajo"
                value={options.underlayerColor}
                onChange={handleChange('underlayerColor')}
                options={UNDERLAYER_COLORS}
              />
            )}
          </>
        )}

        {options.attireType === 'personalizado' && (
          <>
            <SelectInput
              id="suitColor"
              label="Color del traje"
              value={options.suitColor}
              onChange={handleChange('suitColor')}
              options={options.gender === 'femenino' ? SUIT_COLORS_FEMENINO : SUIT_COLORS_MASCULINO}
            />
            <SelectInput
              id="shirtColor"
              label="Color de camisa / blusa"
              value={options.shirtColor}
              onChange={handleChange('shirtColor')}
              options={SHIRT_COLORS}
            />
            {options.gender === 'masculino' ? (
              <SelectInput
                id="tieColor"
                label="Corbata"
                value={options.tieColor}
                onChange={handleChange('tieColor')}
                options={TIE_COLORS}
              />
            ) : (
              <SelectInput
                id="accessory"
                label="Accesorio"
                value={options.accessory}
                onChange={handleChange('accessory')}
                options={ACCESSORIES}
              />
            )}
          </>
        )}

        <SectionTitle>Foto</SectionTitle>
        <SelectInput
          id="framing"
          label="Encuadre"
          value={options.framing}
          onChange={handleChange('framing')}
          options={FRAMING_OPTIONS}
        />
        <SelectInput
          id="aspectRatio"
          label="Formato de la imagen"
          value={options.aspectRatio}
          onChange={handleChange('aspectRatio')}
          options={ASPECT_RATIOS}
        />
        <SelectInput
          id="backgroundColor"
          label="Fondo"
          value={options.backgroundColor}
          onChange={handleChange('backgroundColor')}
          options={BACKGROUND_COLORS}
        />
      </div>

      {!hideSubmit && (
        <div className="space-y-3 pt-2">
          <button
            onClick={onSubmit}
            disabled={isLoading || !isImageUploaded}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </>
            ) : isImageGenerated ? (
              'Generar de nuevo con estas opciones'
            ) : (
              'Generar retrato'
            )}
          </button>
          {isLoading && (
            <button onClick={onCancel} className="w-full text-sm font-medium text-gray-500 hover:text-red-600 underline transition-colors">
              Cancelar
            </button>
          )}
          {!isImageUploaded && (
            <p className="text-center text-xs text-yellow-700 bg-yellow-50 p-2 rounded-md">
              Sube una imagen para activar el botón de generar.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
