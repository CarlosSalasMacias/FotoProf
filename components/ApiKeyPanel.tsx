import React, { useState } from 'react';

interface ApiKeyPanelProps {
  apiKey: string;
  onSave: (key: string, remember: boolean) => void;
}

export const ApiKeyPanel: React.FC<ApiKeyPanelProps> = ({ apiKey, onSave }) => {
  const [isEditing, setIsEditing] = useState(!apiKey);
  const [draft, setDraft] = useState(apiKey);
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);

  if (apiKey && !isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-6 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-green-700">
          <span aria-hidden="true">✓ </span>Clave de Gemini guardada en este dispositivo
        </p>
        <div className="flex gap-4 text-sm">
          <button onClick={() => setIsEditing(true)} className="text-brand-secondary underline py-1">
            Cambiar
          </button>
          <button
            onClick={() => {
              setDraft('');
              onSave('', false);
              setIsEditing(true);
            }}
            className="text-gray-500 hover:text-red-600 underline py-1"
          >
            Borrar
          </button>
        </div>
      </div>
    );
  }

  const trimmed = draft.trim();
  return (
    <form
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 space-y-3 border-l-4 border-brand-secondary"
      onSubmit={(e) => {
        e.preventDefault();
        if (!trimmed) return;
        onSave(trimmed, remember);
        setIsEditing(false);
      }}
    >
      <div>
        <h2 className="text-lg font-semibold">Clave de Gemini</h2>
        <p className="text-sm text-gray-600 mt-1">
          La app usa tu propia clave gratuita de Google.{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-secondary underline"
          >
            Consíguela aquí
          </a>{' '}
          y pégala abajo. Se guarda solo en tu navegador y solo se envía a Google.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <input
            type={show ? 'text' : 'password'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="AIza..."
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Clave de API de Gemini"
            className="block w-full px-3 py-3 pr-20 bg-white border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500"
          >
            {show ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        <button
          type="submit"
          disabled={!trimmed}
          className="px-5 py-3 rounded-md text-white bg-brand-primary hover:bg-blue-800 disabled:bg-gray-400 font-medium"
        >
          Guardar
        </button>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4"
        />
        Recordar en este dispositivo (desmárcalo en ordenadores compartidos)
      </label>
    </form>
  );
};
