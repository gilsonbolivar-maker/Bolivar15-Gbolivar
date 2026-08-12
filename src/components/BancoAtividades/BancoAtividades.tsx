import React, { useState } from "react";
import { Sparkles, Plus, Search, Edit3, Trash2, Clock3, Package } from "lucide-react";
import { Atividade } from "../../types";

interface BancoAtividadesProps {
  atividades: Atividade[];
  onOpenNovaAtividade: () => void;
  onEditarAtividade: (atividade: Atividade) => void;
  onDeletarAtividade: (id: string) => void;
}

export const BancoAtividades: React.FC<BancoAtividadesProps> = ({
  atividades,
  onOpenNovaAtividade,
  onEditarAtividade,
  onDeletarAtividade,
}) => {
  const [busca, setBusca] = useState("");

  const filtradas = atividades.filter((a) => {
    const termo = busca.toLowerCase().trim();
    return (
      a.titulo.toLowerCase().includes(termo) ||
      a.objetivo.toLowerCase().includes(termo) ||
      a.diagnosticoAlvo.some((d) => d.toLowerCase().includes(termo))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Banco de Atividades
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Atividades por faixa etária, diagnóstico-alvo e área do desenvolvimento estimulada
          </p>
        </div>
        <button
          onClick={onOpenNovaAtividade}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Atividade</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título, objetivo ou diagnóstico-alvo..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none"
        />
      </div>

      {filtradas.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhuma atividade encontrada com os filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtradas.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-base">{a.titulo}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{a.objetivo}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditarAtividade(a)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remover a atividade "${a.titulo}"?`)) onDeletarAtividade(a.id);
                    }}
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  {a.idadeMinima}–{a.idadeMaxima} anos
                </span>
                {a.diagnosticoAlvo.map((d, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {d}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {a.areasEstimuladas.map((area, i) => (
                  <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    {area}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                {a.instrucoes}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock3 className="w-3.5 h-3.5" /> {a.tempoAplicacaoMinutos} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> {a.materiaisNecessarios.join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
