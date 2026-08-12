import React, { useEffect, useState } from "react";
import { X, GraduationCap, Save } from "lucide-react";
import { OrientacaoProfessor, Paciente, Escola } from "../../types";

interface FormOrientacaoProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  escolas: Escola[];
  onSalvarOrientacao: (o: OrientacaoProfessor) => void;
  orientacaoParaEditar?: OrientacaoProfessor | null;
}

const linhasParaLista = (texto: string) =>
  texto.split("\n").map((l) => l.trim()).filter(Boolean);

export const FormOrientacaoProfessorModal: React.FC<FormOrientacaoProfessorModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  escolas,
  onSalvarOrientacao,
  orientacaoParaEditar,
}) => {
  const [nomeProfessor, setNomeProfessor] = useState("");
  const [turma, setTurma] = useState("");
  const [escolaId, setEscolaId] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [dificuldadeObservada, setDificuldadeObservada] = useState("");
  const [estrategiasTexto, setEstrategiasTexto] = useState("");
  const [dataOrientacao, setDataOrientacao] = useState("");
  const [retorno, setRetorno] = useState("");
  const [status, setStatus] = useState<OrientacaoProfessor["status"]>("Pendente");

  useEffect(() => {
    if (orientacaoParaEditar) {
      setNomeProfessor(orientacaoParaEditar.nomeProfessor);
      setTurma(orientacaoParaEditar.turma);
      setEscolaId(orientacaoParaEditar.escolaId);
      setPacienteId(orientacaoParaEditar.pacienteId || "");
      setDificuldadeObservada(orientacaoParaEditar.dificuldadeObservada);
      setEstrategiasTexto(orientacaoParaEditar.estrategiasSugeridas.join("\n"));
      setDataOrientacao(orientacaoParaEditar.dataOrientacao);
      setRetorno(orientacaoParaEditar.retorno);
      setStatus(orientacaoParaEditar.status);
    } else {
      setNomeProfessor("");
      setTurma("");
      setEscolaId(escolas[0]?.id || "");
      setPacienteId("");
      setDificuldadeObservada("");
      setEstrategiasTexto("");
      setDataOrientacao(new Date().toISOString().split("T")[0]);
      setRetorno("");
      setStatus("Pendente");
    }
  }, [orientacaoParaEditar, isOpen, escolas]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeProfessor.trim() || !dificuldadeObservada.trim()) {
      alert("Informe o nome do professor e a dificuldade observada.");
      return;
    }

    const orientacao: OrientacaoProfessor = {
      id: orientacaoParaEditar ? orientacaoParaEditar.id : `orip-${Date.now()}`,
      nomeProfessor: nomeProfessor.trim(),
      turma: turma.trim(),
      escolaId,
      pacienteId: pacienteId || undefined,
      dificuldadeObservada: dificuldadeObservada.trim(),
      estrategiasSugeridas: linhasParaLista(estrategiasTexto),
      dataOrientacao,
      retorno: retorno.trim(),
      status,
    };

    onSalvarOrientacao(orientacao);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amarelo-500/20 text-amarelo-400 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">
              {orientacaoParaEditar ? "Editar Orientação" : "Nova Orientação a Professor"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Professor(a) *</label>
              <input
                type="text"
                required
                value={nomeProfessor}
                onChange={(e) => setNomeProfessor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Turma</label>
              <input
                type="text"
                value={turma}
                onChange={(e) => setTurma(e.target.value)}
                placeholder="Ex: 4º ano B"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Escola</label>
              <select
                value={escolaId}
                onChange={(e) => setEscolaId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              >
                {escolas.map((e) => (
                  <option key={e.id} value={e.id}>{e.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Aluno (opcional)</label>
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              >
                <option value="">Nenhum</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dificuldade Observada *</label>
            <textarea
              rows={2}
              required
              value={dificuldadeObservada}
              onChange={(e) => setDificuldadeObservada(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estratégias Sugeridas (uma por linha)
            </label>
            <textarea
              rows={3}
              value={estrategiasTexto}
              onChange={(e) => setEstrategiasTexto(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Retorno / Feedback</label>
            <textarea
              rows={2}
              value={retorno}
              onChange={(e) => setRetorno(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data</label>
              <input
                type="date"
                value={dataOrientacao}
                onChange={(e) => setDataOrientacao(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrientacaoProfessor["status"])}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amarelo-500 focus:border-amarelo-500 outline-none"
              >
                <option value="Pendente">Pendente</option>
                <option value="Em Acompanhamento">Em Acompanhamento</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-5 py-2 bg-amarelo-600 hover:bg-amarelo-500 text-white text-sm font-semibold rounded-xl shadow transition-colors">
              <Save className="w-4 h-4" />
              <span>{orientacaoParaEditar ? "Salvar Alterações" : "Registrar Orientação"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
