import React, { useCallback } from 'react';
import { Loader } from './Loader';
import type { GeminiError } from '../services/geminiService';

interface GeneratedImagePanelProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: GeminiError | null;
  onRegenerate: () => void;
  /** Móvil/tablet con menú nativo de compartir (permite "Guardar imagen" en la galería). */
  canShareFiles: boolean;
  isIOS: boolean;
}

const DownloadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const EXTENSIONS: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

export const GeneratedImagePanel: React.FC<GeneratedImagePanelProps> = ({ generatedImage, isLoading, error, onRegenerate, canShareFiles, isIOS }) => {
  const handleDownload = useCallback(async () => {
    if (!generatedImage) return;
    const mime = generatedImage.slice(5, generatedImage.indexOf(';'));
    const fileName = `retrato-profesional-${Date.now()}.${EXTENSIONS[mime] ?? 'png'}`;
    const blob = await (await fetch(generatedImage)).blob();

    // En móvil, el menú de compartir permite guardar directamente en la galería.
    if (canShareFiles) {
      const file = new File([blob], fileName, { type: blob.type });
      try {
        await navigator.share({ files: [file], title: 'Mi retrato profesional' });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return; // el usuario cerró el menú
      }
    }

    const url = URL.createObjectURL(blob);
    // Safari en iOS sin compartir: abrimos la imagen para mantener pulsado y guardarla.
    if (isIOS) {
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }, [generatedImage, canShareFiles, isIOS]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
          {error.needsBilling && (
            <div className="mt-3 text-sm text-red-800 space-y-1">
              <p className="font-semibold">Cómo activarla:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  Abre{' '}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Google AI Studio → API Keys
                  </a>
                  .
                </li>
                <li>
                  Junto a tu clave o proyecto pulsa <strong>«Set up billing»</strong> (Configurar facturación) y añade
                  una tarjeta. Pagarás solo por las imágenes que generes.
                </li>
                <li>Espera unos minutos a que se active y vuelve a pulsar «Generar retrato». No hace falta cambiar la clave.</li>
              </ol>
            </div>
          )}
          {error.detail && (
            <details className="mt-3 text-xs text-red-800/80">
              <summary className="cursor-pointer select-none">Detalle técnico de Google</summary>
              <p className="mt-1 break-words font-mono">{error.detail}</p>
            </details>
          )}
        </div>
      )}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg w-full">
        <h3 className="text-lg font-semibold text-center text-neutral-dark mb-4">2. Retrato generado por IA</h3>
        <div className="aspect-square relative w-full bg-neutral-medium rounded-md flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <Loader />
          ) : generatedImage ? (
            <>
              <img src={generatedImage} alt="Retrato generado" className="w-full h-full object-contain" />
              <button
                onClick={handleDownload}
                className="absolute top-2 right-2 flex items-center bg-white/90 hover:bg-white text-neutral-dark font-semibold py-2 px-3 rounded-full shadow-md transition-colors duration-200 text-sm z-10"
                aria-label="Descargar imagen generada"
              >
                <DownloadIcon />
                {canShareFiles ? 'Guardar / compartir' : 'Descargar'}
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500 px-4">
              <p>El resultado aparecerá aquí cuando subas o tomes una foto y pulses "Generar retrato".</p>
            </div>
          )}
        </div>
      </div>

      {generatedImage && !isLoading && (
        <div className="space-y-2">
          <button
            onClick={onRegenerate}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
          >
            Generar otra versión
          </button>
          <p className="text-xs text-center text-gray-500">
            Usa la misma foto con las opciones actuales. Puedes cambiarlas antes de volver a generar.
          </p>
        </div>
      )}
    </div>
  );
};
