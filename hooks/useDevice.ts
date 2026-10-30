import { useEffect, useState } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  /** Pantalla táctil como entrada principal. */
  isTouch: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  orientation: 'portrait' | 'landscape';
  /** El navegador puede compartir archivos (menú nativo de compartir/guardar). */
  canShareFiles: boolean;
}

function detect(): DeviceInfo {
  const ua = navigator.userAgent;
  const width = window.innerWidth;
  const isTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  // Los iPad modernos se identifican como Mac; los distinguimos por la pantalla táctil.
  const isIPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const isIOS = isIPad || /iPhone|iPod/.test(ua);
  const isAndroid = /Android/i.test(ua);
  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData;
  // Safari en iPad también incluye "Mobile" en su user agent: lo excluimos expresamente.
  // En Android, los teléfonos llevan "Mobile" en el user agent y las tablets no.
  const isPhoneUA =
    !isIPad &&
    (isAndroid ? /Mobile/.test(ua) : (uaData?.mobile ?? /iPhone|iPod|Windows Phone|Mobi/i.test(ua)));

  let type: DeviceType;
  if (width < 640 || (isPhoneUA && width < 900)) {
    type = 'mobile'; // incluye móviles en horizontal
  } else if (width < 1024 || (isTouch && !isPhoneUA && width <= 1366)) {
    type = 'tablet'; // incluye tablets grandes en horizontal
  } else {
    type = 'desktop';
  }

  let canShareFiles = false;
  try {
    canShareFiles =
      isTouch &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [new File([''], 'test.png', { type: 'image/png' })] });
  } catch {
    canShareFiles = false;
  }

  return {
    type,
    isTouch,
    isIOS,
    isAndroid,
    orientation: window.innerHeight >= width ? 'portrait' : 'landscape',
    canShareFiles,
  };
}

/** Detecta el tipo de dispositivo y se actualiza al girar o cambiar el tamaño de la ventana. */
export function useDevice(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>(detect);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = detect();
        setDevice((prev) =>
          prev.type === next.type && prev.orientation === next.orientation && prev.isTouch === next.isTouch ? prev : next,
        );
      });
    };
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.device = device.type;
  }, [device.type]);

  return device;
}
