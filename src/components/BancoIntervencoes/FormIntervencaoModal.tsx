import React, { useEffect, useState } from "react";
import { X, Layers, Save } from "lucide-react";
import { Intervencao, TemaIntervencao } from "../../types";

interface FormIntervencaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvarIntervencao: (intervencao: Intervencao) => void;
  intervencaoParaEditar?: Intervencao | null;
}

const TEMAS: TemaIntervencao[] = [
  "Ansiedade",
  "Autismo",
  "TDAH",
  "TOD",
  "Deficiência Intelectual",
  "Dificuldades de aprendizagem",
  "Habilidades sociais",
  "Autorregulação",
  "Bullying",
  "Emoções",
  "Regras e limites",
  "Inclusão",
  "Orientação para professores",
  "Orientação para famílias",
];

const linhasParaLista = (texto: string) =>
  texto.split("\n").map((l) => l.trim()).filter(Boolean);

export const FormIntervencaoModal: React.FC<FormIntervencaoModalProps> = ({
  isOpen,
  onClose,
  onSalvarIntervencao,
  intervencaoParaEditar,
}) => {
  const [titulo, setTitulo] = useState("");
  const [tema, setTema] = useState<TemaIntervencao>("Ansiedade");
  const [descricao, setDescricao] = useState("");
  const [objetivosTexto, setObjetivosTexto] = useState("");
  const [passosTexto, setPassosTexto] = useState("");
  const [materiaisTexto, setMateriaisTexto] = useState("");

  useEffect(() => {
    if (intervencaoParaEditar) {
      setTitulo(intervencaoParaEditar.titulo);
      setTema(intervencaoParaEditar.tema);
      setDescricao(intervencaoParaEditar.descricao);
      setObjetivosTexto(intervencaoParaEditar.objetivos.join("\n"));
      setPassosTexto(intervencaoParaEditar.passoAPasso.join("\n"));
      setMateriaisTexto((intervencaoParaEditar.materiaisSugeridos || []).join("\n"));
    } else {
      setTitulo("");
      setTema("Ansiedade");
      setDescricao("");
      setObjetivosTexto("");
      setPassosTexto("");
      setMateriaisTexto("");
    }
  }, [intervencaoParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      alert("Informe pelo menos o título da intervenção.");
      return;
    }

    const intervencao: Intervencao = {
      id: intervencaoParaEditar ? intervencaoParaEditar.id : `int-${Date.now()}`,
      titulo: titulo.trim(),
      tema,
      descricao: descricao.trim(),
      objetivos: linhasParaLista(objetivosTexto),
      passoAPasso: linhasParaLista(passosTexto),
      materiaisSugeridos: linhasParaLista(materiaisTexto),
    };

    onSalvarIntervencao(intervencao);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rosacha-500/20 text-rosacha-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">
              {intervencaoParaEditar ? "Editar Intervenção" : "Nova Intervenção"}
            </h3>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tema</label>
            <select
              value={tema}
              onChange={(e) => setTema(e.target.value as TemaIntervencao)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rosacha-500 focus:border-rosacha-500 outline-none"
            >
              {TEMAS.map((t) => (
                <option key={t} value={t}>{t}</option>
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Objetivos (um por linha)</label>
            <textarea
              rows={3}
              value={objetivosTexto}
              onChange={(e) => setObjetivosTexto(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rosacha-500 focus:border-rosacha-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Passo a Passo (um por linha)</label>
            <textarea
              rows={4}
              value={passosTexto}
              onChange={(e) => setPassosTexto(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rosacha-500 focus:border-rosacha-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Materiais Sugeridos (um por linha)</label>
            <textarea
              rows={2}
              value={materiaisTexto}
              onChange={(e) => setMateriaisTexto(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rosacha-500 focus:border-rosacha-500 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 bg-rosacha-600 hover:bg-rosacha-500 text-white text-sm font-semibold rounded-xl shadow transition-colors">
              <Save className="w-4 h-4" />
              <span>{intervencaoParaEditar ? "Salvar Alterações" : "Cadastrar Intervenção"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
