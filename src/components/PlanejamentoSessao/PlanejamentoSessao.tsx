import React, { useState } from "react";
import { Sparkles as SparklesIcon, Plus, Edit3, Trash2, Clock3, Target } from "lucide-react";
import { PlanejamentoSessao as PlanejamentoSessaoType, Paciente } from "../../types";

interface PlanejamentoSessaoProps {
  planejamentos: PlanejamentoSessaoType[];
  pacientes: Paciente[];
  onOpenNovoPlanejamento: () => void;
  onEditarPlanejamento: (p: PlanejamentoSessaoType) => void;
  onDeletarPlanejamento: (id: string) => void;
}

const statusCores: Record<string, string> = {
  Planejada: "bg-blue-100 text-blue-700 border-blue-200",
  Concluída: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Cancelada: "bg-slate-100 text-slate-500 border-slate-200",
};

export const PlanejamentoSessao: React.FC<PlanejamentoSessaoProps> = ({
  planejamentos,
  pacientes,
  onOpenNovoPlanejamento,
  onEditarPlanejamento,
  onDeletarPlanejamento,
}) => {
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  const nomePaciente = (id: string) => pacientes.find((p) => p.id === id)?.nome || "—";

  const filtrados = planejamentos
    .filter((p) => filtroStatus === "TODOS" || p.status === filtroStatus)
    .sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-lilas-600" />
            Planejamento de Sessões
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Objetivo, técnica e materiais definidos antes de cada sessão
          </p>
        </div>
        <button
          onClick={onOpenNovoPlanejamento}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-lilas-600 hover:bg-lilas-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Planejamento</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["TODOS", "Planejada", "Concluída", "Cancelada"].map((s) => (
          <button
            key={s}
            onClick={() => setFiltroStatus(s)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
              filtroStatus === s
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s === "TODOS" ? "Todos" : s}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhum planejamento encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtrados.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusCores[p.status]}`}>
                    {p.status}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1.5">{nomePaciente(p.pacienteId)}</h3>
                  <p className="text-xs text-slate-500">
                    {new Date(p.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => onEditarPlanejamento(p)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Remover este planejamento?")) onDeletarPlanejamento(p.id);
                    }}
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-700 space-y-1">
                <p className="flex items-start gap-1.5">
                  <Target className="w-3.5 h-3.5 text-lilas-500 mt-0.5 shrink-0" />
                  <span><strong>Objetivo:</strong> {p.objetivo}</span>
                </p>
                <p><strong>Atividade:</strong> {p.atividade}</p>
                <p><strong>Técnica:</strong> {p.tecnica}</p>
                <p><strong>Materiais:</strong> {p.materiais.join(", ") || "—"}</p>
                <p><strong>Resultado esperado:</strong> {p.resultadoEsperado}</p>
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock3 className="w-3.5 h-3.5" /> {p.tempoEstimadoMinutos} min estimados
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
