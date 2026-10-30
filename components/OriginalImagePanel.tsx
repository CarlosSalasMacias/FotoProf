import React, { useRef, useState, useEffect } from 'react';

interface OriginalImagePanelProps {
  originalImage: string | null;
  isPreparing: boolean;
  disabled: boolean;
  /** En móviles y tablets abrimos la app de cámara nativa (mejor calidad y sin permisos extra). */
  useNativeCamera: boolean;
  onImageUpload: (file: File) => void;
  onImageCapture: (dataUrl: string) => void;
  onReset: () => void;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CameraIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const OriginalImagePanel: React.FC<OriginalImagePanelProps> = ({
  originalImage,
  isPreparing,
  disabled,
  useNativeCamera,
  onImageUpload,
  onImageCapture,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isCameraActive) return;
    let stream: MediaStream | null = null;
    let cancelled = false;
    setCameraError(null);
    setIsCameraReady(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Tu navegador no permite usar la cámara aquí. Abre la app con HTTPS o sube una foto.');
      setIsCameraActive(false);
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } } })
      .then((s) => {
        // Si el usuario canceló mientras se pedía permiso, liberamos la cámara.
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch((err) => {
        console.error('Error al acceder a la cámara:', err);
        if (cancelled) return;
        setCameraError(
          'No se pudo acceder a la cámara. Asegúrate de haber otorgado los permisos en tu navegador. Si el problema persiste, abre la aplicación en una nueva pestaña.',
        );
        setIsCameraActive(false);
      });

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [isCameraActive]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Limpiamos el valor para poder volver a elegir el mismo archivo.
    event.target.value = '';
    if (file) onImageUpload(file);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const openCamera = () => {
    if (useNativeCamera) cameraInputRef.current?.click();
    else setIsCameraActive(true);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onImageUpload(file);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onImageCapture(canvas.toDataURL('image/jpeg', 0.92));
    setIsCameraActive(false);
  };

  let content: React.ReactNode;
  if (isPreparing) {
    content = <p className="text-gray-500">Procesando imagen...</p>;
  } else if (originalImage) {
    content = <img src={originalImage} alt="Foto original" className="w-full h-full object-contain" />;
  } else if (isCameraActive) {
    content = (
      <div className="relative w-full h-full flex items-center justify-center bg-black rounded-md">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={() => setIsCameraReady(true)}
          className="w-full h-full object-cover -scale-x-100"
        />
        {!isCameraReady && <p className="absolute text-white text-sm">Iniciando cámara...</p>}
        <div className="absolute bottom-4 flex space-x-4 z-10">
          <button
            onClick={handleCapture}
            disabled={!isCameraReady}
            className="px-6 py-2 bg-brand-primary text-white rounded-full shadow-lg hover:bg-brand-secondary disabled:bg-gray-500 transition-colors"
          >
            Capturar
          </button>
          <button
            onClick={() => setIsCameraActive(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
        <div
          className={`w-full flex-grow flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
            isDragging ? 'border-brand-secondary bg-brand-light' : 'border-gray-300 hover:bg-gray-50'
          }`}
          onClick={openFilePicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openFilePicker();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Subir una foto"
        >
          <UploadIcon />
          <p className="mt-2 font-semibold text-brand-secondary">
            {useNativeCamera ? 'Toca para elegir una foto de tu galería' : 'Haz clic o arrastra una foto aquí'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Foto de frente, con buena luz y el rostro visible.
            <br />
            (JPG, PNG, WEBP)
          </p>
        </div>
        <div className="flex items-center my-4 w-full">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">O</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          onClick={openCamera}
          className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-neutral-dark hover:bg-neutral-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-dark"
        >
          <CameraIcon />
          Tomar una foto
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cameraError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Aviso de cámara</p>
          <p>{cameraError}</p>
        </div>
      )}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg w-full">
        <h3 className="text-lg font-semibold text-center text-neutral-dark mb-4">1. Tu foto original</h3>
        <div className="aspect-square relative w-full bg-neutral-medium rounded-md flex items-center justify-center overflow-hidden">
          {content}
        </div>
        {originalImage && !isPreparing && (
          <button
            onClick={onReset}
            disabled={disabled}
            className="mt-3 w-full py-2 text-sm font-medium text-gray-600 hover:text-brand-primary disabled:text-gray-300 disabled:cursor-not-allowed underline transition-colors"
          >
            Cambiar foto
          </button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        capture="user"
      />
    </div>
  );
};
