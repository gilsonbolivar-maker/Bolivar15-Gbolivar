import React, { useState } from "react";
import { Layers, Plus, Search, Edit3, Trash2, Target, ListOrdered, Package } from "lucide-react";
import { Intervencao } from "../../types";

interface BancoIntervencoesProps {
  intervencoes: Intervencao[];
  onOpenNovaIntervencao: () => void;
  onEditarIntervencao: (intervencao: Intervencao) => void;
  onDeletarIntervencao: (id: string) => void;
}

export const BancoIntervencoes: React.FC<BancoIntervencoesProps> = ({
  intervencoes,
  onOpenNovaIntervencao,
  onEditarIntervencao,
  onDeletarIntervencao,
}) => {
  const [busca, setBusca] = useState("");
  const [temaFiltro, setTemaFiltro] = useState("TODOS");

  const temas = Array.from(new Set(intervencoes.map((i) => i.tema)));

  const filtradas = intervencoes.filter((i) => {
    const termo = busca.toLowerCase().trim();
    const bateBusca = i.titulo.toLowerCase().includes(termo) || i.descricao.toLowerCase().includes(termo);
    const bateTema = temaFiltro === "TODOS" || i.tema === temaFiltro;
    return bateBusca && bateTema;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-rosacha-600" />
            Banco de Intervenções
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Protocolos passo a passo organizados por tema clínico
          </p>
        </div>
        <button
          onClick={onOpenNovaIntervencao}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rosacha-600 hover:bg-rosacha-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Intervenção</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none"
          />
        </div>
        <select
          value={temaFiltro}
          onChange={(e) => setTemaFiltro(e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none"
        >
          <option value="TODOS">Todos os Temas</option>
          {temas.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {filtradas.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhuma intervenção encontrada com os filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtradas.map((i) => (
            <div key={i.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rosacha-100 text-rosacha-700">
                    {i.tema}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1.5">{i.titulo}</h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditarIntervencao(i)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remover a intervenção "${i.titulo}"?`)) onDeletarIntervencao(i.id);
                    }}
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600">{i.descricao}</p>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Target className="w-3.5 h-3.5" /> Objetivos
                </p>
                <ul className="text-xs text-slate-700 space-y-0.5 list-disc list-inside">
                  {i.objetivos.map((o, idx) => (
                    <li key={idx}>{o}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <ListOrdered className="w-3.5 h-3.5" /> Passo a Passo
                </p>
                <ol className="text-xs text-slate-700 space-y-0.5 list-decimal list-inside">
                  {i.passoAPasso.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ol>
              </div>

              {i.materiaisSugeridos && i.materiaisSugeridos.length > 0 && (
                <p className="text-xs text-slate-500 flex items-start gap-1.5">
                  <Package className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                  <span>{i.materiaisSugeridos.join(", ")}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
