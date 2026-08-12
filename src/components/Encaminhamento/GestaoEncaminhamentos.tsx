import React, { useState } from "react";
import {
  Send,
  Plus,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Building,
  User,
  XCircle,
  FileText,
} from "lucide-react";
import {
  Encaminhamento,
  Paciente,
  StatusEncaminhamento,
  Prioridade,
  ContraEncaminhamento,
} from "../../types";

interface GestaoEncaminhamentosProps {
  encaminhamentos: Encaminhamento[];
  pacientes: Paciente[];
  onOpenNovoEncaminhamento: () => void;
  onOpenContraEncaminhamento: (encaminhamento: Encaminhamento) => void;
  onImprimirGuia: (encaminhamento: Encaminhamento) => void;
  onAtualizarStatus: (id: string, novoStatus: StatusEncaminhamento) => void;
}

export const GestaoEncaminhamentos: React.FC<GestaoEncaminhamentosProps> = ({
  encaminhamentos,
  pacientes,
  onOpenNovoEncaminhamento,
  onOpenContraEncaminhamento,
  onImprimirGuia,
  onAtualizarStatus,
}) => {
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string>("TODOS");
  const [prioridadeFiltro, setPrioridadeFiltro] = useState<string>("TODAS");

  const encaminhamentosFiltrados = encaminhamentos.filter((e) => {
    const termo = busca.toLowerCase().trim();
    const bateBusca =
      e.pacienteNome.toLowerCase().includes(termo) ||
      e.setorDestino.toLowerCase().includes(termo) ||
      e.especialidadeDestino.toLowerCase().includes(termo) ||
      e.motivoEncaminhamento.toLowerCase().includes(termo);

    const bateStatus = statusFiltro === "TODOS" || e.status === statusFiltro;
    const batePrioridade =
      prioridadeFiltro === "TODAS" || e.prioridade === prioridadeFiltro;

    return bateBusca && bateStatus && batePrioridade;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-lilas-600" />
            Central de Encaminhamentos Intersetoriais
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fluxo unificado de emissão de guias, prioridades, impressão e retorno com contra-parecer
          </p>
        </div>

        <button
          onClick={onOpenNovoEncaminhamento}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-lilas-600 hover:bg-lilas-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Emitir Guia de Encaminhamento</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por aluno, setor de destino ou motivo..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none"
          />
        </div>

        <div>
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Concluido">Concluído (com Contra-Parecer)</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <div>
          <select
            value={prioridadeFiltro}
            onChange={(e) => setPrioridadeFiltro(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none"
          >
            <option value="TODAS">Todas Prioridades</option>
            <option value="Rotina">Rotina</option>
            <option value="Prioritário">Prioritário</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>
      </div>

      {/* List / Cards */}
      <div className="space-y-4">
        {encaminhamentosFiltrados.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
            Nenhum encaminhamento localizado.
          </div>
        ) : (
          encaminhamentosFiltrados.map((enc) => {
            const isUrgente = enc.prioridade === "Urgente";
            const isPrioritario = enc.prioridade === "Prioritário";

            return (
              <div
                key={enc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-lilas-300 transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      {enc.pacienteNome}
                    </span>
                    <span className="text-xs text-slate-400">
                      (CPF: {enc.pacienteCpf})
                    </span>

                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        isUrgente
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : isPrioritario
                          ? "bg-lilas-100 text-lilas-800 border border-lilas-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {enc.prioridade}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-lg ${
                        enc.status === "Concluido"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : enc.status === "Cancelado"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-lilas-100 text-lilas-800 border border-lilas-200"
                      }`}
                    >
                      Status: {enc.status}
                    </span>

                    <span className="text-xs text-slate-400">
                      Emissão: {enc.dataEmissao}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      Origem & Emissor
                    </span>
                    <p className="font-semibold text-slate-800">{enc.setorOrigem}</p>
                    <p className="text-slate-600">
                      Prof: {enc.profissionalEmissor} ({enc.cargoEmissor})
                    </p>
                  </div>

                  <div className="p-3 bg-lilas-50/50 rounded-xl space-y-1">
                    <span className="font-bold text-lilas-900 uppercase tracking-wider text-[10px]">
                      Destino Solicitado
                    </span>
                    <p className="font-bold text-slate-900">{enc.setorDestino}</p>
                    <p className="text-lilas-900 font-semibold">
                      Especialidade: {enc.especialidadeDestino}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <strong className="text-slate-800">Motivo da Solicitação:</strong>
                  <p className="text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-line">
                    {enc.justificativaTecnica}
                  </p>
                </div>

                {/* Contra-Encaminhamento Devolvido */}
                {enc.contraEncaminhamento && (
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-emerald-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Contra-Encaminhamento Devolvido ({enc.contraEncaminhamento.dataParecer})
                      </span>
                      <span>
                        Prof: {enc.contraEncaminhamento.profissionalDestino}
                      </span>
                    </div>

                    <p className="text-slate-700 whitespace-pre-line bg-white p-2.5 rounded border border-emerald-200">
                      {enc.contraEncaminhamento.parecerTecnico}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onImprimirGuia(enc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> Imprimir Guia Oficial
                    </button>

                    {enc.status !== "Concluido" && (
                      <button
                        onClick={() => onOpenContraEncaminhamento(enc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Registrar Contra-Parecer
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Mudar status:</span>
                    <select
                      value={enc.status}
                      onChange={(e) =>
                        onAtualizarStatus(
                          enc.id,
                          e.target.value as StatusEncaminhamento
                        )
                      }
                      className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700 outline-none"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em Análise">Em Análise</option>
                      <option value="Concluido">Concluído</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
