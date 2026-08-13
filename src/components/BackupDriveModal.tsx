import React, { useEffect, useRef, useState } from "react";
import {
  X,
  CloudUpload,
  LogIn,
  LogOut,
  Loader2,
  CheckCircle2,
  AlertCircle,
  History,
  HardDriveDownload,
  Download,
  Upload,
  FileJson,
} from "lucide-react";
import { FullBackupPayload } from "../storage";

const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const BACKUP_FOLDER_NAME = "PsicoEscolar 2.0 - Backups";
const LAST_BACKUP_KEY = "app_atendimento_ultimo_backup_v1";

/** Backup completo: todas as entidades do app (alunos, escolas, atendimentos, agenda, bancos etc). */
export type BackupPayload = FullBackupPayload;

/** Campos aceitos ao ler um arquivo de backup, todos opcionais para não quebrar
 * a restauração de um backup antigo/parcial (mantém o que já existe no app). */
export type PartialBackupPayload = Partial<BackupPayload>;

const BACKUP_FIELDS: (keyof BackupPayload)[] = [
  "pacientes",
  "atendimentos",
  "grupos",
  "sessoesGrupo",
  "encaminhamentos",
  "escolas",
  "compromissos",
  "casosPrioritarios",
  "checklistDiario",
  "intervencoes",
  "atividades",
  "perfisDesenvolvimento",
  "planejamentosSessao",
  "orientacoesProfessores",
  "atendimentosFamilia",
  "materiais",
  "projetos",
  "metasProfissionais",
  "relatoriosFormais",
];

/** Extrai só os campos conhecidos de um JSON qualquer, ignorando o resto (ex: "appName",
 * "geradoEm") e campos ausentes/corrompidos — assim um backup antigo ou parcial não
 * apaga dados de entidades que ele não conhecia. */
function extractBackupFields(raw: any): PartialBackupPayload {
  const result: PartialBackupPayload = {};
  if (!raw || typeof raw !== "object") return result;
  for (const field of BACKUP_FIELDS) {
    if (Array.isArray(raw[field])) {
      (result as any)[field] = raw[field];
    }
  }
  return result;
}

interface DriveFileMeta {
  id: string;
  name: string;
  createdTime: string;
  size?: string;
}

interface BackupDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BackupPayload;
  onRestore: (data: PartialBackupPayload) => void;
}

// Declaração mínima do objeto global injetado pelo script do Google Identity Services.
declare global {
  interface Window {
    google?: any;
    // File System Access API — disponível no Chrome/Edge (computador), permite
    // escolher a pasta de destino ao salvar. Ausente no Safari/iPadOS.
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      types?: { description: string; accept: Record<string, string[]> }[];
    }) => Promise<any>;
  }
}

function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Falha ao carregar script do Google.")));
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar script do Google."));
    document.head.appendChild(script);
  });
}

