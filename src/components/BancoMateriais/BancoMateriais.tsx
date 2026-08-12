import React, { useState } from "react";
import { Package, Plus, Search, Edit3, Trash2, MapPin } from "lucide-react";
import { MaterialItem } from "../../types";

interface BancoMateriaisProps {
  materiais: MaterialItem[];
  onOpenNovoMaterial: () => void;
  onEditarMaterial: (m: MaterialItem) => void;
  onDeletarMaterial: (id: string) => void;
}

export const BancoMateriais: React.FC<BancoMateriaisProps> = ({
  materiais,
  onOpenNovoMaterial,
  onEditarMaterial,
  onDeletarMaterial,
}) => {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("TODAS");

  const categorias = Array.from(new Set(materiais.map((m) => m.categoria)));

  const filtrados = materiais.filter((m) => {
    const termo = busca.toLowerCase().trim();
    const bateBusca = m.titulo.toLowerCase().includes(termo) || m.descricao.toLowerCase().includes(termo);
    const bateCategoria = categoriaFiltro === "TODAS" || m.categoria === categoriaFiltro;
    return bateBusca && bateCategoria;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-600" />
            Banco de Materiais
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Jogos, PDFs, livros, testes e recursos visuais disponíveis
          </p>
        </div>
        <button
          onClick={onOpenNovoMaterial}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Material</span>
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
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none"
        >
          <option value="TODAS">Todas as Categorias</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtrados.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          Nenhum material encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
                  {m.categoria}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => onEditarMaterial(m)} className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remover "${m.titulo}"?`)) onDeletarMaterial(m.id);
                    }}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{m.titulo}</h3>
              <p className="text-xs text-slate-500">{m.descricao}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {m.localOuLink}
              </p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{m.faixaEtaria}</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    m.disponivel ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {m.disponivel ? "Disponível" : "Indisponível"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
