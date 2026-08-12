import React, { useEffect, useState } from "react";
import { X, AlertTriangle, Save } from "lucide-react";
import { CasoPrioritario, Paciente, NivelUrgencia } from "../../types";

interface FormCasoPrioritarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  onSalvarCaso: (caso: CasoPrioritario) => void;
  casoParaEditar?: CasoPrioritario | null;
}

const linhasParaLista = (texto: string) =>
  texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export const FormCasoPrioritarioModal: React.FC<FormCasoPrioritarioModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  onSalvarCaso,
  casoParaEditar,
}) => {
  const [pacienteId, setPacienteId] = useState("");
  const [motivoRisco, setMotivoRisco] = useState("");
  const [nivelUrgencia, setNivelUrgencia] = useState<NivelUrgencia>("Urgente");
  const [acoesTexto, setAcoesTexto] = useState("");
  const [pendenciasTexto, setPendenciasTexto] = useState("");

  useEffect(() => {
    if (casoParaEditar) {
      setPacienteId(casoParaEditar.pacienteId);
      setMotivoRisco(casoParaEditar.motivoRisco);
      setNivelUrgencia(casoParaEditar.nivelUrgencia);
      setAcoesTexto(casoParaEditar.acoesIntensivas.join("\n"));
      setPendenciasTexto(casoParaEditar.pendencias.join("\n"));
    } else {
      setPacienteId(pacientes[0]?.id || "");
      setMotivoRisco("");
      setNivelUrgencia("Urgente");
      setAcoesTexto("");
      setPendenciasTexto("");
    }
  }, [casoParaEditar, isOpen, pacientes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !motivoRisco.trim()) {
      alert("Selecione o aluno e descreva o motivo do risco.");
      return;
    }

    const caso: CasoPrioritario = {
      id: casoParaEditar ? casoParaEditar.id : `cp-${Date.now()}`,
      pacienteId,
      motivoRisco: motivoRisco.trim(),
      nivelUrgencia,
      acoesIntensivas: linhasParaLista(acoesTexto),
      pendencias: linhasParaLista(pendenciasTexto),
      atualizadoEm: new Date().toISOString().split("T")[0],
    };

    onSalvarCaso(caso);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">
              {casoParaEditar ? "Editar Caso Prioritário" : "Novo Caso Prioritário"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Aluno / Paciente *
            </label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            >
              <option value="">Selecione...</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nível de Urgência
            </label>
            <select
              value={nivelUrgencia}
              onChange={(e) => setNivelUrgencia(e.target.value as NivelUrgencia)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            >
              <option value="Crítico">Crítico</option>
              <option value="Urgente">Urgente</option>
              <option value="Atenção Continuada">Atenção Continuada</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Motivo do Risco / Situação Urgente *
            </label>
            <textarea
              rows={2}
              required
              value={motivoRisco}
              onChange={(e) => setMotivoRisco(e.target.value)}
              placeholder="Descreva a situação de risco identificada..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ações Intensivas (uma por linha)
            </label>
            <textarea
              rows={3}
              value={acoesTexto}
              onChange={(e) => setAcoesTexto(e.target.value)}
              placeholder={"Ex: Encaminhar para avaliação neuropsicológica\nReunião quinzenal com a professora"}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pendências (uma por linha)
            </label>
            <textarea
              rows={2}
              value={pendenciasTexto}
              onChange={(e) => setPendenciasTexto(e.target.value)}
              placeholder="Ex: Aguardando retorno da avaliação neuropsicológica"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            />
          </div>

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
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{casoParaEditar ? "Salvar Alterações" : "Registrar Caso"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
