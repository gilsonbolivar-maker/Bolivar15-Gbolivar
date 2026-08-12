import React, { useEffect, useState } from "react";
import { X, Building2, Save } from "lucide-react";
import { Escola } from "../../types";

interface FormEscolaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvarEscola: (escola: Escola) => void;
  escolaParaEditar?: Escola | null;
}

const DIAS_SEMANA = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
];

export const FormEscolaModal: React.FC<FormEscolaModalProps> = ({
  isOpen,
  onClose,
  onSalvarEscola,
  escolaParaEditar,
}) => {
  const [nome, setNome] = useState("");
  const [diretor, setDiretor] = useState("");
  const [coordenador, setCoordenador] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [diasAtendimento, setDiasAtendimento] = useState<string[]>([]);
  const [horarioAtendimento, setHorarioAtendimento] = useState("");
  const [numeroAlunos, setNumeroAlunos] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    if (escolaParaEditar) {
      setNome(escolaParaEditar.nome);
      setDiretor(escolaParaEditar.diretor);
      setCoordenador(escolaParaEditar.coordenador);
      setTelefone(escolaParaEditar.telefone);
      setEndereco(escolaParaEditar.endereco);
      setDiasAtendimento(escolaParaEditar.diasAtendimento);
      setHorarioAtendimento(escolaParaEditar.horarioAtendimento);
      setNumeroAlunos(String(escolaParaEditar.numeroAlunos));
      setObservacoes(escolaParaEditar.observacoes);
    } else {
      setNome("");
      setDiretor("");
      setCoordenador("");
      setTelefone("");
      setEndereco("");
      setDiasAtendimento([]);
      setHorarioAtendimento("");
      setNumeroAlunos("");
      setObservacoes("");
    }
  }, [escolaParaEditar, isOpen]);

  if (!isOpen) return null;

  const toggleDia = (dia: string) => {
    setDiasAtendimento((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Por favor, informe pelo menos o nome da escola.");
      return;
    }

    const escola: Escola = {
      id: escolaParaEditar ? escolaParaEditar.id : `esc-${Date.now()}`,
      nome: nome.trim(),
      diretor: diretor.trim(),
      coordenador: coordenador.trim(),
      telefone: telefone.trim(),
      endereco: endereco.trim(),
      diasAtendimento,
      horarioAtendimento: horarioAtendimento.trim(),
      numeroAlunos: parseInt(numeroAlunos, 10) || 0,
      observacoes: observacoes.trim(),
    };

    onSalvarEscola(escola);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-verdep-500/20 text-verdep-400 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">
              {escolaParaEditar ? "Editar Escola" : "Cadastrar Nova Escola"}
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
              Nome da Escola *
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Escola Municipal Paulo Freire"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-verdep-500 focus:border-verdep-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diretor(a)
              </label>
              <input
                type="text"
                value={diretor}
                onChange={(e) => setDiretor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-verdep-500 focus:border-verdep-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Coordenador(a)
              </label>
              <input
                type="text"
                value={coordenador}
                onChange={(e) => setCoordenador(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-verdep-500 focus:border-verdep-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 90000-0000"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-verdep-500 focus:border-verdep-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nº de Alunos Matriculados
              </label>
              <input
                type="number"
                min={0}
                value={numeroAlunos}
                onChange={(e) => setNumeroAlunos(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-verdep-500 focus:border-verdep-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-verdep-500 focus:border-verdep-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Dias de Atendimento
            </label>
            <div className="flex flex-wrap gap-2">
              {DIAS_SEMANA.map((dia) => {
                const selected = diasAtendimento.includes(dia);
                return (
                  <button
                    type="button"
                    key={dia}
                    onClick={() => toggleDia(dia)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                      selected
                        ? "bg-verdep-50 text-verdep-700 border-verdep-300 font-semibold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {dia}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Horário de Atendimento
            </label>
            <input
              type="text"
              value={horarioAtendimento}
              onChange={(e) => setHorarioAtendimento(e.target.value)}
              placeholder="Ex: 08:00 - 12:00"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-verdep-500 focus:border-verdep-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-verdep-500 focus:border-verdep-500 outline-none"
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
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-verdep-600 hover:bg-verdep-500 text-white text-sm font-semibold rounded-xl shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{escolaParaEditar ? "Salvar Alterações" : "Cadastrar Escola"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
