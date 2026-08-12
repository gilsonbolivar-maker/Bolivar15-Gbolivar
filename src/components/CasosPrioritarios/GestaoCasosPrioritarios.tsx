import React, { useState } from "react";
import {
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  ListChecks,
  Clock3,
} from "lucide-react";
import { CasoPrioritario, Paciente, NivelUrgencia } from "../../types";

interface GestaoCasosPrioritariosProps {
  casos: CasoPrioritario[];
  pacientes: Paciente[];
  onOpenNovoCaso: () => void;
  onEditarCaso: (caso: CasoPrioritario) => void;
  onDeletarCaso: (id: string) => void;
}

const urgenciaEstilo: Record<NivelUrgencia, { bg: string; text: string; dot: string }> = {
  Crítico: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", dot: "bg-rose-500" },
  Urgente: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  "Atenção Continuada": { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
};

export const GestaoCasosPrioritarios: React.FC<GestaoCasosPrioritariosProps> = ({
  casos,
  pacientes,
  onOpenNovoCaso,
  onEditarCaso,
  onDeletarCaso,
}) => {
  const [filtroUrgencia, setFiltroUrgencia] = useState<string>("TODOS");

  const nomePaciente = (id: string) =>
    pacientes.find((p) => p.id === id)?.nome || "Aluno não encontrado";

  const casosFiltrados = casos.filter(
    (c) => filtroUrgencia === "TODOS" || c.nivelUrgencia === filtroUrgencia
  );

  const casosOrdenados = [...casosFiltrados].sort((a, b) => {
    const ordem: Record<NivelUrgencia, number> = { Crítico: 0, Urgente: 1, "Atenção Continuada": 2 };
    return ordem[a.nivelUrgencia] - ordem[b.nivelUrgencia];
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Casos Prioritários
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Alunos em risco ou situação urgente, com ações intensivas e pendências
          </p>
        </div>

        <button
          onClick={onOpenNovoCaso}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Caso Prioritário</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["TODOS", "Crítico", "Urgente", "Atenção Continuada"].map((nivel) => (
          <button
            key={nivel}
            onClick={() => setFiltroUrgencia(nivel)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
              filtroUrgencia === nivel
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {nivel === "TODOS" ? "Todos" : nivel}
          </button>
        ))}
      </div>

      {casosOrdenados.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhum caso prioritário registrado no momento. 🎉
        </div>
      ) : (
        <div className="space-y-3">
          {casosOrdenados.map((caso) => {
            const estilo = urgenciaEstilo[caso.nivelUrgencia];
            return (
              <div
                key={caso.id}
                className={`rounded-2xl border shadow-sm p-5 space-y-3 ${estilo.bg}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${estilo.dot}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-base">
                          {nomePaciente(caso.pacienteId)}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white border ${estilo.text}`}
                        >
                          {caso.nivelUrgencia}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{caso.motivoRisco}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditarCaso(caso)}
                      title="Editar Caso"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Remover este caso prioritário?")) {
                          onDeletarCaso(caso.id);
                        }
                      }}
                      title="Excluir Caso"
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/70 rounded-xl p-3 border border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <ListChecks className="w-3.5 h-3.5" /> Ações Intensivas
                    </p>
                    {caso.acoesIntensivas.length === 0 ? (
                      <p className="text-xs text-slate-400">Nenhuma ação registrada.</p>
                    ) : (
                      <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                        {caso.acoesIntensivas.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="bg-white/70 rounded-xl p-3 border border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <Clock3 className="w-3.5 h-3.5" /> Pendências
                    </p>
                    {caso.pendencias.length === 0 ? (
                      <p className="text-xs text-emerald-600 font-medium">Sem pendências.</p>
                    ) : (
                      <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                        {caso.pendencias.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Atualizado em {new Date(caso.atualizadoEm).toLocaleDateString("pt-BR")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
