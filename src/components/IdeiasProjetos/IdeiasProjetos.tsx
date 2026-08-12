import React from "react";
import { FolderKanban, Plus, Edit3, Trash2 } from "lucide-react";
import { IdeiaProjeto } from "../../types";

interface IdeiasProjetosProps {
  projetos: IdeiaProjeto[];
  onOpenNovoProjeto: () => void;
  onEditarProjeto: (p: IdeiaProjeto) => void;
  onDeletarProjeto: (id: string) => void;
}

const statusCores: Record<string, string> = {
  Ideia: "bg-slate-100 text-slate-600 border-slate-200",
  "Em Planejamento": "bg-amber-100 text-amber-700 border-amber-200",
  "Em Execução": "bg-blue-100 text-blue-700 border-blue-200",
  Concluído: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export const IdeiasProjetos: React.FC<IdeiasProjetosProps> = ({
  projetos,
  onOpenNovoProjeto,
  onEditarProjeto,
  onDeletarProjeto,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-rosacha-600" />
            Ideias de Projetos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Projetos e campanhas escolares (Setembro Amarelo, Bullying, Inclusão...)
          </p>
        </div>
        <button
          onClick={onOpenNovoProjeto}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rosacha-600 hover:bg-rosacha-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {projetos.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhum projeto cadastrado ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projetos.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusCores[p.status]}`}>
                    {p.status}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1.5">{p.titulo}</h3>
                  <p className="text-xs text-slate-500">{p.tema} • {p.publicoAlvo}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => onEditarProjeto(p)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remover o projeto "${p.titulo}"?`)) onDeletarProjeto(p.id);
                    }}
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700">{p.objetivo}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-rosacha-50/60 rounded-xl p-3 border border-rosacha-100">
                  <p className="text-[10px] font-bold text-rosacha-700 uppercase tracking-wider mb-1.5">Atividades Propostas</p>
                  <ul className="text-xs text-slate-700 space-y-0.5 list-disc list-inside">
                    {p.atividadesPropostas.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Recursos Necessários</p>
                  <ul className="text-xs text-slate-700 space-y-0.5 list-disc list-inside">
                    {p.recursosNecessarios.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
