import React from "react";
import { HeartHandshake, Plus, Edit3, Trash2, Calendar } from "lucide-react";
import { AtendimentoFamilia, Paciente } from "../../types";

interface GestaoAtendimentosFamiliaProps {
  atendimentos: AtendimentoFamilia[];
  pacientes: Paciente[];
  onOpenNovoAtendimento: () => void;
  onEditarAtendimento: (a: AtendimentoFamilia) => void;
  onDeletarAtendimento: (id: string) => void;
}

export const GestaoAtendimentosFamilia: React.FC<GestaoAtendimentosFamiliaProps> = ({
  atendimentos,
  pacientes,
  onOpenNovoAtendimento,
  onEditarAtendimento,
  onDeletarAtendimento,
}) => {
  const nomePaciente = (id: string) => pacientes.find((p) => p.id === id)?.nome || "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amarelo-600" />
            Atendimento a Famílias
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Reuniões com responsáveis, orientações e encaminhamentos dados à família
          </p>
        </div>
        <button
          onClick={onOpenNovoAtendimento}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amarelo-600 hover:bg-amarelo-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Atendimento</span>
        </button>
      </div>

      {atendimentos.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhum atendimento a família registrado ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {atendimentos.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{nomePaciente(a.pacienteId)}</h3>
                  <p className="text-xs text-slate-500">
                    Responsável presente: <strong className="text-slate-700">{a.responsavelPresente}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => onEditarAtendimento(a)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Remover este atendimento a família?")) onDeletarAtendimento(a.id);
                    }}
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700"><strong>Assunto:</strong> {a.assunto}</p>
              {a.orientacoes && (
                <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <strong>Orientações:</strong> {a.orientacoes}
                </p>
              )}
              {a.encaminhamentos && (
                <p className="text-xs text-slate-600">
                  <strong>Encaminhamentos:</strong> {a.encaminhamentos}
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(a.data + "T00:00:00").toLocaleDateString("pt-BR")}
                </span>
                {a.proximoContato && (
                  <span>
                    Próximo contato: {new Date(a.proximoContato + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
