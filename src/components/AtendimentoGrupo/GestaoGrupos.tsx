import React, { useState } from "react";
import {
  Users,
  Plus,
  Calendar,
  CheckCircle2,
  XCircle,
  UserPlus,
  Sparkles,
  Search,
  Clock,
  Building,
  User,
} from "lucide-react";
import {
  GrupoAtendimento,
  SessaoGrupo,
  Paciente,
} from "../../types";

interface GestaoGruposProps {
  grupos: GrupoAtendimento[];
  sessoesGrupo: SessaoGrupo[];
  pacientes: Paciente[];
  onOpenNovoGrupo: () => void;
  onOpenNovaSessao: () => void;
  onAdicionarPacienteAoGrupo: (grupoId: string, pacienteId: string) => void;
}

export const GestaoGrupos: React.FC<GestaoGruposProps> = ({
  grupos,
  sessoesGrupo,
  pacientes,
  onOpenNovoGrupo,
  onOpenNovaSessao,
  onAdicionarPacienteAoGrupo,
}) => {
  const [subTab, setSubTab] = useState<"grupos" | "sessoes">("grupos");
  const [modalInscricaoGrupo, setModalInscricaoGrupo] =
    useState<GrupoAtendimento | null>(null);
  const [pacienteParaInscrever, setPacienteParaInscrever] = useState("");

  const handleInscreverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalInscricaoGrupo || !pacienteParaInscrever) return;

    if (
      modalInscricaoGrupo.participantesIds.includes(pacienteParaInscrever)
    ) {
      alert("Este aluno já está inscrito no grupo.");
      return;
    }

    onAdicionarPacienteAoGrupo(
      modalInscricaoGrupo.id,
      pacienteParaInscrever
    );
    setModalInscricaoGrupo(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Atendimento em Grupo • Acompanhamento Coletivo
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de grupos terapêuticos, socioeducativos, lista de presença e pautas com IA
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNovaSessao}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Registrar Sessão / Chamada</span>
          </button>

          <button
            onClick={onOpenNovoGrupo}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Grupo</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl">
        <button
          onClick={() => setSubTab("grupos")}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            subTab === "grupos"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Grupos Ativos ({grupos.filter((g) => g.status === "Ativo").length})
        </button>
        <button
          onClick={() => setSubTab("sessoes")}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            subTab === "sessoes"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Diário de Sessões e Presença ({sessoesGrupo.length})
        </button>
      </div>

      {/* SUBTAB 1: GRUPOS ATIVOS */}
      {subTab === "grupos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grupos.map((grp) => {
            const numMembros = grp.participantesIds.length;
            const porcentagemVagas = Math.round(
              (numMembros / grp.maxVagas) * 100
            );

            return (
              <div
                key={grp.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {grp.categoria}
                    </span>

                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {grp.frequencia}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {grp.nome}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {grp.descricao}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50/80 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-200/50">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Facilitador: <strong>{grp.responsavelNome}</strong> ({grp.responsavelCargo})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{grp.horarioPadrao}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{grp.localSala}</span>
                    </div>
                  </div>

                  {/* Barra de Vagas */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Membros Inscritos</span>
                      <span>
                        {numMembros} de {grp.maxVagas} vagas ({porcentagemVagas}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full transition-all"
                        style={{ width: `${Math.min(porcentagemVagas, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setModalInscricaoGrupo(grp);
                      setPacienteParaInscrever(
                        pacientes.length > 0 ? pacientes[0].id : ""
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Inscrever Aluno</span>
                  </button>

                  <button
                    onClick={onOpenNovaSessao}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Realizar Chamada</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: DIÁRIO DE SESSÕES */}
      {subTab === "sessoes" && (
        <div className="space-y-4">
          {sessoesGrupo.length === 0 ? (
            <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
              Nenhuma sessão de grupo registrada ainda.
            </div>
          ) : (
            sessoesGrupo.map((ses) => {
              const taxaPresenca =
                ses.totalPresentes + ses.totalAusentes > 0
                  ? Math.round(
                      (ses.totalPresentes /
                        (ses.totalPresentes + ses.totalAusentes)) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={ses.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        {ses.grupoNome}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-0.5">
                        Tema: {ses.temaSessao}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg inline-block">
                        {ses.totalPresentes} Presentes / {ses.totalAusentes} Ausentes ({taxaPresenca}% frequência)
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {new Date(ses.dataHora).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  {ses.pautaDetalhada && (
                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs">
                      <span className="font-bold text-slate-700 block mb-1">
                        Pauta / Roteiro da Sessão:
                      </span>
                      <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                        {ses.pautaDetalhada}
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs">
                    <span className="font-bold text-indigo-950 block mb-1">
                      Relato do Facilitador ({ses.facilitadorNome}):
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {ses.sinteseRelato}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal Inscrever Aluno no Grupo */}
      {modalInscricaoGrupo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Inscrever no {modalInscricaoGrupo.nome}
              </h3>
              <button
                onClick={() => setModalInscricaoGrupo(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInscreverSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Selecione o Aluno / Paciente
                </label>
                <select
                  value={pacienteParaInscrever}
                  onChange={(e) => setPacienteParaInscrever(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                >
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} (CPF: {p.cpf})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalInscricaoGrupo(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow"
                >
                  Confirmar Inscrição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