function formatBytes(bytes?: string): string {
  if (!bytes) return "";
  const n = parseInt(bytes, 10);
  if (Number.isNaN(n)) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export const BackupDriveModal: React.FC<BackupDriveModalProps> = ({
  isOpen,
  onClose,
  data,
  onRestore,
}) => {
  const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const [gisReady, setGisReady] = useState(false);
  const [gisError, setGisError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [backups, setBackups] = useState<DriveFileMeta[]>([]);
  const [lastBackupLocal, setLastBackupLocal] = useState<string | null>(
    () => localStorage.getItem(LAST_BACKUP_KEY)
  );

  const tokenClientRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen || !clientId) return;
    let cancelled = false;
    loadGisScript()
      .then(() => {
        if (cancelled) return;
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: DRIVE_SCOPE,
          callback: (resp: any) => {
            if (resp.error) {
              setErrorMsg("Não foi possível conectar ao Google Drive: " + resp.error);
              setIsConnecting(false);
              return;
            }
            setAccessToken(resp.access_token);
            setIsConnecting(false);
          },
        });
        setGisReady(true);
      })
      .catch((err) => setGisError(err.message));
    return () => {
      cancelled = true;
    };
  }, [isOpen, clientId]);

  const handleConnect = () => {
    setErrorMsg(null);
    setIsConnecting(true);
    tokenClientRef.current?.requestAccessToken({ prompt: "" });
  };

  const handleDisconnect = () => {
    if (accessToken) {
      window.google?.accounts?.oauth2?.revoke(accessToken, () => {});
    }
    setAccessToken(null);
    setUserEmail(null);
    setBackups([]);
    setStatusMsg(null);
  };

  const driveFetch = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Google Drive respondeu ${res.status}: ${body.slice(0, 200)}`);
    }
    return res;
  };

  const findOrCreateBackupFolder = async (): Promise<string> => {
    const q = encodeURIComponent(
      `mimeType='application/vnd.google-apps.folder' and name='${BACKUP_FOLDER_NAME}' and trashed=false`
    );
    const searchRes = await driveFetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`
    );
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }
    const createRes = await driveFetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: BACKUP_FOLDER_NAME,
        mimeType: "application/vnd.google-apps.folder",
      }),
    });
    const created = await createRes.json();
    return created.id;
  };

  const handleBackupNow = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    setIsBackingUp(true);
    try {
      const folderId = await findOrCreateBackupFolder();

      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, "-");
      const fileName = `psicoescolar-backup-${timestamp}.json`;

      const payload = {
        appName: "PsicoEscolar 2.0",
        geradoEm: now.toISOString(),
        ...data,
      };

      const metadata = {
        name: fileName,
        parents: [folderId],
        mimeType: "application/json",
      };

      const boundary = "psicoescolar-backup-boundary";
      const body =
        `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${JSON.stringify(metadata)}\r\n` +
        `--${boundary}\r\n` +
        `Content-Type: application/json\r\n\r\n` +
        `${JSON.stringify(payload, null, 2)}\r\n` +
        `--${boundary}--`;

      await driveFetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,createdTime",
        {
          method: "POST",
          headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
          body,
        }
      );

      const nowStr = now.toLocaleString("pt-BR");
      localStorage.setItem(LAST_BACKUP_KEY, nowStr);
      setLastBackupLocal(nowStr);
      setStatusMsg(`Backup "${fileName}" enviado com sucesso para o Google Drive!`);
      await loadBackupsList(folderId);
    } catch (err: any) {
      setErrorMsg("Falha ao enviar backup: " + err.message);
    } finally {
      setIsBackingUp(false);
    }
  };

  const loadBackupsList = async (knownFolderId?: string) => {
    setIsLoadingList(true);
    setErrorMsg(null);
    try {
      const folderId = knownFolderId || (await findOrCreateBackupFolder());
      const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
      const res = await driveFetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}&orderBy=createdTime desc&fields=files(id,name,createdTime,size)&pageSize=20`
      );
      const listData = await res.json();
      setBackups(listData.files || []);
    } catch (err: any) {
      setErrorMsg("Falha ao listar backups: " + err.message);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleRestore = async (file: DriveFileMeta) => {
    if (
      !confirm(
        `Restaurar "${file.name}"? Isso vai SUBSTITUIR todos os dados atuais do aplicativo (alunos, atendimentos, grupos e encaminhamentos) pelos dados desse backup.`
      )
    ) {
      return;
    }
    setIsRestoring(file.id);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const res = await driveFetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`
      );
      const restored = await res.json();
      onRestore(extractBackupFields(restored));
      setStatusMsg(`Dados restaurados com sucesso a partir de "${file.name}".`);
    } catch (err: any) {
      setErrorMsg("Falha ao restaurar backup: " + err.message);
    } finally {
      setIsRestoring(null);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadBackupsList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // ---- Backup local em arquivo .json (não depende de configuração do Google) ----
  const localFileInputRef = useRef<HTMLInputElement>(null);
  const [isImportingLocal, setIsImportingLocal] = useState(false);

  const handleDownloadLocalBackup = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    const now = new Date();
    const payload = {
      appName: "PsicoEscolar 2.0",
      geradoEm: now.toISOString(),
      ...data,
    };
    const json = JSON.stringify(payload, null, 2);
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const fileName = `psicoescolar-backup-${timestamp}.json`;
    const nowStr = now.toLocaleString("pt-BR");

    // Navegadores com suporte (Chrome/Edge no computador) abrem um seletor de pasta
    // nativo, deixando escolher exatamente onde salvar.
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            { description: "Backup JSON", accept: { "application/json": [".json"] } },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();

        localStorage.setItem(LAST_BACKUP_KEY, nowStr);
        setLastBackupLocal(nowStr);
        setStatusMsg(`Backup "${fileName}" salvo na pasta escolhida.`);
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return; // cancelou o seletor de pasta
        // Se falhar por outro motivo, cai no método padrão abaixo.
      }
    }

    // Padrão (Safari/iPad e navegadores sem seletor de pasta): baixa para a pasta
    // de Downloads configurada no navegador/dispositivo.
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    localStorage.setItem(LAST_BACKUP_KEY, nowStr);
    setLastBackupLocal(nowStr);
    setStatusMsg(
      window.showSaveFilePicker === undefined && navigator.userAgent.includes("Safari")
        ? 'Arquivo de backup baixado! No iPad, ative "Perguntar onde salvar" em Ajustes → Safari → Downloads para escolher a pasta a cada download.'
        : "Arquivo de backup baixado! Agora é só mover/enviar esse arquivo .json para o seu Google Drive (ou onde preferir guardar)."
    );
  };

  const handlePickLocalFile = () => {
    setErrorMsg(null);
    setStatusMsg(null);
    localFileInputRef.current?.click();
  };

  const handleLocalFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (
      !confirm(
        `Restaurar dados a partir de "${file.name}"? Isso vai SUBSTITUIR os dados atuais do aplicativo pelos dados salvos nesse arquivo.`
      )
    ) {
      return;
    }

    setIsImportingLocal(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const extracted = extractBackupFields(parsed);
      if (Object.keys(extracted).length === 0) {
        throw new Error("Este arquivo não parece ser um backup válido do PsicoEscolar 2.0.");
      }
      onRestore(extracted);
      setStatusMsg(`Dados restaurados com sucesso a partir de "${file.name}".`);
    } catch (err: any) {
      setErrorMsg("Falha ao ler o arquivo de backup: " + err.message);
    } finally {
      setIsImportingLocal(false);
    }
  };

  if (!isOpen) return null;

  const totalRegistros = BACKUP_FIELDS.reduce(
    (soma, campo) => soma + (data[campo]?.length || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full flex flex-col overflow-hidden my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-950 text-white flex items-center justify-between border-b border-indigo-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-xs">
              <CloudUpload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Backup e Restauração</h3>
              <p className="text-xs text-indigo-200">
                {totalRegistros} registro(s) prontos para backup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-300 hover:text-white hover:bg-indigo-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm overflow-y-auto flex-1">
          {/* Backup local em arquivo .json — sempre disponível, sem precisar configurar nada */}
          <div className="p-4 bg-verdep-50 border border-verdep-200 rounded-xl space-y-3">
            <div className="flex items-start gap-2.5">
              <FileJson className="w-5 h-5 text-verdep-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-verdep-900">Backup em arquivo (.json)</p>
                <p className="text-xs text-verdep-800 mt-1 leading-relaxed">
                  Baixa um arquivo com todos os dados do aplicativo. No computador
                  (Chrome/Edge), abre um seletor para você escolher a pasta de destino; no
                  iPad/Safari, é salvo na pasta de Downloads. Depois é só você mesma
                  transferir esse arquivo para o seu Google Drive, se quiser.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadLocalBackup}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-verdep-600 hover:bg-verdep-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Backup (.json)</span>
              </button>

              <button
                onClick={handlePickLocalFile}
                disabled={isImportingLocal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-verdep-100 disabled:opacity-60 border border-verdep-300 text-verdep-800 text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {isImportingLocal ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{isImportingLocal ? "Restaurando..." : "Restaurar de um Arquivo (.json)"}</span>
              </button>

              <input
                ref={localFileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={handleLocalFileSelected}
              />
            </div>

            {lastBackupLocal && (
              <p className="text-[11px] text-verdep-700">
                Último backup baixado neste dispositivo: {lastBackupLocal}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="h-px flex-1 bg-slate-200" />
            <span>ou envie direto para o Google Drive</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {!clientId ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">
                  O envio automático para o Google Drive ainda não está disponível
                </p>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Por enquanto, use o backup em arquivo (.json) logo acima — ele já guarda
                  tudo e você mesma pode transferir para o Drive.
                </p>
              </div>
            </div>
          ) : gisError ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{gisError}</span>
            </div>
          ) : !accessToken ? (
            <div className="p-5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center space-y-3">
              <CloudUpload className="w-10 h-10 text-indigo-500 mx-auto" />
              <p className="text-slate-700 text-xs leading-relaxed max-w-sm mx-auto">
                Conecte sua conta do Google para enviar um backup completo dos dados (alunos,
                atendimentos, grupos e encaminhamentos) para uma pasta privada no seu Google
                Drive, ou restaurar um backup anterior.
              </p>
              <button
                onClick={handleConnect}
                disabled={!gisReady || isConnecting}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                {isConnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>{isConnecting ? "Conectando..." : "Conectar ao Google Drive"}</span>
              </button>
              {lastBackupLocal && (
                <p className="text-[11px] text-slate-400">
                  Último backup enviado neste dispositivo: {lastBackupLocal}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Conectado ao Google Drive</span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" /> Desconectar
                </button>
              </div>

              <button
                onClick={handleBackupNow}
                disabled={isBackingUp}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
              >
                {isBackingUp ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CloudUpload className="w-4 h-4" />
                )}
                <span>{isBackingUp ? "Enviando backup..." : "Fazer Backup Agora"}</span>
              </button>

              {lastBackupLocal && (
                <p className="text-[11px] text-slate-400 text-center -mt-2">
                  Último backup enviado neste dispositivo: {lastBackupLocal}
                </p>
              )}

              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" /> Backups na pasta "{BACKUP_FOLDER_NAME}"
                  </h4>
                  <button
                    onClick={() => loadBackupsList()}
                    disabled={isLoadingList}
                    className="text-[11px] text-indigo-600 hover:underline font-semibold disabled:opacity-50"
                  >
                    {isLoadingList ? "Atualizando..." : "Atualizar"}
                  </button>
                </div>

                {isLoadingList && backups.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1" /> Carregando...
                  </div>
                ) : backups.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
                    Nenhum backup encontrado ainda nesta conta.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {backups.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(file.createdTime).toLocaleString("pt-BR")}
                            {file.size && ` • ${formatBytes(file.size)}`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRestore(file)}
                          disabled={isRestoring === file.id}
                          title="Restaurar este backup"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-700 text-[11px] font-bold rounded-lg transition-colors shrink-0 disabled:opacity-50"
                        >
                          {isRestoring === file.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <HardDriveDownload className="w-3.5 h-3.5" />
                          )}
                          <span>Restaurar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {statusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{statusMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
