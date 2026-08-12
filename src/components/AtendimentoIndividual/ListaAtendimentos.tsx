import React, { useState } from "react";
import {
  UserCheck,
  Search,
  Plus,
  Send,
  Calendar,
  FileText,
  User,
  CheckCircle2,
} from "lucide-react";
import { AtendimentoIndividual, Paciente } from "../../types";

interface ListaAtendimentosProps {
  atendimentos: AtendimentoIndividual[];
  pacientes: Paciente[];
  onOpenNovoAtendimento: () => void;
  onVerProntuario: (paciente: Paciente) => void;
}

export const ListaAtendimentos: React.FC<ListaAtendimentosProps> = ({
  atendimentos,
  pacientes,
  onOpenNovoAtendimento,
  onVerProntuario,
}) => {
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("TODOS");

  const atendimentosFiltrados = atendimentos.filter((a) => {
    const termo = busca.toLowerCase().trim();
    const bateBusca =
      a.pacienteNome.toLowerCase().includes(termo) ||
      a.demandaMotivo.toLowerCase().includes(termo) ||
      a.profissionalNome.toLowerCase().includes(termo);

    const bateTipo = filtroTipo === "TODOS" || a.tipoAtendimento === filtroTipo;

    return bateBusca && bateTipo;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            Atendimento Individual • Escuta & Acolhimento
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registro contínuo de prontuários, evolução clínica e consultas individuais
          </p>
        </div>

        <button
          onClick={onOpenNovoAtendimento}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Atendimento Individual</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome do cidadão, demanda ou profissional..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none"
          >
            <option value="TODOS">Todos os Tipos</option>
            <option value="Acolhimento">Acolhimento</option>
            <option value="Consulta Terapêutica">Consulta Terapêutica</option>
            <option value="Atendimento Social">Atendimento Social</option>
            <option value="Visita Domiciliar">Visita Domiciliar</option>
            <option value="Teleatendimento">Teleatendimento</option>
            <option value="Retorno">Retorno</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {atendimentosFiltrados.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
            Nenhum atendimento localizado.
          </div>
        ) : (
          atendimentosFiltrados.map((a) => {
            const pac = pacientes.find((p) => p.id === a.pacienteId);

            return (
              <div
                key={a.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      {a.pacienteNome}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold rounded-md">
                      {a.tipoAtendimento}
                    </span>
                    {a.encaminhadoNaSessao && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded flex items-center gap-1">
                        <Send className="w-3 h-3" /> Encaminhado
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    Data: {new Date(a.dataHora).toLocaleString("pt-BR")}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-800">
                    <strong>Demanda Inicial / Motivo:</strong> {a.demandaMotivo}
                  </p>
                  <p className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-line">
                    {a.prontuarioNotas}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <div>
                    Profissional: <strong>{a.profissionalNome}</strong> ({a.profissionalCargo})
                    {a.diagnosticoCid && (
                      <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-700 font-mono">
                        CID: {a.diagnosticoCid}
                      </span>
                    )}
                  </div>

                  {pac && (
                    <button
                      onClick={() => onVerProntuario(pac)}
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" /> Ver Prontuário do Cidadão
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
