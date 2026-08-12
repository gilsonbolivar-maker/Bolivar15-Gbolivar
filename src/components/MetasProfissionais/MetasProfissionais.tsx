import React from "react";
import { Target, Plus, Edit3, Trash2, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { MetaProfissional } from "../../types";

interface MetasProfissionaisProps {
  metas: MetaProfissional[];
  onOpenNovaMeta: () => void;
  onEditarMeta: (m: MetaProfissional) => void;
  onDeletarMeta: (id: string) => void;
  onAlternarConcluida: (id: string) => void;
}

export const MetasProfissionais: React.FC<MetasProfissionaisProps> = ({
  metas,
  onOpenNovaMeta,
  onEditarMeta,
  onDeletarMeta,
  onAlternarConcluida,
}) => {
  const categorias = Array.from(new Set(metas.map((m) => m.categoria)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-rosacha-600" />
            Metas Profissionais
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cursos, leituras, organização pessoal e projetos em andamento
          </p>
        </div>
        <button
          onClick={onOpenNovaMeta}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rosacha-600 hover:bg-rosacha-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Meta</span>
        </button>
      </div>

      {metas.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhuma meta cadastrada ainda.
        </div>
      ) : (
        categorias.map((cat) => (
          <div key={cat} className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{cat}</h3>
            {metas
              .filter((m) => m.categoria === cat)
              .map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-start gap-3">
                  <button onClick={() => onAlternarConcluida(m.id)} className="mt-0.5 shrink-0">
                    {m.concluida ? (
                      <CheckCircle2 className="w-5 h-5 text-rosacha-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm ${m.concluida ? "text-slate-400 line-through" : "text-slate-900"}`}>
                      {m.titulo}
                    </h4>
                    {m.descricao && <p className="text-xs text-slate-500 mt-0.5">{m.descricao}</p>}
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                      <span>Prazo: {new Date(m.prazo + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                      {m.certificadoOuLink && (
                        <a
                          href={m.certificadoOuLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> Link
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => onEditarMeta(m)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remover a meta "${m.titulo}"?`)) onDeletarMeta(m.id);
                      }}
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
};
