/**
 * Manejo de persistencia en localStorage para "Kinti: una aventura por el Perú"
 * Incluye fallback en memoria para entornos seguros, pestañas privadas o SSR/tests.
 */

export interface GameProgress {
  currentStageIndex: number; // 0: Caral, 1: Inca, 2: 1821, 3: Finalizado
  stagesCompleted: boolean[]; // [Caral, Inca, 1821]
  fragments: boolean[]; // [Fragmento 1, Fragmento 2, Fragmento 3]
  soundEnabled: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'kinti_aventura_peru_progreso_v1';

// Memoria interna como fallback
const memoryStore = new Map<string, string>();

function getStorageItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {
    // Si hay restricciones de sandbox o modo incógnito
  }
  return memoryStore.get(key) ?? null;
}

function setStorageItem(key: string, val: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
      return;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val);
      return;
    }
  } catch {
    // Incógnito o sin permisos
  }
  memoryStore.set(key, val);
}

function removeStorageItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return;
    }
  } catch {}
  memoryStore.delete(key);
}

export function getDefaultProgress(): GameProgress {
  return {
    currentStageIndex: 0,
    stagesCompleted: [false, false, false],
    fragments: [false, false, false],
    soundEnabled: true,
    timestamp: Date.now(),
  };
}

export function loadProgress(): GameProgress {
  try {
    const raw = getStorageItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const data = JSON.parse(raw) as Partial<GameProgress>;
    return {
      currentStageIndex: typeof data.currentStageIndex === 'number' ? Math.max(0, Math.min(3, data.currentStageIndex)) : 0,
      stagesCompleted: Array.isArray(data.stagesCompleted) && data.stagesCompleted.length === 3
        ? data.stagesCompleted
        : [false, false, false],
      fragments: Array.isArray(data.fragments) && data.fragments.length === 3
        ? data.fragments
        : [false, false, false],
      soundEnabled: typeof data.soundEnabled === 'boolean' ? data.soundEnabled : true,
      timestamp: typeof data.timestamp === 'number' ? data.timestamp : Date.now(),
    };
  } catch (e) {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: Partial<GameProgress>): GameProgress {
  try {
    const current = loadProgress();
    const updated: GameProgress = {
      ...current,
      ...progress,
      timestamp: Date.now(),
    };
    setStorageItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return { ...getDefaultProgress(), ...progress };
  }
}

export function resetProgress(): GameProgress {
  const fresh = getDefaultProgress();
  try {
    removeStorageItem(STORAGE_KEY);
  } catch {}
  return fresh;
}

export function hasSavedProgress(): boolean {
  try {
    const current = loadProgress();
    return current.currentStageIndex > 0 || current.fragments.some((f) => f);
  } catch {
    return false;
  }
}
