import React, { useState, useEffect } from "react";
import { X, UserCheck, Send, Sparkles, Save, User, Camera } from "lucide-react";
import {
  Paciente,
  AtendimentoIndividual,
  TipoAtendimentoIndividual,
  Encaminhamento,
  Prioridade,
} from "../../types";
import { AiDocumentScannerModal, ExtractedDocumentData } from "../AiDocumentScannerModal";

interface NovoAtendimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  pacientePreSelecionado?: Paciente | null;
  onSaveAtendimento: (
    atendimento: AtendimentoIndividual,
    encaminhamentoAuto?: Encaminhamento
  ) => void;
}

export const NovoAtendimentoModal: React.FC<NovoAtendimentoModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  pacientePreSelecionado,
  onSaveAtendimento,
}) => {
  const [pacienteId, setPacienteId] = useState("");
  const [profissionalNome, setProfissionalNome] = useState("Dra. Débora Costa");
  const [profissionalCargo, setProfissionalCargo] = useState("Psicóloga - CRP 03/24682");
  const [tipoAtendimento, setTipoAtendimento] =
    useState<TipoAtendimentoIndividual>("Acolhimento");
  const [demandaMotivo, setDemandaMotivo] = useState("");
  const [prontuarioNotas, setProntuarioNotas] = useState("");
  const [diagnosticoCid, setDiagnosticoCid] = useState("");

  // Evolução clínica detalhada (origem: integração com o app PsicoEscolar do Lovable)
  const [objetivos, setObjetivos] = useState("");
  const [planoIntervencao, setPlanoIntervencao] = useState("");
  const [tecnicasUtilizadas, setTecnicasUtilizadas] = useState("");
  const [respostaCrianca, setRespostaCrianca] = useState("");
  const [orientacoesFornecidas, setOrientacoesFornecidas] = useState("");
  const [proximosPassos, setProximosPassos] = useState("");

  // Campo de encaminhamento embutido na mesma tela
  const [gerarEncaminhamento, setGerarEncaminhamento] = useState(false);
  const [setorDestino, setSetorDestino] = useState("CAPS II - Saúde Mental");
  const [especialidadeDestino, setEspecialidadeDestino] = useState("Psiquiatria");
  const [prioridadeEnc, setPrioridadeEnc] = useState<Prioridade>("Prioritário");
  const [justificativaEnc, setJustificativaEnc] = useState("");
  const [gerandoIaEnc, setGerandoIaEnc] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleDataExtracted = (data: ExtractedDocumentData) => {
    if (data.atendimentoDemanda) setDemandaMotivo(data.atendimentoDemanda);
    if (data.atendimentoNotas) setProntuarioNotas(data.atendimentoNotas);
    if (data.atendimentoCid) setDiagnosticoCid(data.atendimentoCid);
    if (data.profissionalNome) setProfissionalNome(data.profissionalNome);
    if (data.profissionalCargo) setProfissionalCargo(data.profissionalCargo);
    if (data.atendimentoTipo) setTipoAtendimento(data.atendimentoTipo as any);

    // Check if patient name in data matches any existing patient
    if (data.nome) {
      const match = pacientes.find(
        (p) =>
          p.nome.toLowerCase().includes(data.nome!.toLowerCase()) ||
          (data.cpf && p.cpf.replace(/\D/g, "") === data.cpf.replace(/\D/g, ""))
      );
      if (match) setPacienteId(match.id);
    }
  };

  useEffect(() => {
    if (pacientePreSelecionado) {
      setPacienteId(pacientePreSelecionado.id);
    } else if (pacientes.length > 0) {
      setPacienteId(pacientes[0].id);
    }
  }, [pacientePreSelecionado, pacientes, isOpen]);

  if (!isOpen) return null;

  const pacienteAtual = pacientes.find((p) => p.id === pacienteId);

  const handleGerarJustificativaIa = async () => {
    if (!pacienteAtual || !demandaMotivo) {
      alert("Informe o aluno e a demanda da consulta primeiro.");
      return;
    }

    setGerandoIaEnc(true);
    try {
      const res = await fetch("/api/ai/encaminhamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteNome: pacienteAtual.nome,
          motivo: demandaMotivo,
          setorOrigem: "Acolhimento Psicossocial",
          setorDestino,
          prioridade: prioridadeEnc,
          observacoes: prontuarioNotas,
        }),
      });

      const data = await res.json();
      if (data.textoEncaminhamento) {
        setJustificativaEnc(data.textoEncaminhamento);
      } else {
        alert(data.error || "Não foi possível gerar texto automático.");
      }
    } catch (err: any) {
      alert("Erro ao conectar com assistente IA: " + err.message);
    } finally {
      setGerandoIaEnc(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteAtual || !demandaMotivo.trim() || !prontuarioNotas.trim()) {
      alert("Por favor, preencha o motivo e as anotações do prontuário.");
      return;
    }

    const novoEncId = gerarEncaminhamento ? `enc-${Date.now()}` : undefined;

    const novoAtendimento: AtendimentoIndividual = {
      id: `atend-${Date.now()}`,
      pacienteId: pacienteAtual.id,
      pacienteNome: pacienteAtual.nome,
      profissionalNome: profissionalNome.trim(),
      profissionalCargo: profissionalCargo.trim(),
      dataHora: new Date().toISOString(),
      tipoAtendimento,
      demandaMotivo: demandaMotivo.trim(),
      prontuarioNotas: prontuarioNotas.trim(),
      diagnosticoCid: diagnosticoCid.trim() || undefined,
      status: "Concluido",
      encaminhadoNaSessao: gerarEncaminhamento,
      encaminhamentoIdGerado: novoEncId,
      objetivos: objetivos.trim() || undefined,
      planoIntervencao: planoIntervencao.trim() || undefined,
      tecnicasUtilizadas: tecnicasUtilizadas
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      respostaCrianca: respostaCrianca.trim() || undefined,
      orientacoesFornecidas: orientacoesFornecidas.trim() || undefined,
      proximosPassos: proximosPassos.trim() || undefined,
    };

    let encaminhamentoCriado: Encaminhamento | undefined;

    if (gerarEncaminhamento) {
      encaminhamentoCriado = {
        id: novoEncId!,
        pacienteId: pacienteAtual.id,
        pacienteNome: pacienteAtual.nome,
        pacienteCpf: pacienteAtual.cpf,
        setorOrigem: "Atendimento Individual",
        profissionalEmissor: profissionalNome.trim(),
        cargoEmissor: profissionalCargo.trim(),
        setorDestino: setorDestino.trim(),
        especialidadeDestino: especialidadeDestino.trim(),
        prioridade: prioridadeEnc,
        motivoEncaminhamento: demandaMotivo.trim(),
        justificativaTecnica:
          justificativaEnc.trim() ||
          `Encaminhado no atendimento individual do dia ${new Date().toLocaleDateString("pt-BR")}. Demanda: ${demandaMotivo.trim()}`,
        hipoteseDiagnostica: diagnosticoCid.trim() || undefined,
        dataEmissao: new Date().toISOString().split("T")[0],
        status: "Pendente",
        atendimentoOrigemId: novoAtendimento.id,
      };
    }

    onSaveAtendimento(novoAtendimento, encaminhamentoCriado);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Registrar Atendimento Individual</h3>
              <p className="text-xs text-slate-400">
                Escuta qualificada, consulta e registro em prontuário
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Banner de Preenchimento com IA */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-indigo-50 to-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block">
                  Ler Ficha ou Prontuário Manuscrito com IA
                </span>
                <p className="text-[11px] text-slate-600">
                  Fotografe anotações de papel ou prontuário para preencher o atendimento.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Escanear Documento</span>
            </button>
          </div>

          {/* Seleção do Paciente */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Selecione o Aluno / Paciente *
            </label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-medium"
            >
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} (CPF: {p.cpf})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo de Atendimento
              </label>
              <select
                value={tipoAtendimento}
                onChange={(e) =>
                  setTipoAtendimento(e.target.value as TipoAtendimentoIndividual)
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Acolhimento">Acolhimento Inicial</option>
                <option value="Consulta Terapêutica">Consulta Terapêutica</option>
                <option value="Atendimento Social">Atendimento Social</option>
                <option value="Visita Domiciliar">Visita Domiciliar</option>
                <option value="Teleatendimento">Teleatendimento</option>
                <option value="Retorno">Consulta de Retorno</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CID-10 / Hipótese Diagnóstica (opcional)
              </label>
              <input
                type="text"
                value={diagnosticoCid}
                onChange={(e) => setDiagnosticoCid(e.target.value)}
                placeholder="Ex: F41.1 - Ansiedade Generalizada"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Profissional Responsável
              </label>
              <input
                type="text"
                required
                value={profissionalNome}
                onChange={(e) => setProfissionalNome(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cargo / Especialidade
              </label>
              <input
                type="text"
                required
                value={profissionalCargo}
                onChange={(e) => setProfissionalCargo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Motivo do Atendimento / Demanda do Aluno *
            </label>
            <input
              type="text"
              required
              value={demandaMotivo}
              onChange={(e) => setDemandaMotivo(e.target.value)}
              placeholder="Ex: Queixa de ansiedade severa, insônia e pedido de apoio social."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Evolução e Anotações no Prontuário *
            </label>
            <textarea
              rows={4}
              required
              value={prontuarioNotas}
              onChange={(e) => setProntuarioNotas(e.target.value)}
              placeholder="Descreva a escuta realizada, condutas adotadas e combinados com o aluno..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Evolução Clínica Detalhada (opcional) */}
          <div className="pt-3 border-t border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Evolução Clínica Detalhada (opcional)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Objetivos da Sessão
                </label>
                <textarea
                  rows={2}
                  value={objetivos}
                  onChange={(e) => setObjetivos(e.target.value)}
                  placeholder="O que se pretendia trabalhar nesta sessão..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plano de Intervenção
                </label>
                <textarea
                  rows={2}
                  value={planoIntervencao}
                  onChange={(e) => setPlanoIntervencao(e.target.value)}
                  placeholder="Estratégia clínica planejada para o caso..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Técnicas Utilizadas (separadas por vírgula)
              </label>
              <input
                type="text"
                value={tecnicasUtilizadas}
                onChange={(e) => setTecnicasUtilizadas(e.target.value)}
                placeholder="Ex: Escuta ativa, Reforço positivo, Respiração guiada"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resposta do Aluno / Criança
                </label>
                <textarea
                  rows={2}
                  value={respostaCrianca}
                  onChange={(e) => setRespostaCrianca(e.target.value)}
                  placeholder="Como o aluno reagiu às intervenções propostas..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Orientações Fornecidas
                </label>
                <textarea
                  rows={2}
                  value={orientacoesFornecidas}
                  onChange={(e) => setOrientacoesFornecidas(e.target.value)}
                  placeholder="Orientações dadas ao aluno, família ou escola..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Próximos Passos
              </label>
              <textarea
                rows={2}
                value={proximosPassos}
                onChange={(e) => setProximosPassos(e.target.value)}
                placeholder="O que está planejado para a próxima sessão..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Opção de Encaminhamento Imediato */}
          <div className="pt-3 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer bg-amber-50/80 p-3 rounded-xl border border-amber-200">
              <input
                type="checkbox"
                checked={gerarEncaminhamento}
                onChange={(e) => setGerarEncaminhamento(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                  <Send className="w-3.5 h-3.5 text-amber-600" />
                  Emitir Guia de Encaminhamento a partir deste atendimento
                </span>
                <p className="text-[11px] text-slate-600">
                  Gera automaticamente um encaminhamento pendente para a rede de especialidades.
                </p>
              </div>
            </label>

            {gerarEncaminhamento && (
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Setor de Destino
                    </label>
                    <input
                      type="text"
                      value={setorDestino}
                      onChange={(e) => setSetorDestino(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Especialidade
                    </label>
                    <input
                      type="text"
                      value={especialidadeDestino}
                      onChange={(e) => setEspecialidadeDestino(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Urgência / Prioridade
                    </label>
                    <select
                      value={prioridadeEnc}
                      onChange={(e) => setPrioridadeEnc(e.target.value as Prioridade)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                    >
                      <option value="Rotina">Rotina</option>
                      <option value="Prioritário">Prioritário</option>
                      <option value="Urgente">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Justificativa Técnica do Encaminhamento
                    </label>

                    <button
                      type="button"
                      onClick={handleGerarJustificativaIa}
                      disabled={gerandoIaEnc}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      {gerandoIaEnc ? "Redigindo..." : "Gerar Texto com IA"}
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={justificativaEnc}
                    onChange={(e) => setJustificativaEnc(e.target.value)}
                    placeholder="Especifique os aspectos clínicos e sociais que justificam o encaminhamento..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
                  />
                </div>
              </div>
            )}
          </div>

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
              <span>Concluir Atendimento</span>
            </button>
          </div>
        </form>
      </div>

      <AiDocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        targetFormName="Atendimento Individual / Prontuário"
        onDataExtracted={handleDataExtracted}
      />
    </div>
  );
};
