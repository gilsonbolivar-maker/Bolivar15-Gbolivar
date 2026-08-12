import React, { useEffect, useState } from "react";
import { X, HeartHandshake, Save } from "lucide-react";
import { AtendimentoFamilia, Paciente } from "../../types";

interface FormAtendimentoFamiliaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  onSalvarAtendimento: (a: AtendimentoFamilia) => void;
  atendimentoParaEditar?: AtendimentoFamilia | null;
}

export const FormAtendimentoFamiliaModal: React.FC<FormAtendimentoFamiliaModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  onSalvarAtendimento,
  atendimentoParaEditar,
}) => {
  const [pacienteId, setPacienteId] = useState("");
  const [data, setData] = useState("");
  const [responsavelPresente, setResponsavelPresente] = useState("");
  const [assunto, setAssunto] = useState("");
  const [orientacoes, setOrientacoes] = useState("");
  const [encaminhamentos, setEncaminhamentos] = useState("");
  const [proximoContato, setProximoContato] = useState("");

  useEffect(() => {
    if (atendimentoParaEditar) {
      setPacienteId(atendimentoParaEditar.pacienteId);
      setData(atendimentoParaEditar.data);
      setResponsavelPresente(atendimentoParaEditar.responsavelPresente);
      setAssunto(atendimentoParaEditar.assunto);
      setOrientacoes(atendimentoParaEditar.orientacoes);
      setEncaminhamentos(atendimentoParaEditar.encaminhamentos);
      setProximoContato(atendimentoParaEditar.proximoContato || "");
    } else {
      setPacienteId(pacientes[0]?.id || "");
      setData(new Date().toISOString().split("T")[0]);
      setResponsavelPresente("");
      setAssunto("");
      setOrientacoes("");
      setEncaminhamentos("");
      setProximoContato("");
    }
  }, [atendimentoParaEditar, isOpen, pacientes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !assunto.trim()) {
      alert("Selecione o aluno e informe o assunto tratado.");
      return;
    }

    const atendimento: AtendimentoFamilia = {
      id: atendimentoParaEditar ? atendimentoParaEditar.id : `fam-${Date.now()}`,
      pacienteId,
      data,
      responsavelPresente: responsavelPresente.trim(),
      assunto: assunto.trim(),
      orientacoes: orientacoes.trim(),
      encaminhamentos: encaminhamentos.trim(),
      proximoContato: proximoContato || undefined,
    };

    onSalvarAtendimento(atendimento);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-pink-500/20 text-pink-400 rounded-lg">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">
              {atendimentoParaEditar ? "Editar Atendimento a Família" : "Novo Atendimento a Família"}
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
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
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
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Responsável Presente</label>
            <input
              type="text"
              value={responsavelPresente}
              onChange={(e) => setResponsavelPresente(e.target.value)}
              placeholder="Ex: Patrícia Cardoso (mãe)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assunto *</label>
            <input
              type="text"
              required
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Orientações</label>
            <textarea
              rows={2}
              value={orientacoes}
              onChange={(e) => setOrientacoes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Encaminhamentos</label>
            <textarea
              rows={2}
              value={encaminhamentos}
              onChange={(e) => setEncaminhamentos(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Próximo Contato (opcional)</label>
            <input
              type="date"
              value={proximoContato}
              onChange={(e) => setProximoContato(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold rounded-xl shadow transition-colors">
              <Save className="w-4 h-4" />
              <span>{atendimentoParaEditar ? "Salvar Alterações" : "Registrar Atendimento"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
