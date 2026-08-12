import React from "react";
import { Brain, Edit3, User } from "lucide-react";
import { Paciente, PerfilDesenvolvimentoAluno } from "../../types";

interface AreasDesenvolvimentoProps {
  pacientes: Paciente[];
  perfis: PerfilDesenvolvimentoAluno[];
  onEditarPerfil: (paciente: Paciente) => void;
}

export const AreasDesenvolvimento: React.FC<AreasDesenvolvimentoProps> = ({
  pacientes,
  perfis,
  onEditarPerfil,
}) => {
  const perfilDe = (pacienteId: string) =>
    perfis.find((p) => p.pacienteId === pacienteId);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          Áreas do Desenvolvimento
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Mapeamento de quais áreas cognitivas, motoras e sociais cada aluno precisa estimular
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pacientes.map((p) => {
          const perfil = perfilDe(p.id);
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate">{p.nome}</h3>
                </div>
                <button
                  onClick={() => onEditarPerfil(p)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {perfil ? "Editar" : "Definir Perfil"}
                </button>
              </div>

              {!perfil || perfil.areasParaEstimular.length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-50 rounded-lg p-2.5 border border-dashed border-slate-200">
                  Nenhuma área de desenvolvimento mapeada ainda.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {perfil.areasParaEstimular.map((area) => (
                      <span
                        key={area}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                  {perfil.observacoesPorArea &&
                    Object.entries(perfil.observacoesPorArea).map(
                      ([area, nota]) =>
                        nota && (
                          <p key={area} className="text-xs text-slate-500">
                            <strong className="text-slate-700">{area}:</strong> {nota}
                          </p>
                        )
                    )}
                  <p className="text-[11px] text-slate-400">
                    Atualizado em {new Date(perfil.atualizadoEm).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
