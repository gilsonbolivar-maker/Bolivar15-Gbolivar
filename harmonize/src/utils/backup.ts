import type {
  Appointment,
  FaceMapPoint,
  FinancialTransaction,
  InventoryItem,
  Patient,
  ProcedureCatalogItem,
} from '../types';
import { todayISO } from './date';

/**
 * Backup e restauração dos dados da clínica.
 *
 * Todo o prontuário vive no localStorage do navegador — limpar os dados de
 * navegação, trocar de aparelho ou reinstalar o PWA apaga tudo. Este módulo
 * serializa o estado completo em um .json que o usuário guarda onde quiser.
 */

/** Versão do formato do arquivo. Incrementar ao mudar a forma dos dados. */
export const BACKUP_VERSION = 1;

export interface BackupPayload {
  patients: Patient[];
  appointments: Appointment[];
  inventory: InventoryItem[];
  procedures: ProcedureCatalogItem[];
  transactions: FinancialTransaction[];
  faceMaps: Record<string, FaceMapPoint[]>;
}

export interface BackupFile extends BackupPayload {
  app: 'harmonize-clinical';
  version: number;
  exportedAt: string;
}

/** Resumo de contagens exibido antes de confirmar uma restauração. */
export interface BackupSummary {
  patients: number;
  appointments: number;
  inventory: number;
  procedures: number;
  transactions: number;
  faceMapPoints: number;
}

export function summarizeBackup(data: BackupPayload): BackupSummary {
  return {
    patients: data.patients.length,
    appointments: data.appointments.length,
    inventory: data.inventory.length,
    procedures: data.procedures.length,
    transactions: data.transactions.length,
    faceMapPoints: Object.values(data.faceMaps).reduce((sum, pts) => sum + pts.length, 0),
  };
}

export function buildBackupFile(payload: BackupPayload): BackupFile {
  return {
    app: 'harmonize-clinical',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    ...payload,
  };
}

/** Nome sugerido, com a data para os arquivos ficarem ordenáveis. */
export function backupFileName(): string {
  return `harmonize-backup-${todayISO()}.json`;
}

/**
 * Dispara o download do backup.
 *
 * Usa a File System Access API quando disponível (permite escolher a pasta,
 * inclusive no Android/Chrome), com fallback para download convencional.
 */
export async function downloadBackup(payload: BackupPayload): Promise<'saved' | 'cancelled'> {
  const json = JSON.stringify(buildBackupFile(payload), null, 2);
  const fileName = backupFileName();

  const picker = (window as unknown as {
    showSaveFilePicker?: (options: unknown) => Promise<{
      createWritable: () => Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }>;
    }>;
  }).showSaveFilePicker;

  if (typeof picker === 'function') {
    try {
      const handle = await picker({
        suggestedName: fileName,
        types: [{ description: 'Backup Harmonize (JSON)', accept: { 'application/json': ['.json'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
      return 'saved';
    } catch (error) {
      // AbortError = o usuário fechou o seletor de pasta; não é falha.
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
      // Qualquer outro erro cai no download tradicional abaixo.
      console.warn('[backup] Seletor de arquivos indisponível, usando download:', error);
    }
  }

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return 'saved';
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/**
 * Valida e normaliza o conteúdo de um arquivo de backup.
 *
 * Lança `Error` com mensagem em português para a UI mostrar diretamente.
 */
export function parseBackup(raw: string): BackupPayload {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('O arquivo não é um JSON válido.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('O arquivo não contém um backup válido.');
  }

  const data = parsed as Partial<BackupFile>;

  if (data.app !== undefined && data.app !== 'harmonize-clinical') {
    throw new Error('Este backup pertence a outro aplicativo.');
  }

  if (data.version !== undefined && data.version > BACKUP_VERSION) {
    throw new Error(
      `Backup gerado por uma versão mais nova do app (v${data.version}). Atualize o Harmonize antes de restaurar.`,
    );
  }

  const faceMapsRaw = data.faceMaps;
  const faceMaps: Record<string, FaceMapPoint[]> = {};
  if (typeof faceMapsRaw === 'object' && faceMapsRaw !== null && !Array.isArray(faceMapsRaw)) {
    for (const [patientId, points] of Object.entries(faceMapsRaw)) {
      if (Array.isArray(points)) faceMaps[patientId] = points as FaceMapPoint[];
    }
  }

  const payload: BackupPayload = {
    patients: asArray<Patient>(data.patients),
    appointments: asArray<Appointment>(data.appointments),
    inventory: asArray<InventoryItem>(data.inventory),
    procedures: asArray<ProcedureCatalogItem>(data.procedures),
    transactions: asArray<FinancialTransaction>(data.transactions),
    faceMaps,
  };

  const isEmpty =
    payload.patients.length === 0 &&
    payload.appointments.length === 0 &&
    payload.inventory.length === 0 &&
    payload.procedures.length === 0 &&
    payload.transactions.length === 0 &&
    Object.keys(payload.faceMaps).length === 0;

  if (isEmpty) {
    throw new Error('O arquivo não contém nenhum dado da clínica.');
  }

  return payload;
}

/** Junta o backup ao estado atual sem apagar nada, deduplicando por id. */
export function mergeBackup(current: BackupPayload, incoming: BackupPayload): BackupPayload {
  const mergeById = <T extends { id: string }>(base: T[], extra: T[]): T[] => {
    const byId = new Map(base.map((item) => [item.id, item]));
    for (const item of extra) {
      if (item && typeof item.id === 'string' && !byId.has(item.id)) byId.set(item.id, item);
    }
    return Array.from(byId.values());
  };

  const faceMaps: Record<string, FaceMapPoint[]> = { ...current.faceMaps };
  for (const [patientId, points] of Object.entries(incoming.faceMaps)) {
    faceMaps[patientId] = mergeById(faceMaps[patientId] ?? [], points);
  }

  return {
    patients: mergeById(current.patients, incoming.patients),
    appointments: mergeById(current.appointments, incoming.appointments),
    inventory: mergeById(current.inventory, incoming.inventory),
    procedures: mergeById(current.procedures, incoming.procedures),
    transactions: mergeById(current.transactions, incoming.transactions),
    faceMaps,
  };
}
