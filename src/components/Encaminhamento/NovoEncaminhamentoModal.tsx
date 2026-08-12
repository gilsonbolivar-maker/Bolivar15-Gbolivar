import React, { useState, useEffect } from "react";
import { X, Send, Sparkles, Save, ShieldAlert, Building, Camera } from "lucide-react";
import { Paciente, Encaminhamento, Prioridade } from "../../types";
import { AiDocumentScannerModal, ExtractedDocumentData } from "../AiDocumentScannerModal";

interface NovoEncaminhamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  pacientePreSelecionado?: Paciente | null;
  onSaveEncaminhamento: (encaminhamento: Encaminhamento) => void;
}

const SETORES_DESTINO_OPCOES = [
  "CAPS I / II - Centro de Atenção Psicossocial",
  "Hospital Regional - Ambulatório de Especialidades",
  "CREAS - Centro de Referência Especializado de Assistência Social",
  "CRAS - Centro de Referência de Assistência Social",
  "CIAT - Centro Integrado de Apoio ao Trabalhador",
  "Defensoria Pública do Estado / Apoio Jurídico",
  "UBS - Unidade Básica de Saúde",
  "Clínica de Fisioterapia e Reabilitação",
];

const ESPECIALIDADES_OPCOES = [
  "Psiquiatria e Saúde Mental",
  "Neurologia",
  "Ortopedia e Traumatologia",
  "Cardiologia",
  "Pneumologia / Espirometria",
  "Assistência Social e Proteção Especial",
  "Orientação Profissional e Emprego",
  "Ginecologia e Obstetrícia",
];

