import React, { useEffect, useState } from "react";
import { X, BookOpen, Save } from "lucide-react";
import { RelatorioFormal, Paciente, TipoRelatorioFormal } from "../../types";

interface FormRelatorioFormalModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  onSalvarRelatorio: (r: RelatorioFormal) => void;
  relatorioParaEditar?: RelatorioFormal | null;
}

const TIPOS: TipoRelatorioFormal[] = [
  "Relatório Psicológico",
  "Evolução",
  "Parecer",
  "Encaminhamento",
  "Devolutiva",
];

export const FormRelatorioFormalModal: React.FC<FormRelatorioFormalModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  onSalvarRelatorio,
  relatorioParaEditar,
}) => {
  const [pacienteId, setPacienteId] = useState("");
  const [tipo, setTipo] = useState<TipoRelatorioFormal>("Relatório Psicológico");
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [autor, setAutor] = useState("Débora Costa - Psicóloga (CRP 03/24682)");
  const [identificacao, setIdentificacao] = useState("");
  const [motivoEncaminhamento, setMotivoEncaminhamento] = useState("");
  const [procedimentos, setProcedimentos] = useState("");
  const [analise, setAnalise] = useState("");
  const [conclusaoRecomendacoes, setConclusaoRecomendacoes] = useState("");
  const [status, setStatus] = useState<RelatorioFormal["status"]>("Rascunho");

  useEffect(() => {
    if (relatorioParaEditar) {
      setPacienteId(relatorioParaEditar.pacienteId);
      setTipo(relatorioParaEditar.tipo);
      setTitulo(relatorioParaEditar.titulo);
      setData(relatorioParaEditar.data);
      setAutor(relatorioParaEditar.autor);
      setIdentificacao(relatorioParaEditar.conteudo.identificacao);
      setMotivoEncaminhamento(relatorioParaEditar.conteudo.motivoEncaminhamento);
      setProcedimentos(relatorioParaEditar.conteudo.procedimentos);
      setAnalise(relatorioParaEditar.conteudo.analise);
      setConclusaoRecomendacoes(relatorioParaEditar.conteudo.conclusaoRecomendacoes);
      setStatus(relatorioParaEditar.status);
    } else {
      setPacienteId(pacientes[0]?.id || "");
      setTipo("Relatório Psicológico");
      setTitulo("");
      setData(new Date().toISOString().split("T")[0]);
      setAutor("Débora Costa - Psicóloga (CRP 03/24682)");
      setIdentificacao("");
      setMotivoEncaminhamento("");
      setProcedimentos("");
      setAnalise("");
      setConclusaoRecomendacoes("");
      setStatus("Rascunho");
    }
  }, [relatorioParaEditar, isOpen, pacientes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !titulo.trim()) {
      alert("Selecione o aluno e informe o título do relatório.");
      return;
    }

    const relatorio: RelatorioFormal = {
      id: relatorioParaEditar ? relatorioParaEditar.id : `rel-${Date.now()}`,
      pacienteId,
      tipo,
      titulo: titulo.trim(),
      data,
      autor: autor.trim(),
      conteudo: {
        identificacao: identificacao.trim(),
        motivoEncaminhamento: motivoEncaminhamento.trim(),
        procedimentos: procedimentos.trim(),
        analise: analise.trim(),
        conclusaoRecomendacoes: conclusaoRecomendacoes.trim(),
      },
      status,
    };

    onSalvarRelatorio(relatorio);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amarelo-500/20 text-amarelo-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">
              {relatorioParaEditar ? "Editar Relatório" : "Novo Relatório Formal"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Aluno *</label>
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              >
                <option value="">Selecione...</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoRelatorioFormal)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              >
                {TIPOS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Título *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RelatorioFormal["status"])}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              >
                <option value="Rascunho">Rascunho</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Entregue">Entregue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Autor</label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Corpo do Relatório
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">1. Identificação</label>
              <textarea
                rows={2}
                value={identificacao}
                onChange={(e) => setIdentificacao(e.target.value)}
                placeholder="Nome, idade, série/turma, escola..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">2. Motivo do Encaminhamento</label>
              <textarea
                rows={2}
                value={motivoEncaminhamento}
                onChange={(e) => setMotivoEncaminhamento(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">3. Procedimentos</label>
              <textarea
                rows={2}
                value={procedimentos}
                onChange={(e) => setProcedimentos(e.target.value)}
                placeholder="Entrevistas, observações, instrumentos aplicados..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">4. Análise</label>
              <textarea
                rows={3}
                value={analise}
                onChange={(e) => setAnalise(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">5. Conclusão e Recomendações</label>
              <textarea
                rows={3}
                value={conclusaoRecomendacoes}
                onChange={(e) => setConclusaoRecomendacoes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 bg-amarelo-600 hover:bg-amarelo-500 text-white text-sm font-semibold rounded-xl shadow transition-colors">
              <Save className="w-4 h-4" />
              <span>{relatorioParaEditar ? "Salvar Alterações" : "Salvar Relatório"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
