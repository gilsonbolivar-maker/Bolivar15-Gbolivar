/**
 * Persistência local resiliente.
 *
 * O app guarda prontuários, agenda, estoque e financeiro no localStorage.
 * Um único registro corrompido (ou o modo privativo do navegador, que lança
 * ao gravar) derrubava a aplicação inteira na inicialização com tela branca,
 * porque o JSON.parse acontecia direto dentro do inicializador do useState.
 * Aqui todo acesso é encapsulado e falha de forma silenciosa e previsível.
 */

/** Prefixo único de todas as chaves do app, usado também pelo backup. */
export const STORAGE_PREFIX = 'harmonize_';

export const STORAGE_KEYS = {
  patients: `${STORAGE_PREFIX}patients`,
  appointments: `${STORAGE_PREFIX}appointments`,
  inventory: `${STORAGE_PREFIX}inventory`,
  procedures: `${STORAGE_PREFIX}procedures`,
  transactions: `${STORAGE_PREFIX}transactions`,
  facemaps: `${STORAGE_PREFIX}facemaps`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    // Alguns navegadores lançam SecurityError só de acessar a propriedade.
    return false;
  }
}

/**
 * Lê e valida um valor persistido. Se estiver ausente, corrompido ou não
 * passar no `validate`, devolve o `fallback` sem quebrar a aplicação.
 */
export function readStored<T>(
  key: string,
  fallback: T,
  validate?: (value: unknown) => boolean,
): T {
  if (!hasLocalStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;

    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) {
      console.warn(`[storage] Valor inválido em "${key}", usando dados padrão.`);
      return fallback;
    }
    return parsed as T;
  } catch (error) {
    console.warn(`[storage] Falha ao ler "${key}":`, error);
    return fallback;
  }
}

export type WriteResult = { ok: true } | { ok: false; reason: 'quota' | 'unavailable' | 'unknown' };

/** Grava um valor. Nunca lança — devolve o motivo da falha para a UI avisar. */
export function writeStored(key: string, value: unknown): WriteResult {
  if (!hasLocalStorage()) return { ok: false, reason: 'unavailable' };

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    const isQuota =
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.code === 22);

    console.error(`[storage] Falha ao gravar "${key}":`, error);
    return { ok: false, reason: isQuota ? 'quota' : 'unknown' };
  }
}

/** Valida que o dado persistido é um array (formato de todas as coleções). */
export function isArrayOf(value: unknown): boolean {
  return Array.isArray(value);
}

/** Valida que o dado persistido é um objeto simples (mapas paciente -> pontos). */
export function isPlainObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
