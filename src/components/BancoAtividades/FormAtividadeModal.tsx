import React, { useEffect, useState } from "react";
import { X, Sparkles, Save } from "lucide-react";
import { Atividade, AreaDesenvolvimento } from "../../types";

interface FormAtividadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvarAtividade: (atividade: Atividade) => void;
  atividadeParaEditar?: Atividade | null;
}

const AREAS: AreaDesenvolvimento[] = [
  "Atenção", "Concentração", "Memória", "Linguagem", "Leitura", "Escrita",
  "Consciência fonológica", "Raciocínio lógico", "Planejamento", "Funções executivas",
  "Flexibilidade cognitiva", "Controle inibitório", "Coordenação motora fina",
  "Coordenação motora ampla", "Percepção visual", "Percepção auditiva",
  "Organização espacial", "Organização temporal", "Comunicação", "Interação social",
  "Autonomia", "Regulação emocional", "Autoestima", "Tolerância à frustração",
  "Resolução de problemas", "Habilidades adaptativas",
];

const linhasParaLista = (texto: string) =>
  texto.split("\n").map((l) => l.trim()).filter(Boolean);
const listaParaLinhas = (lista: string[]) => lista.join("\n");

export const FormAtividadeModal: React.FC<FormAtividadeModalProps> = ({
  isOpen,
  onClose,
  onSalvarAtividade,
  atividadeParaEditar,
}) => {
  const [titulo, setTitulo] = useState("");
  const [idadeMinima, setIdadeMinima] = useState("5");
  const [idadeMaxima, setIdadeMaxima] = useState("10");
  const [objetivo, setObjetivo] = useState("");
  const [diagnosticoTexto, setDiagnosticoTexto] = useState("");
  const [areasEstimuladas, setAreasEstimuladas] = useState<AreaDesenvolvimento[]>([]);
  const [tempoAplicacaoMinutos, setTempoAplicacaoMinutos] = useState("20");
  const [materiaisTexto, setMateriaisTexto] = useState("");
  const [instrucoes, setInstrucoes] = useState("");

  useEffect(() => {
    if (atividadeParaEditar) {
      setTitulo(atividadeParaEditar.titulo);
      setIdadeMinima(String(atividadeParaEditar.idadeMinima));
      setIdadeMaxima(String(atividadeParaEditar.idadeMaxima));
      setObjetivo(atividadeParaEditar.objetivo);
      setDiagnosticoTexto(listaParaLinhas(atividadeParaEditar.diagnosticoAlvo));
      setAreasEstimuladas(atividadeParaEditar.areasEstimuladas);
      setTempoAplicacaoMinutos(String(atividadeParaEditar.tempoAplicacaoMinutos));
      setMateriaisTexto(listaParaLinhas(atividadeParaEditar.materiaisNecessarios));
      setInstrucoes(atividadeParaEditar.instrucoes);
    } else {
      setTitulo("");
      setIdadeMinima("5");
      setIdadeMaxima("10");
      setObjetivo("");
      setDiagnosticoTexto("");
      setAreasEstimuladas([]);
      setTempoAplicacaoMinutos("20");
      setMateriaisTexto("");
      setInstrucoes("");
    }
  }, [atividadeParaEditar, isOpen]);

  if (!isOpen) return null;

  const toggleArea = (area: AreaDesenvolvimento) => {
    setAreasEstimuladas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      alert("Informe pelo menos o título da atividade.");
      return;
    }

    const atividade: Atividade = {
      id: atividadeParaEditar ? atividadeParaEditar.id : `ativ-${Date.now()}`,
      titulo: titulo.trim(),
      idadeMinima: parseInt(idadeMinima, 10) || 0,
      idadeMaxima: parseInt(idadeMaxima, 10) || 0,
      objetivo: objetivo.trim(),
      diagnosticoAlvo: linhasParaLista(diagnosticoTexto),
      areasEstimuladas,
      tempoAplicacaoMinutos: parseInt(tempoAplicacaoMinutos, 10) || 0,
      materiaisNecessarios: linhasParaLista(materiaisTexto),
      instrucoes: instrucoes.trim(),
    };

    onSalvarAtividade(atividade);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">
              {atividadeParaEditar ? "Editar Atividade" : "Nova Atividade"}
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
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Idade Mín.</label>
              <input
                type="number"
                min={0}
                value={idadeMinima}
                onChange={(e) => setIdadeMinima(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Idade Máx.</label>
              <input
                type="number"
                min={0}
                value={idadeMaxima}
                onChange={(e) => setIdadeMaxima(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tempo (min)</label>
              <input
                type="number"
                min={0}
                value={tempoAplicacaoMinutos}
                onChange={(e) => setTempoAplicacaoMinutos(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Objetivo</label>
            <input
              type="text"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Diagnóstico-Alvo (um por linha)
            </label>
            <textarea
              rows={2}
              value={diagnosticoTexto}
              onChange={(e) => setDiagnosticoTexto(e.target.value)}
              placeholder={"Ex: TDAH\nAutismo\nGeral"}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Áreas do Desenvolvimento Estimuladas
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
              {AREAS.map((area) => {
                const selected = areasEstimuladas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`px-2 py-1 text-[11px] font-medium rounded-lg border transition-colors ${
                      selected
                        ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Materiais Necessários (um por linha)
            </label>
            <textarea
              rows={2}
              value={materiaisTexto}
              onChange={(e) => setMateriaisTexto(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instruções de Aplicação</label>
            <textarea
              rows={2}
              value={instrucoes}
              onChange={(e) => setInstrucoes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl shadow transition-colors">
              <Save className="w-4 h-4" />
              <span>{atividadeParaEditar ? "Salvar Alterações" : "Cadastrar Atividade"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
