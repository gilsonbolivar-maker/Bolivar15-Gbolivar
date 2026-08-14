import { useRef, useState } from 'react';
import { AlertTriangle, Check, Download, FileJson, Loader2, Upload, X } from 'lucide-react';
import {
  downloadBackup,
  mergeBackup,
  parseBackup,
  summarizeBackup,
  type BackupPayload,
} from '../utils/backup';

/**
 * Backup e restauração dos dados da clínica em arquivo .json.
 *
 * Como todo o prontuário fica no localStorage do navegador, este é o único
 * caminho para levar os dados a outro aparelho ou se recuperar de uma limpeza
 * de cache. A restauração exige confirmação explícita porque pode sobrescrever
 * dados existentes.
 */

type Feedback = { kind: 'ok' | 'error'; message: string } | null;

interface PendingRestore {
  payload: BackupPayload;
  fileName: string;
}

export function BackupModal({
  data,
  onRestore,
  onClose,
}: {
  data: BackupPayload;
  onRestore: (payload: BackupPayload) => void;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [pending, setPending] = useState<PendingRestore | null>(null);

  const current = summarizeBackup(data);

  const handleExport = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const result = await downloadBackup(data);
      if (result === 'saved') {
        setFeedback({ kind: 'ok', message: 'Backup salvo com sucesso.' });
      }
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível gerar o backup.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (file: File) => {
    setBusy(true);
    setFeedback(null);
    try {
      const payload = parseBackup(await file.text());
      setPending({ payload, fileName: file.name });
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Arquivo inválido.',
      });
    } finally {
      setBusy(false);
      // Permite reescolher o mesmo arquivo depois de um erro.
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const confirmRestore = (mode: 'replace' | 'merge') => {
    if (!pending) return;
    const payload = mode === 'merge' ? mergeBackup(data, pending.payload) : pending.payload;
    onRestore(payload);
    setPending(null);
    setFeedback({
      kind: 'ok',
      message:
        mode === 'merge'
          ? 'Backup mesclado aos dados atuais.'
          : 'Dados restaurados a partir do backup.',
    });
  };

  const incoming = pending ? summarizeBackup(pending.payload) : null;

  return (
    <div className="fixed inset-0 z-[110] bg-[#0F172A]/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 no-print">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#CBD5E1] shadow-xl max-h-[92vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-[#F1F5F9] sticky top-0 bg-white rounded-t-3xl">
          <div>
            <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-[0.2em] block">
              Segurança dos dados
            </span>
            <h3 className="font-serif italic text-2xl text-[#0F172A]">Backup & Restauração</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded-xl text-[#334155] bg-[#F1F5F9] border border-[#CBD5E1] hover:bg-[#E2E8F0] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Aviso de por que isso importa */}
          <div className="flex gap-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-4">
            <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#78350F] leading-relaxed">
              Os dados ficam salvos apenas neste aparelho. Limpar os dados do navegador,
              reinstalar o app ou trocar de celular apaga tudo. Faça backup com frequência.
            </p>
          </div>

          {/* Estado atual */}
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.18em]">
              Dados neste aparelho
            </span>
            <dl className="mt-2.5 grid grid-cols-3 gap-2.5">
              <SummaryTile label="Pacientes" value={current.patients} />
              <SummaryTile label="Agendamentos" value={current.appointments} />
              <SummaryTile label="Lotes" value={current.inventory} />
              <SummaryTile label="Procedimentos" value={current.procedures} />
              <SummaryTile label="Lançamentos" value={current.transactions} />
              <SummaryTile label="Pontos no mapa" value={current.faceMapPoints} />
            </dl>
          </div>

          {/* Confirmação de restauração */}
          {pending && incoming ? (
            <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4 space-y-3.5">
              <div className="flex items-center gap-2 text-[#0F172A]">
                <FileJson className="w-4 h-4 text-[#1E40AF]" />
                <span className="text-xs font-bold truncate" title={pending.fileName}>
                  {pending.fileName}
                </span>
              </div>

              <p className="text-[11px] text-[#334155] leading-relaxed">
                O arquivo contém <strong>{incoming.patients}</strong> pacientes,{' '}
                <strong>{incoming.appointments}</strong> agendamentos,{' '}
                <strong>{incoming.inventory}</strong> lotes de estoque,{' '}
                <strong>{incoming.transactions}</strong> lançamentos financeiros e{' '}
                <strong>{incoming.faceMapPoints}</strong> pontos de mapeamento facial.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => confirmRestore('merge')}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors"
                >
                  Mesclar com os atuais
                </button>
                <button
                  type="button"
                  onClick={() => confirmRestore('replace')}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-[#DC2626]/30 text-[#B91C1C] hover:bg-[#FEF2F2] text-xs font-semibold transition-colors"
                >
                  Substituir tudo
                </button>
                <button
                  type="button"
                  onClick={() => setPending(null)}
                  className="px-4 py-2.5 rounded-2xl bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>

              <p className="text-[10px] text-[#64748B] leading-relaxed">
                <strong>Mesclar</strong> mantém tudo o que já existe e acrescenta apenas os
                registros novos. <strong>Substituir</strong> descarta os dados atuais deste
                aparelho.
              </p>
            </div>
          ) : (
            /* Ações principais */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExport}
                disabled={busy}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white text-xs font-semibold transition-colors"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Baixar backup (.json)
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] disabled:opacity-60 text-[#1D4ED8] text-xs font-semibold transition-colors"
              >
                <Upload className="w-4 h-4" />
                Restaurar de arquivo
              </button>

              <input
                ref={fileInputRef}
                id="backup-restore-input"
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFile(file);
                }}
              />
            </div>
          )}

          {feedback && (
            <div
              role="status"
              className={`flex items-start gap-2.5 rounded-2xl p-3.5 text-[11px] leading-relaxed ${
                feedback.kind === 'ok'
                  ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46]'
                  : 'bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]'
              }`}
            >
              {feedback.kind === 'ok' ? (
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2.5">
      <dt className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider truncate">
        {label}
      </dt>
      <dd className="text-lg font-serif italic text-[#0F172A] leading-tight">{value}</dd>
    </div>
  );
}
