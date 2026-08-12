import React, { useState, useEffect } from "react";
import { X, Users, Sparkles, CheckCircle2, XCircle, Save } from "lucide-react";
import {
  GrupoAtendimento,
  Paciente,
  SessaoGrupo,
  PresencaParticipante,
} from "../../types";

interface SessaoGrupoModalProps {
  isOpen: boolean;
  onClose: () => void;
  grupos: GrupoAtendimento[];
  pacientes: Paciente[];
  grupoPreSelecionado?: GrupoAtendimento | null;
  onSaveSessao: (sessao: SessaoGrupo) => void;
}

export const SessaoGrupoModal: React.FC<SessaoGrupoModalProps> = ({
  isOpen,
  onClose,
  grupos,
  pacientes,
  grupoPreSelecionado,
  onSaveSessao,
}) => {
  const [grupoId, setGrupoId] = useState("");
  const [temaSessao, setTemaSessao] = useState("");
  const [pautaDetalhada, setPautaDetalhada] = useState("");
  const [sinteseRelato, setSinteseRelato] = useState("");
  const [facilitadorNome, setFacilitadorNome] = useState("Dra. Juliana Mendes");

  // Chamada de Presença (Mapeamento pacienteId => { presente, observacaoIndividual })
  const [presencas, setPresencas] = useState<
    Record<string, PresencaParticipante>
  >({});

  const [gerandoPautaIa, setGerandoPautaIa] = useState(false);

  useEffect(() => {
    if (grupoPreSelecionado) {
      setGrupoId(grupoPreSelecionado.id);
      setFacilitadorNome(grupoPreSelecionado.responsavelNome);
    } else if (grupos.length > 0) {
      setGrupoId(grupos[0].id);
      setFacilitadorNome(grupos[0].responsavelNome);
    }
  }, [grupoPreSelecionado, grupos, isOpen]);

  // Sempre que mudar o grupo selecionado, inicializar lista de presenças
  const grupoAtual = grupos.find((g) => g.id === grupoId);

  useEffect(() => {
    if (grupoAtual) {
      const mapaInicial: Record<string, PresencaParticipante> = {};
      grupoAtual.participantesIds.forEach((pId) => {
        mapaInicial[pId] = {
          presente: true,
          observacaoIndividual: "",
        };
      });
      setPresencas(mapaInicial);
    }
  }, [grupoId]);

  if (!isOpen) return null;

  const togglePresenca = (pacienteId: string) => {
    setPresencas((prev) => ({
      ...prev,
      [pacienteId]: {
        ...prev[pacienteId],
        presente: !prev[pacienteId]?.presente,
      },
    }));
  };

  const handleObservacaoChange = (pacienteId: string, obs: string) => {
    setPresencas((prev) => ({
      ...prev,
      [pacienteId]: {
        ...prev[pacienteId],
        observacaoIndividual: obs,
      },
    }));
  };

  const handleGerarPautaIa = async () => {
    if (!grupoAtual || !temaSessao.trim()) {
      alert("Informe o grupo e o tema da sessão primeiro.");
      return;
    }

    setGerandoPautaIa(true);
    try {
      const res = await fetch("/api/ai/pauta-grupo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeGrupo: grupoAtual.nome,
          categoria: grupoAtual.categoria,
          temaSessao: temaSessao.trim(),
          objetivo: grupoAtual.descricao,
          duracaoMinutos: 60,
        }),
      });

      const data = await res.json();
      if (data.pautaGrupo) {
        setPautaDetalhada(data.pautaGrupo);
      } else {
        alert(data.error || "Erro ao gerar pauta.");
      }
    } catch (err: any) {
      alert("Erro ao gerar pauta com IA: " + err.message);
    } finally {
      setGerandoPautaIa(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grupoAtual || !temaSessao.trim() || !sinteseRelato.trim()) {
      alert("Por favor, informe o tema da sessão e o relato do encontro.");
      return;
    }

    let totalPresentes = 0;
    let totalAusentes = 0;

    Object.values(presencas).forEach((item: PresencaParticipante) => {
      if (item.presente) totalPresentes++;
      else totalAusentes++;
    });

    const novaSessao: SessaoGrupo = {
      id: `sess-${Date.now()}`,
      grupoId: grupoAtual.id,
      grupoNome: grupoAtual.nome,
      dataHora: new Date().toISOString(),
      temaSessao: temaSessao.trim(),
      pautaDetalhada: pautaDetalhada.trim(),
      sinteseRelato: sinteseRelato.trim(),
      facilitadorNome: facilitadorNome.trim(),
      presencas,
      totalPresentes,
      totalAusentes,
    };

    onSaveSessao(novaSessao);
    onClose();
  };

  const membrosInscritos = pacientes.filter((p) =>
    grupoAtual?.participantesIds.includes(p.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Registrar Sessão & Chamada do Grupo</h3>
              <p className="text-xs text-slate-400">
                Atendimento em grupo, controle de presença e relato da atividade
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Grupo & Tema */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Selecione o Grupo *
              </label>
              <select
                value={grupoId}
                onChange={(e) => setGrupoId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold outline-none"
              >
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome} ({g.participantesIds.length} membros)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Facilitador Responsável
              </label>
              <input
                type="text"
                required
                value={facilitadorNome}
                onChange={(e) => setFacilitadorNome(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tema da Sessão / Encontro *
            </label>
            <input
              type="text"
              required
              value={temaSessao}
              onChange={(e) => setTemaSessao(e.target.value)}
              placeholder="Ex: Roda de conversa sobre autocuidado e manejo do estresse"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none"
            />
          </div>

          {/* Pauta com IA */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-slate-700">
                Pauta / Roteiro do Encontro
              </label>
              <button
                type="button"
                onClick={handleGerarPautaIa}
                disabled={gerandoPautaIa}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                {gerandoPautaIa ? "Gerando Pauta..." : "Gerar Roteiro com IA"}
              </button>
            </div>
            <textarea
              rows={3}
              value={pautaDetalhada}
              onChange={(e) => setPautaDetalhada(e.target.value)}
              placeholder="1. Acolhimento e Dinâmica\n2. Discussão em grupo\n3. Encerramento..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
          </div>

          {/* Chamada de Presença */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Users className="w-4 h-4 text-indigo-600" />
                Lista de Presença dos Participantes ({membrosInscritos.length} inscritos)
              </h4>
            </div>

            {membrosInscritos.length === 0 ? (
              <p className="text-slate-400 text-center py-4 bg-slate-50 rounded-lg">
                Nenhum cidadão inscrito neste grupo. Adicione participantes ao grupo primeiro.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {membrosInscritos.map((p) => {
                  const pres = presencas[p.id] || {
                    presente: true,
                    observacaoIndividual: "",
                  };

                  return (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => togglePresenca(p.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors ${
                            pres.presente
                              ? "bg-emerald-600 text-white"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {pres.presente ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Presente
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Ausente
                            </>
                          )}
                        </button>

                        <div>
                          <span className="font-semibold text-slate-900 text-xs">
                            {p.nome}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            CPF: {p.cpf}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 sm:max-w-xs">
                        <input
                          type="text"
                          value={pres.observacaoIndividual || ""}
                          onChange={(e) =>
                            handleObservacaoChange(p.id, e.target.value)
                          }
                          placeholder="Anotação individual na sessão..."
                          className="w-full px-2.5 py-1 bg-white rounded-lg border border-slate-300 text-xs outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Relato / Síntese do Encontro */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Síntese Geral / Relato da Atividade *
            </label>
            <textarea
              rows={3}
              required
              value={sinteseRelato}
              onChange={(e) => setSinteseRelato(e.target.value)}
              placeholder="Descreva a dinâmica realizada, clima do grupo, participações destacadas e encaminhamentos..."
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
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Sessão do Grupo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
