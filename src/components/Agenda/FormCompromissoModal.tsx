import React, { useEffect, useState } from "react";
import { X, Calendar, Save } from "lucide-react";
import { Compromisso, Paciente, Escola, TipoCompromisso } from "../../types";

interface FormCompromissoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  escolas: Escola[];
  onSalvarCompromisso: (compromisso: Compromisso) => void;
  compromissoParaEditar?: Compromisso | null;
}

const TIPOS: TipoCompromisso[] = [
  "Atendimento",
  "Reunião",
  "Visita à Escola",
  "Formação",
  "Devolutiva",
  "Entrega de Relatório",
];

export const FormCompromissoModal: React.FC<FormCompromissoModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  escolas,
  onSalvarCompromisso,
  compromissoParaEditar,
}) => {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<TipoCompromisso>("Atendimento");
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [escolaId, setEscolaId] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (compromissoParaEditar) {
      setTitulo(compromissoParaEditar.titulo);
      setTipo(compromissoParaEditar.tipo);
      setData(compromissoParaEditar.data);
      setHoraInicio(compromissoParaEditar.horaInicio);
      setHoraFim(compromissoParaEditar.horaFim);
      setEscolaId(compromissoParaEditar.escolaId || "");
      setPacienteId(compromissoParaEditar.pacienteId || "");
      setLocal(compromissoParaEditar.local);
      setDescricao(compromissoParaEditar.descricao);
    } else {
      setTitulo("");
      setTipo("Atendimento");
      setData(new Date().toISOString().split("T")[0]);
      setHoraInicio("");
      setHoraFim("");
      setEscolaId("");
      setPacienteId("");
      setLocal("");
      setDescricao("");
    }
  }, [compromissoParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !data || !horaInicio) {
      alert("Informe pelo menos o título, a data e o horário de início.");
      return;
    }

    const compromisso: Compromisso = {
      id: compromissoParaEditar ? compromissoParaEditar.id : `comp-${Date.now()}`,
      titulo: titulo.trim(),
      tipo,
      data,
      horaInicio,
      horaFim: horaFim || horaInicio,
      escolaId: escolaId || undefined,
      pacienteId: pacienteId || undefined,
      local: local.trim(),
      descricao: descricao.trim(),
      concluido: compromissoParaEditar?.concluido || false,
    };

    onSalvarCompromisso(compromisso);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-lilas-500/20 text-lilas-400 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">
              {compromissoParaEditar ? "Editar Compromisso" : "Novo Compromisso"}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Título *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Atendimento individual - Pedro Henrique"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoCompromisso)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data *</label>
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Início *</label>
              <input
                type="time"
                required
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fim</label>
              <input
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Escola (opcional)
              </label>
              <select
                value={escolaId}
                onChange={(e) => setEscolaId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              >
                <option value="">Nenhuma</option>
                {escolas.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aluno (opcional)
              </label>
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
              >
                <option value="">Nenhum</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Local</label>
            <input
              type="text"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="Ex: Sala de Recursos"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição</label>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-lilas-500 focus:border-lilas-500 outline-none"
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
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-lilas-600 hover:bg-lilas-500 text-white text-sm font-semibold rounded-xl shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{compromissoParaEditar ? "Salvar Alterações" : "Agendar Compromisso"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
