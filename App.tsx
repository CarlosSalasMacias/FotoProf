import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { OriginalImagePanel } from './components/OriginalImagePanel';
import { GeneratedImagePanel } from './components/GeneratedImagePanel';
import { Header } from './components/Header';
import { ApiKeyPanel } from './components/ApiKeyPanel';
import { generateHeadshot, GeminiError } from './services/geminiService';
import { prepareImage, type PreparedImage } from './utils/image';
import { loadApiKey, saveApiKey } from './utils/storage';
import { useDevice } from './hooks/useDevice';
import type { GeneratorOptions } from './types';
import { DEFAULT_OPTIONS } from './constants';

const App: React.FC = () => {
  const device = useDevice();
  const [apiKey, setApiKey] = useState<string>(loadApiKey);
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_OPTIONS);
  const [originalImage, setOriginalImage] = useState<PreparedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<GeminiError | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const isMobile = device.type === 'mobile';
  const isTablet = device.type === 'tablet';

  const handleSaveKey = useCallback((key: string, remember: boolean) => {
    saveApiKey(key, remember);
    setApiKey(key);
    setGenerationError(null);
  }, []);

  const loadImage = useCallback(async (source: File | string) => {
    setIsPreparing(true);
    setUploadError(null);
    setGenerationError(null);
    setGeneratedImage(null);
    try {
      setOriginalImage(await prepareImage(source));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al procesar la imagen.');
      setOriginalImage(null);
    } finally {
      setIsPreparing(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!apiKey) {
      setGenerationError(new GeminiError('Primero guarda tu clave de Gemini (arriba).'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!originalImage) {
      setUploadError('Por favor, sube una imagen de referencia primero.');
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsGenerating(true);
    setGenerationError(null);
    try {
      const result = await generateHeadshot(
        apiKey,
        originalImage.base64,
        originalImage.mimeType,
        options,
        controller.signal,
      );
      setGeneratedImage(result);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setGenerationError(
        err instanceof GeminiError
          ? err
          : new GeminiError(err instanceof Error ? err.message : 'Ocurrió un error inesperado al generar la imagen.'),
      );
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsGenerating(false);
      }
    }
  }, [apiKey, originalImage, options]);

  // En móvil y tablet el resultado queda fuera de la pantalla: lo llevamos a la vista.
  useEffect(() => {
    if (device.type !== 'desktop' && (isGenerating || generatedImage || generationError)) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isGenerating, generatedImage, generationError, device.type]);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
  }, []);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setOriginalImage(null);
    setGeneratedImage(null);
    setUploadError(null);
    setGenerationError(null);
    setIsGenerating(false);
  }, []);

  const originalPanel = (
    <OriginalImagePanel
      originalImage={originalImage ? `data:${originalImage.mimeType};base64,${originalImage.base64}` : null}
      isPreparing={isPreparing}
      disabled={isGenerating}
      useNativeCamera={device.isTouch}
      onImageUpload={loadImage}
      onImageCapture={loadImage}
      onReset={handleReset}
    />
  );

  const controlPanel = (
    <ControlPanel
      options={options}
      setOptions={setOptions}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isGenerating}
      isImageUploaded={!!originalImage}
      isImageGenerated={!!generatedImage}
      columns={isTablet ? 2 : 1}
      // En móvil el botón va en una barra fija abajo para tenerlo siempre a mano.
      hideSubmit={isMobile}
    />
  );

  const resultPanel = (
    <div ref={resultRef} className="scroll-mt-4">
      <GeneratedImagePanel
        generatedImage={generatedImage}
        isLoading={isGenerating}
        error={generationError}
        onRegenerate={handleSubmit}
        canShareFiles={device.canShareFiles}
        isIOS={device.isIOS}
      />
    </div>
  );

  return (
    <div className={`min-h-screen bg-neutral-light text-neutral-dark font-sans ${isMobile ? 'pb-28' : ''}`}>
      <Header compact={isMobile} />
      <main className={`mx-auto ${isMobile ? 'px-3 py-4' : 'container p-6 lg:p-8'}`}>
        <ApiKeyPanel apiKey={apiKey} onSave={handleSaveKey} />

        {uploadError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{uploadError}</p>
          </div>
        )}

        {device.type === 'desktop' && (
          <div className="grid grid-cols-3 gap-8 items-start">
            {originalPanel}
            {controlPanel}
            {resultPanel}
          </div>
        )}

        {isTablet && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 items-start">
              {originalPanel}
              {resultPanel}
            </div>
            {controlPanel}
          </div>
        )}

        {isMobile && (
          <div className="space-y-5">
            {originalPanel}
            {controlPanel}
            {resultPanel}
          </div>
        )}
      </main>

      {isMobile && (
        <div
          className="fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-gray-200 px-3 pt-3"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          {isGenerating ? (
            <button
              onClick={handleCancel}
              className="w-full py-3.5 rounded-lg text-base font-medium bg-gray-200 text-gray-800"
            >
              Generando… toca para cancelar
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!originalImage}
              className="w-full py-3.5 rounded-lg text-base font-semibold text-white bg-brand-primary active:bg-blue-900 disabled:bg-gray-400"
            >
              {!originalImage
                ? 'Sube una foto para empezar'
                : generatedImage
                  ? 'Generar de nuevo'
                  : 'Generar retrato'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
