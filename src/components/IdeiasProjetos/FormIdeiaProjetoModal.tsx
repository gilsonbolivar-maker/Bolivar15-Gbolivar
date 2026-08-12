import React, { useEffect, useState } from "react";
import { X, FolderKanban, Save } from "lucide-react";
import { IdeiaProjeto, TemaProjeto } from "../../types";

interface FormIdeiaProjetoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvarProjeto: (p: IdeiaProjeto) => void;
  projetoParaEditar?: IdeiaProjeto | null;
}

const TEMAS: TemaProjeto[] = [
  "Educação emocional", "Setembro Amarelo", "Maio Laranja", "Bullying",
  "Inclusão", "Saúde mental", "Habilidades sociais", "Formação de professores",
];

const linhasParaLista = (texto: string) =>
  texto.split("\n").map((l) => l.trim()).filter(Boolean);

export const FormIdeiaProjetoModal: React.FC<FormIdeiaProjetoModalProps> = ({
  isOpen,
  onClose,
  onSalvarProjeto,
  projetoParaEditar,
}) => {
  const [titulo, setTitulo] = useState("");
  const [tema, setTema] = useState<TemaProjeto>("Educação emocional");
  const [publicoAlvo, setPublicoAlvo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [atividadesTexto, setAtividadesTexto] = useState("");
  const [recursosTexto, setRecursosTexto] = useState("");
  const [status, setStatus] = useState<IdeiaProjeto["status"]>("Ideia");

  useEffect(() => {
    if (projetoParaEditar) {
      setTitulo(projetoParaEditar.titulo);
      setTema(projetoParaEditar.tema);
      setPublicoAlvo(projetoParaEditar.publicoAlvo);
      setObjetivo(projetoParaEditar.objetivo);
      setAtividadesTexto(projetoParaEditar.atividadesPropostas.join("\n"));
      setRecursosTexto(projetoParaEditar.recursosNecessarios.join("\n"));
      setStatus(projetoParaEditar.status);
    } else {
      setTitulo("");
      setTema("Educação emocional");
      setPublicoAlvo("");
      setObjetivo("");
      setAtividadesTexto("");
      setRecursosTexto("");
      setStatus("Ideia");
    }
  }, [projetoParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      alert("Informe o título do projeto.");
      return;
    }

    const projeto: IdeiaProjeto = {
      id: projetoParaEditar ? projetoParaEditar.id : `proj-${Date.now()}`,
      titulo: titulo.trim(),
      tema,
      publicoAlvo: publicoAlvo.trim(),
      objetivo: objetivo.trim(),
      atividadesPropostas: linhasParaLista(atividadesTexto),
      recursosNecessarios: linhasParaLista(recursosTexto),
      status,
    };

    onSalvarProjeto(projeto);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">{projetoParaEditar ? "Editar Projeto" : "Novo Projeto"}</h3>
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
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tema</label>
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value as TemaProjeto)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                {TEMAS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Público-Alvo</label>
              <input
                type="text"
                value={publicoAlvo}
                onChange={(e) => setPublicoAlvo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Objetivo</label>
            <textarea
              rows={2}
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Atividades Propostas (uma por linha)
            </label>
            <textarea
              rows={3}
              value={atividadesTexto}
              onChange={(e) => setAtividadesTexto(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recursos Necessários (um por linha)
            </label>
            <textarea
              rows={2}
              value={recursosTexto}
              onChange={(e) => setRecursosTexto(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IdeiaProjeto["status"])}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
              <option value="Ideia">Ideia</option>
              <option value="Em Planejamento">Em Planejamento</option>
              <option value="Em Execução">Em Execução</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl shadow transition-colors">
              <Save className="w-4 h-4" />
              <span>{projetoParaEditar ? "Salvar Alterações" : "Cadastrar Projeto"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
