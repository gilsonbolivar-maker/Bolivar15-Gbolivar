import React, { useEffect, useState } from "react";
import { X, Package, Save } from "lucide-react";
import { MaterialItem, CategoriaMaterial } from "../../types";

interface FormMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvarMaterial: (m: MaterialItem) => void;
  materialParaEditar?: MaterialItem | null;
}

const CATEGORIAS: CategoriaMaterial[] = [
  "Jogos", "Atividades", "PDFs", "Livros", "Testes Autorizados",
  "Recursos Visuais", "Histórias Sociais", "Cartões de Emoções",
];

export const FormMaterialModal: React.FC<FormMaterialModalProps> = ({
  isOpen,
  onClose,
  onSalvarMaterial,
  materialParaEditar,
}) => {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<CategoriaMaterial>("Jogos");
  const [descricao, setDescricao] = useState("");
  const [localOuLink, setLocalOuLink] = useState("");
  const [faixaEtaria, setFaixaEtaria] = useState("");
  const [disponivel, setDisponivel] = useState(true);

  useEffect(() => {
    if (materialParaEditar) {
      setTitulo(materialParaEditar.titulo);
      setCategoria(materialParaEditar.categoria);
      setDescricao(materialParaEditar.descricao);
      setLocalOuLink(materialParaEditar.localOuLink);
      setFaixaEtaria(materialParaEditar.faixaEtaria);
      setDisponivel(materialParaEditar.disponivel);
    } else {
      setTitulo("");
      setCategoria("Jogos");
      setDescricao("");
      setLocalOuLink("");
      setFaixaEtaria("");
      setDisponivel(true);
    }
  }, [materialParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      alert("Informe o título do material.");
      return;
    }

    const material: MaterialItem = {
      id: materialParaEditar ? materialParaEditar.id : `mat-${Date.now()}`,
      titulo: titulo.trim(),
      categoria,
      descricao: descricao.trim(),
      localOuLink: localOuLink.trim(),
      faixaEtaria: faixaEtaria.trim(),
      disponivel,
    };

    onSalvarMaterial(material);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rosacha-500/20 text-rosacha-400 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">{materialParaEditar ? "Editar Material" : "Novo Material"}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Título *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rosacha-500 focus:border-rosacha-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaMaterial)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rosacha-500 focus:border-rosacha-500 outline-none"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição</label>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rosacha-500 focus:border-rosacha-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Local ou Link</label>
              <input
                type="text"
                value={localOuLink}
                onChange={(e) => setLocalOuLink(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rosacha-500 focus:border-rosacha-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Faixa Etária</label>
              <input
                type="text"
                value={faixaEtaria}
                onChange={(e) => setFaixaEtaria(e.target.value)}
                placeholder="Ex: 4 a 10 anos"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rosacha-500 focus:border-rosacha-500 outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={disponivel}
              onChange={(e) => setDisponivel(e.target.checked)}
              className="w-4 h-4 text-rosacha-600 rounded border-slate-300 focus:ring-rosacha-500"
            />
            <span className="text-xs font-semibold text-slate-700">Disponível para uso</span>
          </label>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 bg-rosacha-600 hover:bg-rosacha-500 text-white text-sm font-semibold rounded-xl shadow transition-colors">
              <Save className="w-4 h-4" />
              <span>{materialParaEditar ? "Salvar Alterações" : "Cadastrar Material"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
