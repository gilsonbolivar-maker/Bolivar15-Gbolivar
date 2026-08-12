import React from "react";
import { GraduationCap, Plus, Edit3, Trash2, Lightbulb } from "lucide-react";
import { OrientacaoProfessor, Paciente, Escola } from "../../types";

interface GestaoOrientacoesProfessoresProps {
  orientacoes: OrientacaoProfessor[];
  pacientes: Paciente[];
  escolas: Escola[];
  onOpenNovaOrientacao: () => void;
  onEditarOrientacao: (o: OrientacaoProfessor) => void;
  onDeletarOrientacao: (id: string) => void;
}

const statusCores: Record<string, string> = {
  Pendente: "bg-amber-100 text-amber-700 border-amber-200",
  "Em Acompanhamento": "bg-blue-100 text-blue-700 border-blue-200",
  Concluído: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export const GestaoOrientacoesProfessores: React.FC<GestaoOrientacoesProfessoresProps> = ({
  orientacoes,
  pacientes,
  escolas,
  onOpenNovaOrientacao,
  onEditarOrientacao,
  onDeletarOrientacao,
}) => {
  const nomePaciente = (id?: string) => pacientes.find((p) => p.id === id)?.nome;
  const nomeEscola = (id: string) => escolas.find((e) => e.id === id)?.nome || "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amarelo-600" />
            Orientação a Professores
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Estratégias sugeridas para dificuldades observadas em sala de aula
          </p>
        </div>
        <button
          onClick={onOpenNovaOrientacao}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amarelo-600 hover:bg-amarelo-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Orientação</span>
        </button>
      </div>

      {orientacoes.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhuma orientação registrada ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {orientacoes.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">{o.nomeProfessor}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusCores[o.status]}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Turma {o.turma} • {nomeEscola(o.escolaId)}
                    {nomePaciente(o.pacienteId) && <> • Aluno: <strong>{nomePaciente(o.pacienteId)}</strong></>}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => onEditarOrientacao(o)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Remover esta orientação?")) onDeletarOrientacao(o.id);
                    }}
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700">
                <strong>Dificuldade observada:</strong> {o.dificuldadeObservada}
              </p>

              <div className="bg-amarelo-50/60 rounded-xl p-3 border border-amarelo-100">
                <p className="text-[10px] font-bold text-amarelo-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Estratégias Sugeridas
                </p>
                <ul className="text-xs text-slate-700 space-y-0.5 list-disc list-inside">
                  {o.estrategiasSugeridas.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>

              {o.retorno && (
                <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <strong>Retorno:</strong> {o.retorno}
                </p>
              )}

              <p className="text-[11px] text-slate-400">
                {new Date(o.dataOrientacao + "T00:00:00").toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
