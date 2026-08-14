import { CloudOff, Download, RefreshCw, X } from 'lucide-react';
import type { PwaState } from '../hooks/usePwa';

/**
 * Avisos flutuantes do PWA: estado offline, atualização disponível e
 * convite para instalar na tela inicial.
 *
 * Ficam sobrepostos ao conteúdo (não empurram o layout) e respeitam a área
 * segura do iPhone.
 */
export function PwaBanners({ pwa }: { pwa: PwaState }) {
  const { isOffline, updateReady, canInstall, applyUpdate, promptInstall, dismissInstall } = pwa;

  if (!isOffline && !updateReady && !canInstall) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 px-4 pb-4 pointer-events-none no-print"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      {isOffline && (
        <div
          role="status"
          className="pointer-events-auto w-full max-w-md flex items-center gap-3 rounded-2xl bg-[#102438] text-white px-4 py-3 shadow-lg border border-[#1E3B5A]"
        >
          <CloudOff className="w-4 h-4 text-[#C5E1F5] shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold">Sem conexão</p>
            <p className="text-[11px] text-[#A2C7E5] leading-snug">
              Prontuários e agenda seguem funcionando. Os recursos de IA voltam com a internet.
            </p>
          </div>
        </div>
      )}

      {updateReady && (
        <div
          role="status"
          className="pointer-events-auto w-full max-w-md flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg border border-[#CBD5E1]"
        >
          <RefreshCw className="w-4 h-4 text-[#1E40AF] shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#0F172A]">Nova versão disponível</p>
            <p className="text-[11px] text-[#334155] leading-snug">
              Atualize para receber as últimas melhorias.
            </p>
          </div>
          <button
            type="button"
            onClick={applyUpdate}
            className="shrink-0 px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors"
          >
            Atualizar
          </button>
        </div>
      )}

      {canInstall && (
        <div className="pointer-events-auto w-full max-w-md flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg border border-[#CBD5E1]">
          <span className="p-2 rounded-xl bg-[#F1F5F9] text-[#1E40AF] shrink-0">
            <Download className="w-4 h-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#0F172A]">Instalar o Harmonize</p>
            <p className="text-[11px] text-[#334155] leading-snug">
              Acesso pela tela inicial e uso offline no consultório.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void promptInstall()}
            className="shrink-0 px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors"
          >
            Instalar
          </button>
          <button
            type="button"
            onClick={dismissInstall}
            aria-label="Dispensar convite de instalação"
            className="shrink-0 p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
