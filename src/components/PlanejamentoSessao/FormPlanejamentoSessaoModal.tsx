import React, { useEffect, useState } from "react";
import { X, Sparkles, Save } from "lucide-react";
import { PlanejamentoSessao, Paciente } from "../../types";

interface FormPlanejamentoSessaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  onSalvarPlanejamento: (p: PlanejamentoSessao) => void;
  planejamentoParaEditar?: PlanejamentoSessao | null;
}

const linhasParaLista = (texto: string) =>
  texto.split("\n").map((l) => l.trim()).filter(Boolean);

export const FormPlanejamentoSessaoModal: React.FC<FormPlanejamentoSessaoModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  onSalvarPlanejamento,
  planejamentoParaEditar,
}) => {
  const [pacienteId, setPacienteId] = useState("");
  const [data, setData] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [materiaisTexto, setMateriaisTexto] = useState("");
  const [atividade, setAtividade] = useState("");
  const [tecnica, setTecnica] = useState("");
  const [tempoEstimadoMinutos, setTempoEstimadoMinutos] = useState("45");
  const [resultadoEsperado, setResultadoEsperado] = useState("");
  const [status, setStatus] = useState<PlanejamentoSessao["status"]>("Planejada");

  useEffect(() => {
    if (planejamentoParaEditar) {
      setPacienteId(planejamentoParaEditar.pacienteId);
      setData(planejamentoParaEditar.data);
      setObjetivo(planejamentoParaEditar.objetivo);
      setMateriaisTexto(planejamentoParaEditar.materiais.join("\n"));
      setAtividade(planejamentoParaEditar.atividade);
      setTecnica(planejamentoParaEditar.tecnica);
      setTempoEstimadoMinutos(String(planejamentoParaEditar.tempoEstimadoMinutos));
      setResultadoEsperado(planejamentoParaEditar.resultadoEsperado);
      setStatus(planejamentoParaEditar.status);
    } else {
      setPacienteId(pacientes[0]?.id || "");
      setData(new Date().toISOString().split("T")[0]);
      setObjetivo("");
      setMateriaisTexto("");
      setAtividade("");
      setTecnica("");
      setTempoEstimadoMinutos("45");
      setResultadoEsperado("");
      setStatus("Planejada");
    }
  }, [planejamentoParaEditar, isOpen, pacientes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !objetivo.trim()) {
      alert("Selecione o aluno e informe o objetivo da sessão.");
      return;
    }

    const planejamento: PlanejamentoSessao = {
      id: planejamentoParaEditar ? planejamentoParaEditar.id : `plan-${Date.now()}`,
      pacienteId,
      data,
      objetivo: objetivo.trim(),
      materiais: linhasParaLista(materiaisTexto),
      atividade: atividade.trim(),
      tecnica: tecnica.trim(),
      tempoEstimadoMinutos: parseInt(tempoEstimadoMinutos, 10) || 0,
      resultadoEsperado: resultadoEsperado.trim(),
      status,
    };

    onSalvarPlanejamento(planejamento);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-lilas-500/20 text-lilas-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">
              {planejamentoParaEditar ? "Editar Planejamento" : "Novo Planejamento de Sessão"}
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
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              >
                <option value="">Selecione...</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Objetivo *</label>
            <input
              type="text"
              required
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Atividade</label>
              <input
                type="text"
                value={atividade}
                onChange={(e) => setAtividade(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Técnica</label>
              <input
                type="text"
                value={tecnica}
                onChange={(e) => setTecnica(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Materiais (um por linha)
            </label>
            <textarea
              rows={2}
              value={materiaisTexto}
              onChange={(e) => setMateriaisTexto(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Resultado Esperado</label>
            <textarea
              rows={2}
              value={resultadoEsperado}
              onChange={(e) => setResultadoEsperado(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tempo Estimado (min)</label>
              <input
                type="number"
                min={0}
                value={tempoEstimadoMinutos}
                onChange={(e) => setTempoEstimadoMinutos(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PlanejamentoSessao["status"])}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              >
                <option value="Planejada">Planejada</option>
                <option value="Concluída">Concluída</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 bg-lilas-600 hover:bg-lilas-500 text-white text-sm font-semibold rounded-xl shadow transition-colors">
              <Save className="w-4 h-4" />
              <span>{planejamentoParaEditar ? "Salvar Alterações" : "Salvar Planejamento"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
