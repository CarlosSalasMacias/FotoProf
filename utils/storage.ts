const KEY = 'fotoprof.geminiApiKey';

// localStorage puede fallar (modo privado, almacenamiento bloqueado): nunca rompemos la app por eso.
export function loadApiKey(): string {
  try {
    return localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveApiKey(value: string, remember: boolean): void {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    if (value) (remember ? localStorage : sessionStorage).setItem(KEY, value);
  } catch {
    // Sin almacenamiento: la clave solo vive mientras la pestaña esté abierta.
  }
}
