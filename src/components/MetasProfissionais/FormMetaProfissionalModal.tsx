import React, { useEffect, useState } from "react";
import { X, Target, Save } from "lucide-react";
import { MetaProfissional, CategoriaMeta } from "../../types";

interface FormMetaProfissionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvarMeta: (m: MetaProfissional) => void;
  metaParaEditar?: MetaProfissional | null;
}

const CATEGORIAS: CategoriaMeta[] = [
  "Metas do Mês", "Cursos Desejados", "Leituras Planejadas",
  "Organização Pessoal", "Projetos em Andamento",
];

export const FormMetaProfissionalModal: React.FC<FormMetaProfissionalModalProps> = ({
  isOpen,
  onClose,
  onSalvarMeta,
  metaParaEditar,
}) => {
  const [categoria, setCategoria] = useState<CategoriaMeta>("Metas do Mês");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [certificadoOuLink, setCertificadoOuLink] = useState("");
  const [concluida, setConcluida] = useState(false);

  useEffect(() => {
    if (metaParaEditar) {
      setCategoria(metaParaEditar.categoria);
      setTitulo(metaParaEditar.titulo);
      setDescricao(metaParaEditar.descricao || "");
      setPrazo(metaParaEditar.prazo);
      setCertificadoOuLink(metaParaEditar.certificadoOuLink || "");
      setConcluida(metaParaEditar.concluida);
    } else {
      setCategoria("Metas do Mês");
      setTitulo("");
      setDescricao("");
      setPrazo(new Date().toISOString().split("T")[0]);
      setCertificadoOuLink("");
      setConcluida(false);
    }
  }, [metaParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      alert("Informe o título da meta.");
      return;
    }

    const meta: MetaProfissional = {
      id: metaParaEditar ? metaParaEditar.id : `meta-${Date.now()}`,
      categoria,
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
      prazo,
      concluida,
      certificadoOuLink: certificadoOuLink.trim() || undefined,
    };

    onSalvarMeta(meta);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">{metaParaEditar ? "Editar Meta" : "Nova Meta Profissional"}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaMeta)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Título *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição</label>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prazo</label>
              <input
                type="date"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Certificado / Link</label>
              <input
                type="text"
                value={certificadoOuLink}
                onChange={(e) => setCertificadoOuLink(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={concluida}
              onChange={(e) => setConcluida(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-700">Concluída</span>
          </label>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow transition-colors">
              <Save className="w-4 h-4" />
              <span>{metaParaEditar ? "Salvar Alterações" : "Cadastrar Meta"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
