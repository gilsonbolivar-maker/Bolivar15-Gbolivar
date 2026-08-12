import React, { useState } from "react";
import { BookOpen, Plus, Edit3, Trash2, Printer } from "lucide-react";
import { RelatorioFormal, Paciente } from "../../types";

interface GestaoRelatoriosFormaisProps {
  relatorios: RelatorioFormal[];
  pacientes: Paciente[];
  onOpenNovoRelatorio: () => void;
  onEditarRelatorio: (r: RelatorioFormal) => void;
  onDeletarRelatorio: (id: string) => void;
  onVisualizarRelatorio: (r: RelatorioFormal) => void;
}

const statusCores: Record<string, string> = {
  Rascunho: "bg-slate-100 text-slate-600 border-slate-200",
  Finalizado: "bg-blue-100 text-blue-700 border-blue-200",
  Entregue: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export const GestaoRelatoriosFormais: React.FC<GestaoRelatoriosFormaisProps> = ({
  relatorios,
  pacientes,
  onOpenNovoRelatorio,
  onEditarRelatorio,
  onDeletarRelatorio,
  onVisualizarRelatorio,
}) => {
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  const nomePaciente = (id: string) => pacientes.find((p) => p.id === id)?.nome || "—";

  const filtrados = relatorios
    .filter((r) => filtroStatus === "TODOS" || r.status === filtroStatus)
    .sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Relatórios Formais
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Laudos, pareceres e relatórios psicológicos estruturados
          </p>
        </div>
        <button
          onClick={onOpenNovoRelatorio}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Relatório</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["TODOS", "Rascunho", "Finalizado", "Entregue"].map((s) => (
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
          Nenhum relatório encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtrados.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-sm">{r.titulo}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusCores[r.status]}`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {nomePaciente(r.pacienteId)} • {r.tipo} • {new Date(r.data + "T00:00:00").toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onVisualizarRelatorio(r)}
                  title="Visualizar / Exportar PDF"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Visualizar</span>
                </button>
                <button onClick={() => onEditarRelatorio(r)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remover o relatório "${r.titulo}"?`)) onDeletarRelatorio(r.id);
                  }}
                  className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
