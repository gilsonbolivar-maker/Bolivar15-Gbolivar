import React, { useState } from "react";
import {
  X,
  User,
  UserCheck,
  Users,
  Send,
  Sparkles,
  Calendar,
  Phone,
  MapPin,
  ShieldAlert,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Paciente,
  AtendimentoIndividual,
  GrupoAtendimento,
  SessaoGrupo,
  Encaminhamento,
} from "../../types";

interface ProntuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
  atendimentos: AtendimentoIndividual[];
  grupos: GrupoAtendimento[];
  sessoesGrupo: SessaoGrupo[];
  encaminhamentos: Encaminhamento[];
  onOpenNovoAtendimento: (paciente: Paciente) => void;
  onOpenNovoEncaminhamento: (paciente: Paciente) => void;
}

export const ProntuarioModal: React.FC<ProntuarioModalProps> = ({
  isOpen,
  onClose,
  paciente,
  atendimentos,
  grupos,
  sessoesGrupo,
  encaminhamentos,
  onOpenNovoAtendimento,
  onOpenNovoEncaminhamento,
}) => {
  const [activeTab, setActiveTab] = useState<
    "linha-tempo" | "atendimentos" | "grupos" | "encaminhamentos"
  >("linha-tempo");
  const [sinteseIa, setSinteseIa] = useState<string | null>(null);
  const [loadingSintese, setLoadingSintese] = useState(false);

  if (!isOpen || !paciente) return null;

  const meusAtendimentos = atendimentos.filter(
    (a) => a.pacienteId === paciente.id
  );
  const meusGrupos = grupos.filter((g) =>
    g.participantesIds.includes(paciente.id)
  );
  const meusEncaminhamentos = encaminhamentos.filter(
    (e) => e.pacienteId === paciente.id
  );

  // Minhas presenças em sessões
  const minhasSessoes = sessoesGrupo.filter((s) => {
    return s.presencas && s.presencas[paciente.id] !== undefined;
  });

  const handleGerarSinteseIa = async () => {
    setLoadingSintese(true);
    try {
      const res = await fetch("/api/ai/sintese-prontuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteNome: paciente.nome,
          historicoAtendimentos: meusAtendimentos,
          grupos: meusGrupos,
          encaminhamentos: meusEncaminhamentos,
        }),
      });

      const data = await res.json();
      if (data.sintese) {
        setSinteseIa(data.sintese);
      } else {
        alert(data.error || "Não foi possível gerar a síntese.");
      }
    } catch (err: any) {
      alert("Erro ao conectar com assistente IA: " + err.message);
    } finally {
      setLoadingSintese(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl">{paciente.nome}</h3>
                {paciente.nomeSocial && (
                  <span className="text-xs font-normal text-slate-300">
                    ({paciente.nomeSocial})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                CPF: {paciente.cpf} • Cartão SUS: {paciente.cartaoSus || "Não informado"} • Nasc: {new Date(paciente.dataNascimento).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGerarSinteseIa}
              disabled={loadingSintese}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loadingSintese ? "Gerando..." : "Síntese IA do Caso"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resumo Rápido & Vulnerabilidades */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Contato & Endereço
            </span>
            <p className="text-slate-800 font-medium">{paciente.telefone}</p>
            <p className="text-slate-600 truncate">{paciente.endereco} - {paciente.bairro}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Vulnerabilidades Identificadas
            </span>
            <div className="flex flex-wrap gap-1">
              {paciente.vulnerabilidades.length > 0 ? (
                paciente.vulnerabilidades.map((v) => (
                  <span
                    key={v}
                    className="px-2 py-0.5 bg-rose-100 text-rose-800 font-semibold rounded text-[10px]"
                  >
                    {v}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">Nenhuma registrada</span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Ações Rápidas de Atendimento
            </span>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenNovoAtendimento(paciente);
                }}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-[11px] transition-colors"
              >
                + Novo Atend. Indiv.
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenNovoEncaminhamento(paciente);
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded text-[11px] transition-colors"
              >
                + Encaminhar
              </button>
            </div>
          </div>
        </div>

        {/* AI Synthesis Box (If generated) */}
        {sinteseIa && (
          <div className="m-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-900 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Síntese Técnica Gerada por Inteligência Artificial
              </span>
              <button
                onClick={() => setSinteseIa(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                Fechar síntese
              </button>
            </div>
            <div className="text-slate-700 whitespace-pre-line leading-relaxed">
              {sinteseIa}
            </div>
          </div>
        )}

        {/* Sub-Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab("linha-tempo")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "linha-tempo"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Linha do Tempo Unificada ({meusAtendimentos.length + minhasSessoes.length + meusEncaminhamentos.length})
          </button>
          <button
            onClick={() => setActiveTab("atendimentos")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "atendimentos"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Atendimentos Individuais ({meusAtendimentos.length})
          </button>
          <button
            onClick={() => setActiveTab("grupos")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "grupos"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Atendimento em Grupo ({meusGrupos.length})
          </button>
          <button
            onClick={() => setActiveTab("encaminhamentos")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "encaminhamentos"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Encaminhamentos ({meusEncaminhamentos.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: Linha do Tempo Unificada */}
          {activeTab === "linha-tempo" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Histórico Cronológico Integrado
              </h4>

              <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
                {/* Individuais */}
                {meusAtendimentos.map((at) => (
                  <div key={at.id} className="relative group">
                    <div className="absolute -left-[31px] top-1 p-1 bg-emerald-600 text-white rounded-full">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Atendimento Individual • {at.tipoAtendimento}
                        </span>
                        <span className="text-slate-400">
                          {new Date(at.dataHora).toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        {at.demandaMotivo}
                      </p>
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200/60 leading-relaxed">
                        {at.prontuarioNotas}
                      </p>
                      <div className="text-[11px] text-slate-500">
                        Profissional: <strong>{at.profissionalNome}</strong> ({at.profissionalCargo})
                      </div>
                    </div>
                  </div>
                ))}

                {/* Grupos */}
                {minhasSessoes.map((ses) => {
                  const presenca = ses.presencas[paciente.id];
                  return (
                    <div key={ses.id} className="relative group">
                      <div className="absolute -left-[31px] top-1 p-1 bg-indigo-600 text-white rounded-full">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            Atendimento em Grupo • {ses.grupoNome}
                          </span>
                          <span className="text-slate-400">
                            {new Date(ses.dataHora).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800">
                          Tema da Sessão: {ses.temaSessao}
                        </p>
                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200/60">
                          <strong>Presença:</strong>{" "}
                          <span className={presenca?.presente ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                            {presenca?.presente ? "Presente ✓" : "Ausente ✗"}
                          </span>{" "}
                          {presenca?.observacaoIndividual && `- Observação: ${presenca.observacaoIndividual}`}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Encaminhamentos */}
                {meusEncaminhamentos.map((enc) => (
                  <div key={enc.id} className="relative group">
                    <div className="absolute -left-[31px] top-1 p-1 bg-amber-600 text-white rounded-full">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Encaminhamento Emitido • Status: {enc.status}
                        </span>
                        <span className="text-slate-400">{enc.dataEmissao}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        Destino: {enc.setorDestino} ({enc.especialidadeDestino})
                      </p>
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200/60">
                        {enc.motivoEncaminhamento}
                      </p>
                      {enc.contraEncaminhamento && (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 space-y-1">
                          <strong className="text-emerald-800">Parecer de Contra-Encaminhamento Devolvido:</strong>
                          <p>{enc.contraEncaminhamento.parecerTecnico}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Atendimentos Individuais */}
          {activeTab === "atendimentos" && (
            <div className="space-y-4">
              {meusAtendimentos.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Nenhum atendimento individual registrado para este cidadão.
                </div>
              ) : (
                meusAtendimentos.map((at) => (
                  <div
                    key={at.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{at.tipoAtendimento}</span>
                      <span className="text-slate-400 font-normal">
                        {new Date(at.dataHora).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold">
                      Motivo: {at.demandaMotivo}
                    </p>
                    <p className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-200 whitespace-pre-line">
                      {at.prontuarioNotas}
                    </p>
                    <div className="text-xs text-slate-500">
                      Responsável: {at.profissionalNome} ({at.profissionalCargo})
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Grupos */}
          {activeTab === "grupos" && (
            <div className="space-y-4">
              {meusGrupos.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  O cidadão não está inscrito em nenhum grupo no momento.
                </div>
              ) : (
                meusGrupos.map((g) => (
                  <div
                    key={g.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900 text-sm">{g.nome}</h5>
                      <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-semibold">
                        {g.categoria}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{g.descricao}</p>
                    <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-200">
                      <span>Facilitador: {g.responsavelNome}</span>
                      <span>Horário: {g.horarioPadrao}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Encaminhamentos */}
          {activeTab === "encaminhamentos" && (
            <div className="space-y-4">
              {meusEncaminhamentos.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Nenhum encaminhamento registrado.
                </div>
              ) : (
                meusEncaminhamentos.map((e) => (
                  <div
                    key={e.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        Destino: {e.setorDestino}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">
                        {e.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      <strong>Justificativa Técnica:</strong> {e.justificativaTecnica}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