export const NovoEncaminhamentoModal: React.FC<NovoEncaminhamentoModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  pacientePreSelecionado,
  onSaveEncaminhamento,
}) => {
  const [pacienteId, setPacienteId] = useState("");
  const [setorOrigem, setSetorOrigem] = useState("Acolhimento Multidisciplinar");
  const [profissionalEmissor, setProfissionalEmissor] = useState("Dra. Débora Costa");
  const [cargoEmissor, setCargoEmissor] = useState("Psicóloga - CRP 03/24682");
  const [setorDestino, setSetorDestino] = useState(SETORES_DESTINO_OPCOES[0]);
  const [especialidadeDestino, setEspecialidadeDestino] = useState(ESPECIALIDADES_OPCOES[0]);
  const [prioridade, setPrioridade] = useState<Prioridade>("Prioritário");
  const [motivoEncaminhamento, setMotivoEncaminhamento] = useState("");
  const [justificativaTecnica, setJustificativaTecnica] = useState("");
  const [hipoteseDiagnostica, setHipoteseDiagnostica] = useState("");
  const [gerandoIa, setGerandoIa] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleDataExtracted = (data: ExtractedDocumentData) => {
    if (data.encSetorOrigem) setSetorOrigem(data.encSetorOrigem);
    if (data.encProfissional) setProfissionalEmissor(data.encProfissional);
    if (data.encSetorDestino) setSetorDestino(data.encSetorDestino);
    if (data.encEspecialidade) setEspecialidadeDestino(data.encEspecialidade);
    if (data.encPrioridade && ["Rotina", "Prioritário", "Urgente"].includes(data.encPrioridade)) {
      setPrioridade(data.encPrioridade as any);
    }
    if (data.encMotivo) setMotivoEncaminhamento(data.encMotivo);
    if (data.encJustificativa) setJustificativaTecnica(data.encJustificativa);
    if (data.atendimentoCid) setHipoteseDiagnostica(data.atendimentoCid);

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

  const handleGerarIa = async () => {
    if (!pacienteAtual || !motivoEncaminhamento.trim()) {
      alert("Selecione o aluno e descreva o motivo do encaminhamento primeiro.");
      return;
    }

    setGerandoIa(true);
    try {
      const res = await fetch("/api/ai/encaminhamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteNome: pacienteAtual.nome,
          motivo: motivoEncaminhamento.trim(),
          setorOrigem,
          setorDestino,
          prioridade,
          observacoes: `Vulnerabilidades: ${pacienteAtual.vulnerabilidades.join(", ")}`,
        }),
      });

      const data = await res.json();
      if (data.textoEncaminhamento) {
        setJustificativaTecnica(data.textoEncaminhamento);
      } else {
        alert(data.error || "Não foi possível gerar a justificativa.");
      }
    } catch (err: any) {
      alert("Erro ao conectar com assistente IA: " + err.message);
    } finally {
      setGerandoIa(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteAtual || !motivoEncaminhamento.trim()) {
      alert("Preencha o motivo do encaminhamento.");
      return;
    }

    const novoEnc: Encaminhamento = {
      id: `enc-${Date.now()}`,
      pacienteId: pacienteAtual.id,
      pacienteNome: pacienteAtual.nome,
      pacienteCpf: pacienteAtual.cpf,
      setorOrigem: setorOrigem.trim(),
      profissionalEmissor: profissionalEmissor.trim(),
      cargoEmissor: cargoEmissor.trim(),
      setorDestino: setorDestino.trim(),
      especialidadeDestino: especialidadeDestino.trim(),
      prioridade,
      motivoEncaminhamento: motivoEncaminhamento.trim(),
      justificativaTecnica:
        justificativaTecnica.trim() ||
        `Solicitação de encaminhamento para ${setorDestino} referente a: ${motivoEncaminhamento.trim()}`,
      hipoteseDiagnostica: hipoteseDiagnostica.trim() || undefined,
      dataEmissao: new Date().toISOString().split("T")[0],
      status: "Pendente",
    };

    onSaveEncaminhamento(novoEnc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-lilas-500/20 text-lilas-400 rounded-lg">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Emitir Guia de Encaminhamento</h3>
              <p className="text-xs text-slate-400">
                Encaminhamento intersetorial de saúde, assistência e especialidades
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Banner de Preenchimento com IA */}
          <div className="p-3 bg-gradient-to-r from-lilas-50 via-indigo-50 to-lilas-50 border border-lilas-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-lilas-600 text-white rounded-xl shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block">
                  Preencher Guia de Encaminhamento com IA
                </span>
                <p className="text-[11px] text-slate-600">
                  Tire foto de laudo, requisição ou papel de encaminhamento.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-3.5 py-1.5 bg-lilas-600 hover:bg-lilas-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Escanear Guia</span>
            </button>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Selecione o Aluno / Paciente *
            </label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold outline-none"
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
              <label className="block font-semibold text-slate-700 mb-1">
                Setor / Serviço de Origem
              </label>
              <input
                type="text"
                required
                value={setorOrigem}
                onChange={(e) => setSetorOrigem(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Profissional Emissor
              </label>
              <input
                type="text"
                required
                value={profissionalEmissor}
                onChange={(e) => setProfissionalEmissor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Setor de Destino *
              </label>
              <input
                type="text"
                required
                list="setoresDestino"
                value={setorDestino}
                onChange={(e) => setSetorDestino(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
              />
              <datalist id="setoresDestino">
                {SETORES_DESTINO_OPCOES.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Especialidade Solicitada
              </label>
              <input
                type="text"
                required
                list="especialidades"
                value={especialidadeDestino}
                onChange={(e) => setEspecialidadeDestino(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
              />
              <datalist id="especialidades">
                {ESPECIALIDADES_OPCOES.map((esp) => (
                  <option key={esp} value={esp} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nível de Urgência *
              </label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as Prioridade)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold outline-none"
              >
                <option value="Rotina">Rotina</option>
                <option value="Prioritário">Prioritário</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Motivo Principal / Demanda do Encaminhamento *
            </label>
            <input
              type="text"
              required
              value={motivoEncaminhamento}
              onChange={(e) => setMotivoEncaminhamento(e.target.value)}
              placeholder="Ex: Avaliação médica psiquiátrica e acompanhamento intensivo."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Hipótese Diagnóstica / CID-10 (se houver)
            </label>
            <input
              type="text"
              value={hipoteseDiagnostica}
              onChange={(e) => setHipoteseDiagnostica(e.target.value)}
              placeholder="Ex: F41.1 - Transtorno Ansioso Depressivo"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700">
                Justificativa Técnica e Parecer de Encaminhamento
              </label>

              <button
                type="button"
                onClick={handleGerarIa}
                disabled={gerandoIa}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-lilas-800 hover:text-lilas-950 bg-lilas-50 px-2 py-0.5 rounded border border-lilas-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-lilas-600" />
                {gerandoIa ? "Redigindo Guia..." : "Redigir Guia com IA"}
              </button>
            </div>

            <textarea
              rows={4}
              value={justificativaTecnica}
              onChange={(e) => setJustificativaTecnica(e.target.value)}
              placeholder="Apresente os elementos clínicos, familiares e sociais que fundamentam a necessidade do encaminhamento..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
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
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-lilas-600 hover:bg-lilas-500 text-white text-sm font-semibold rounded-xl shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Emitir Encaminhamento</span>
            </button>
          </div>
        </form>
      </div>

      <AiDocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        targetFormName="Guia de Encaminhamento"
        onDataExtracted={handleDataExtracted}
      />
    </div>
  );
};
