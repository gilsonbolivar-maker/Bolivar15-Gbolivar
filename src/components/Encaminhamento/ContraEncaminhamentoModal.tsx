import React, { useState } from "react";
import { X, CheckCircle2, Save } from "lucide-react";
import { Encaminhamento, ContraEncaminhamento } from "../../types";

interface ContraEncaminhamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  encaminhamento: Encaminhamento | null;
  onSaveContraEncaminhamento: (
    encaminhamentoId: string,
    contraEnc: ContraEncaminhamento
  ) => void;
}

export const ContraEncaminhamentoModal: React.FC<
  ContraEncaminhamentoModalProps
> = ({ isOpen, onClose, encaminhamento, onSaveContraEncaminhamento }) => {
  const [profissionalDestino, setProfissionalDestino] = useState("");
  const [cargoDestino, setCargoDestino] = useState("Especialista de Destino");
  const [parecerTecnico, setParecerTecnico] = useState("");
  const [condutaAdotada, setCondutaAdotada] = useState("");
  const [retornoNecessario, setRetornoNecessario] = useState(false);

  if (!isOpen || !encaminhamento) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parecerTecnico.trim() || !profissionalDestino.trim()) {
      alert("Por favor, preencha o profissional e o parecer técnico de retorno.");
      return;
    }

    const contra: ContraEncaminhamento = {
      id: `ce-${Date.now()}`,
      dataParecer: new Date().toISOString().split("T")[0],
      profissionalDestino: profissionalDestino.trim(),
      cargoDestino: cargoDestino.trim(),
      parecerTecnico: parecerTecnico.trim(),
      condutaAdotada: condutaAdotada.trim() || parecerTecnico.trim(),
      retornoNecessario,
    };

    onSaveContraEncaminhamento(encaminhamento.id, contra);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Registrar Contra-Encaminhamento</h3>
              <p className="text-xs text-slate-400">
                Parecer técnico de resposta do setor de destino ao setor de origem
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo do Encaminhamento */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 text-xs space-y-1">
          <div className="font-bold text-slate-900">
            Aluno: {encaminhamento.pacienteNome} (CPF: {encaminhamento.pacienteCpf})
          </div>
          <div className="text-slate-600">
            <strong>Destino:</strong> {encaminhamento.setorDestino} • <strong>Motivo:</strong> {encaminhamento.motivoEncaminhamento}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Profissional de Destino *
              </label>
              <input
                type="text"
                required
                value={profissionalDestino}
                onChange={(e) => setProfissionalDestino(e.target.value)}
                placeholder="Ex: Dr. Carlos Ferreira"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cargo / Especialidade
              </label>
              <input
                type="text"
                required
                value={cargoDestino}
                onChange={(e) => setCargoDestino(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Parecer Técnico de Retorno *
            </label>
            <textarea
              rows={4}
              required
              value={parecerTecnico}
              onChange={(e) => setParecerTecnico(e.target.value)}
              placeholder="Descreva o atendimento prestado no serviço de destino e os achados clínicos ou sociais..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Conduta Adotada e Orientações para a Origem
            </label>
            <textarea
              rows={2}
              value={condutaAdotada}
              onChange={(e) => setCondutaAdotada(e.target.value)}
              placeholder="Ex: Usuário orientado a retornar ao CRAS para acompanhamento familiar..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={retornoNecessario}
              onChange={(e) => setRetornoNecessario(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300"
            />
            <span className="font-semibold text-slate-800">
              Necessário novo acompanhamento ou reavaliação no setor de origem
            </span>
          </label>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Concluir Encaminhamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
